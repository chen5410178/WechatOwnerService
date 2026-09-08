<template>
	<view class="invoice-page">
		<!-- 顶部金额卡 -->
		<view class="iv-hero">
			<view class="iv-hero-head">
				<text class="iv-title">{{ $t('invoice.title') }}</text>
				<text class="iv-tag">{{ $t('invoice.heroTag') }}</text>
			</view>
			<text class="iv-label">{{ $t('invoice.totalAmount') }}</text>
			<text class="iv-amount">¥{{ totalAmount }}</text>
			<text class="iv-note">{{ $t('invoice.heroNote') }}</text>
		</view>

		<!-- 未开票缴费列表 -->
		<view class="iv-sec-head">
			<text class="iv-sec-title">{{ $t('invoice.unInvoiceList') }} <text class="iv-sec-count">{{ unInvoiceList.length }}</text></text>
			<text class="iv-sec-link" @click="_toInvoiceApply">{{ $t('invoice.allRecords') }}</text>
		</view>
		<view class="iv-list iv-mx" v-if="unInvoiceList.length > 0">
				<view class="iv-order" v-for="(item, index) in unInvoiceList" :key="item.detailId" @click="_selectFee(item)">
				<view class="iv-check" :class="{ on: selectedDetailIds.indexOf(item.detailId) > -1 }">
					<text v-if="selectedDetailIds.indexOf(item.detailId) > -1">✓</text>
				</view>
				<view class="iv-order-info">
					<text class="iv-order-name">{{ item.feeName || '-' }}</text>
					<text class="iv-order-sub"><template v-if="item.cycles">{{ item.cycles }}</template><template v-if="item.startTime || item.endTime"> · {{ item.startTime }} ~ {{ item.endTime }}</template></text>
				</view>
				<text class="iv-fee">¥{{ Number(item.receivedAmount || 0).toFixed(2) }}</text>
			</view>
			<uni-load-more v-if="unInvoiceList.length > 0" :status="unInvoiceStatus" :content-text="loadingContentText" />
		</view>
		<view class="iv-list iv-mx iv-empty" v-else-if="unInvoiceInit">
			<text class="iv-empty-text">{{ $t('invoice.noUnInvoice') }}</text>
		</view>

		<!-- 已开票记录列表 -->
		<view class="iv-sec-head-sec">
			<text class="iv-sec-title">{{ $t('invoice.invoiceList') }} <text class="iv-sec-count">{{ invoiceList.length }}</text></text>
		</view>
		<view class="iv-list iv-mx" v-if="invoiceList.length > 0">
			<view class="iv-order" v-for="(item, index) in invoiceList" :key="item.applyId" @click="_toInvoiceDetail(item)">
				<view class="iv-billed-ic" :class="{ fail: item.state === 'F' }">
					<text>{{ item.state === 'F' ? '!' : '✓' }}</text>
				</view>
				<view class="iv-order-info">
					<text class="iv-order-name">{{ item.invoiceName || '-' }}</text>
					<text class="iv-order-sub">
						{{ _stateText(item) }}
						<template v-if="item.state === 'G' && item.invoiceCode"> · {{ $t('invoice.invoiceNo') }} {{ item.invoiceCode }}</template>
					</text>
					<text class="iv-billed-time" v-if="item.createTime">{{ item.createTime }}</text>
				</view>
				<text class="iv-fee">¥{{ Number(item.invoiceAmount || 0).toFixed(2) }}</text>
			</view>
			<uni-load-more v-if="invoiceList.length > 0" :status="invoiceStatus" :content-text="loadingContentText" />
		</view>
		<view class="iv-list iv-mx iv-empty" v-else-if="invoiceInit">
			<text class="iv-empty-text">{{ $t('invoice.noInvoiceRecord') }}</text>
		</view>

		<!-- 底部操作栏 -->
		<view class="iv-bar" v-if="selectedDetailIds.length > 0">
			<view class="iv-bar-box">
				<text class="iv-bar-txt">{{ $t('invoice.selectedCount', { count: selectedDetailIds.length, amount: selectedAmount }) }}</text>
				<view class="iv-bar-btn" @click="_openInvoiceModal">{{ $t('invoice.applyInvoice') }}</view>
			</view>
		</view>

		<!-- 申请开票弹层 -->
		<view class="iv-mask" v-if="invoiceModalShow" @click="invoiceModalShow = false"></view>
		<view class="iv-sheet" v-if="invoiceModalShow">
			<view class="iv-sheet-head">
				<text class="iv-sheet-title">{{ $t('invoice.applyInvoice') }}</text>
				<text class="iv-sheet-close" @click="invoiceModalShow = false">{{ $t('invoice.close') }}</text>
			</view>
			<view class="iv-sheet-body">
				<view class="iv-type-tabs">
					<view class="iv-type-tab" :class="{ active: invoiceType === 'personal' }" @click="invoiceType = 'personal'">{{ $t('invoice.personal') }}</view>
					<view class="iv-type-tab" :class="{ active: invoiceType === 'company' }" @click="invoiceType = 'company'">{{ $t('invoice.enterprise') }}</view>
				</view>

				<view v-if="invoiceType === 'personal'" class="iv-form-row">
					<text class="iv-form-label">{{ $t('invoice.name') }}</text>
					<input class="iv-form-input" v-model="invoiceName" :placeholder="$t('invoice.namePlaceholder')" />
				</view>
				<view v-else class="iv-form-row">
					<text class="iv-form-label">{{ $t('invoice.companyName') }}</text>
					<input class="iv-form-input" v-model="invoiceName" :placeholder="$t('invoice.companyNamePlaceholder')" />
				</view>
				<view v-if="invoiceType === 'company'" class="iv-form-row">
					<text class="iv-form-label">{{ $t('invoice.taxNo') }}</text>
					<input class="iv-form-input" v-model="invoiceNum" :placeholder="$t('invoice.taxNoPlaceholder')" />
				</view>
				<view class="iv-form-row">
					<text class="iv-form-label">{{ $t('invoice.phone') }}</text>
					<input class="iv-form-input" v-model="invoicePhone" type="number" maxlength="11" :placeholder="$t('invoice.phonePlaceholder')" />
				</view>
				<view class="iv-form-row">
					<text class="iv-form-label">{{ $t('invoice.email') }}</text>
					<input class="iv-form-input" v-model="invoiceEmail" :placeholder="$t('invoice.emailPlaceholder')" />
				</view>

				<view class="iv-sum-row">
					<text class="iv-sum-label">{{ $t('invoice.invoiceAmount') }}</text>
					<text class="iv-sum-value">¥{{ selectedAmount }}</text>
				</view>
				<view class="iv-btn-primary" @click="_submitInvoice">{{ $t('invoice.submit') }}</view>
				<text class="iv-sheet-tip">{{ $t('invoice.sheetTip') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		listAppUnInvoiceFeeDetail,
		listAppInvoiceApply,
		listAppInvoiceHeader,
		saveInvoiceApply
	} from '@/api/invoice/invoiceApi.js';
	import {
		getOwnerId,
		getOwnerName,
		getOwnerTel,
		getMemberId
	} from '@/api/owner/ownerApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				totalAmount: '0.00',
				unInvoiceList: [],
				unInvoicePage: 1,
				unInvoiceStatus: 'more',
				unInvoiceInit: false,
				invoiceList: [],
				invoicePage: 1,
				invoiceStatus: 'more',
				invoiceInit: false,
				unInvoiceTotal: -1,
				invoiceTotal: -1,
				selectedDetailIds: [],
				loadingContentText: {
					contentdown: this.$t('common.loadMore'),
					contentrefresh: this.$t('common.loading'),
					contentnomore: this.$t('common.noMore')
				},
				invoiceModalShow: false,
				invoiceType: 'personal',
				invoiceName: '',
				invoiceNum: '',
				invoicePhone: '',
				invoiceEmail: '',
				submitting: false
			}
		},
		computed: {
			selectedAmount() {
				let _sum = 0;
				this.unInvoiceList.forEach(item => {
					if (this.selectedDetailIds.indexOf(item.detailId) > -1) {
						_sum += Number(item.receivedAmount || 0);
					}
				});
				return _sum.toFixed(2);
			}
		},
		onShow() {
			this._resetLoadData();
			this._loadUnInvoice();
			this._loadInvoiceList();
			this._loadHeading();
		},
		onReachBottom() {
			// 未开票优先加载，无更多后加载已开票
			if (this.unInvoiceTotal === -1 || this.unInvoiceList.length < this.unInvoiceTotal) {
				this._loadUnInvoice();
			} else if (this.invoiceTotal === -1 || this.invoiceList.length < this.invoiceTotal) {
				this._loadInvoiceList();
			}
		},
		methods: {
			_resetLoadData: function() {
				this.unInvoiceList = [];
				this.unInvoicePage = 1;
				this.unInvoiceStatus = 'more';
				this.unInvoiceInit = false;
				this.unInvoiceTotal = -1;
				this.invoiceList = [];
				this.invoicePage = 1;
				this.invoiceStatus = 'more';
				this.invoiceInit = false;
				this.invoiceTotal = -1;
				this.selectedDetailIds = [];
			},
			_loadUnInvoice: function() {
				if (this.unInvoiceStatus == 'noMore') {
					return;
				}
				this.unInvoiceStatus = 'loading';
				let _page = this.unInvoicePage;
				listAppUnInvoiceFeeDetail({
					communityId: getCommunityId(),
					page: _page,
					row: 20
				}).then(res => {
					this.unInvoiceStatus = 'more';
					this.unInvoiceInit = true;
					let _feeDetails = res.data || [];
					_feeDetails.forEach(item => {
						item.startTime = this._formatDate(item.startTime);
						item.endTime = this._formatDate(item.endTime);
					});
					this.unInvoiceList = this.unInvoiceList.concat(_feeDetails);
					this.unInvoicePage = _page + 1;
					this.unInvoiceTotal = res.total;
					this.totalAmount = Number(res.sumTotal || 0).toFixed(2);
					if (this.unInvoiceList.length >= this.unInvoiceTotal) {
						this.unInvoiceStatus = 'noMore';
					}
				}).catch(e => {
					this.unInvoiceStatus = 'noMore';
					this.unInvoiceInit = true;
					console.error('查询未开票缴费失败', e);
				});
			},
			_loadInvoiceList: function() {
				if (this.invoiceStatus == 'noMore') {
					return;
				}
				this.invoiceStatus = 'loading';
				let _page = this.invoicePage;
				listAppInvoiceApply({
					communityId: getCommunityId(),
					page: _page,
					row: 20
				}).then(res => {
					this.invoiceStatus = 'more';
					this.invoiceInit = true;
					let _invoiceApplys = res.data || [];
					_invoiceApplys.forEach(item => {
						item.createTime = this._formatDate(item.createTime);
					});
					this.invoiceList = this.invoiceList.concat(_invoiceApplys);
					this.invoicePage = _page + 1;
					this.invoiceTotal = res.total;
					if (this.invoiceList.length >= this.invoiceTotal) {
						this.invoiceStatus = 'noMore';
					}
				}).catch(e => {
					this.invoiceStatus = 'noMore';
					this.invoiceInit = true;
					console.error('查询已开票记录失败', e);
				});
			},
			_loadHeading: function() {
				// 手机端 App 专用接口：登录用户手机号由后端从登录态推导，前端无需传 userPhone（失败静默，不阻塞表单）
				listAppInvoiceHeader({
					communityId: getCommunityId(),
					page: 1,
					row: 20
				}).then(res => {
					let _headings = res.data || [];
					if (!_headings.length) {
						return;
					}
					let _heading = _headings.find(item => item.isDefault === '1') || _headings[0];
					this._applyHeading(_heading);
				}).catch(e => {
					console.error('查询发票抬头失败', e);
				});
			},
			_applyHeading: function(_heading) {
				if (_heading.headingType === '公司') {
					this.invoiceType = 'company';
					this.invoiceName = _heading.headingName || '';
					this.invoiceNum = _heading.taxNo || '';
				} else {
					this.invoiceType = 'personal';
					this.invoiceName = _heading.headingName || '';
				}
				this.invoicePhone = getOwnerTel() || _heading.phone || '';
				this.invoiceEmail = _heading.email || '';
			},
			_selectFee: function(_item) {
				let _index = this.selectedDetailIds.indexOf(_item.detailId);
				if (_index > -1) {
					this.selectedDetailIds.splice(_index, 1);
				} else {
					this.selectedDetailIds.push(_item.detailId);
				}
			},
			_openInvoiceModal: function() {
				this.invoiceModalShow = true;
				this.invoiceType = 'personal';
				this.invoiceName = '';
				this.invoiceNum = '';
				this.invoicePhone = getOwnerTel() || '';
				this.invoiceEmail = '';
				this._loadHeading();
			},
			_submitInvoice: function() {
				if (this.submitting) {
					return;
				}
				let _invoiceName = this.invoiceName || '';
				let _invoiceNum = this.invoiceNum || '';
				let _invoiceType = this.invoiceType === 'company' ? '2002' : '1001';
				if (!_invoiceName.trim()) {
					this._toast(this.invoiceType === 'company' ? this.$t('invoice.companyNameRequired') : this.$t('invoice.nameRequired'));
					return;
				}
				if (this.invoiceType === 'company' && !_invoiceNum.trim()) {
					this._toast(this.$t('invoice.taxNoRequired'));
					return;
				}
				let _phone = this.invoicePhone || '';
				if (!/^1\d{10}$/.test(_phone)) {
					this._toast(this.$t('invoice.phoneInvalid'));
					return;
				}
				if (!this.selectedDetailIds.length) {
					this._toast(this.$t('invoice.selectFeeTip'));
					return;
				}
				this.submitting = true;
				saveInvoiceApply({
					communityId: getCommunityId(),
					ownerId: getMemberId(),
					ownerName: getOwnerName(),
					invoiceType: _invoiceType,
					invoiceName: _invoiceName.trim(),
					invoiceNum: _invoiceNum.trim(),
					invoiceAddress: '',
					invoiceKind: '普票',
					detailIds: this.selectedDetailIds.slice(),
					email: this.invoiceEmail || '',
					remark: ''
				}).then(res => {
					this.submitting = false;
					uni.showToast({
						icon: 'none',
						title: (res && res.msg) || this.$t('invoice.submitSuccess')
					});
					if (res && res.code == 0) {
						this.invoiceModalShow = false;
						this._resetLoadData();
						this._loadUnInvoice();
						this._loadInvoiceList();
					}
				}).catch(e => {
					this.submitting = false;
					this._toast(typeof e === 'string' ? e : this.$t('invoice.submitFailed'));
				});
			},
			_stateText: function(_item) {
				if (_item.state === 'W') {
					return this.$t('invoice.stateWait');
				}
				if (_item.state === 'G') {
					return this.$t('invoice.stateGet');
				}
				if (_item.state === 'F') {
					return this.$t('invoice.stateFail') + ((_item.remark || '') ? ' · ' + _item.remark : '');
				}
				if (_item.state === 'C') {
					return this.$t('invoice.stateComplete');
				}
				return _item.stateName || _item.state || '';
			},
			_formatDate: function(_str) {
				if (!_str) {
					return '';
				}
				let _time = _str.replace(/\-/g, '/');
				let _date = new Date(_time);
				if (isNaN(_date.getTime())) {
					return _str;
				}
				let _month = ('0' + (_date.getMonth() + 1)).slice(-2);
				let _day = ('0' + _date.getDate()).slice(-2);
				return _date.getFullYear() + '/' + _month + '/' + _day;
			},
			_toInvoiceDetail: function(_item) {
				this.vc.navigateTo({
					url: '/pages/invoice/invoiceDetail?applyId=' + _item.applyId
				});
			},
			_toInvoiceApply: function() {
				this.vc.navigateTo({
					url: '/pages/invoice/invoiceApply'
				});
			},
			_toast: function(_msg) {
				uni.showToast({
					icon: 'none',
					title: _msg
				});
			}
		}
	}
</script>

<style lang="scss">
	.invoice-page {
		background: #F5F7FA;
		padding-bottom: 180rpx;
		min-height: 100vh;
	}

	.iv-mx {
		margin-left: 28rpx;
		margin-right: 28rpx;
	}

	.iv-hero {
		margin: 24rpx 28rpx 0;
		border-radius: 28rpx;
		background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
		padding: 36rpx;
		box-shadow: 0 12rpx 30rpx rgba(230, 0, 18, 0.15);
	}

	.iv-hero-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.iv-title {
		color: #fff;
		font-size: 26rpx;
		font-weight: 700;
	}

	.iv-tag {
		color: #fff;
		font-size: 18rpx;
		background: rgba(255, 255, 255, .2);
		border-radius: 999rpx;
		padding: 6rpx 18rpx;
	}

	.iv-label {
		display: block;
		color: rgba(255, 255, 255, .75);
		font-size: 20rpx;
		margin-top: 24rpx;
	}

	.iv-amount {
		display: block;
		color: #fff;
		font-size: 56rpx;
		font-weight: 700;
		margin-top: 8rpx;
	}

	.iv-note {
		display: block;
		color: rgba(255, 255, 255, .75);
		font-size: 18rpx;
		margin-top: 14rpx;
	}

	.iv-sec-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 32rpx 28rpx 16rpx;
	}

	.iv-sec-head-sec {
		margin: 32rpx 28rpx 16rpx;
	}

	.iv-sec-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #333;
	}

	.iv-sec-count {
		font-size: 24rpx;
		color: #E60012;
		font-weight: 400;
	}

	.iv-sec-link {
		font-size: 22rpx;
		color: #1890ff;
	}

	.iv-list {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(15, 23, 42, .05);
	}

	.iv-order {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1rpx solid #f1f5f9;

		&:last-child {
			border-bottom: none;
		}
	}

	.iv-check {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid #cbd5e1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #fff;
		flex-shrink: 0;
		margin-right: 20rpx;

		&.on {
			background: #E60012;
			border-color: #E60012;
		}
	}

	.iv-order-info {
		flex: 1;
		min-width: 0;
		margin-right: 16rpx;
	}

	.iv-order-name {
		display: block;
		font-size: 24rpx;
		font-weight: 600;
		color: #1e293b;
	}

	.iv-order-sub {
		display: block;
		font-size: 20rpx;
		color: #94a3b8;
		margin-top: 6rpx;
	}

	.iv-fee {
		font-size: 24rpx;
		font-weight: 700;
		color: #0f172a;
		flex-shrink: 0;
	}

	.iv-billed-ic {
		width: 64rpx;
		height: 64rpx;
		border-radius: 20rpx;
		background: rgba(16, 185, 129, .1);
		color: #059669;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 700;
		flex-shrink: 0;
		margin-right: 20rpx;

		&.fail {
			background: rgba(239, 68, 68, .1);
			color: #dc2626;
		}
	}

	.iv-billed-time {
		display: block;
		font-size: 18rpx;
		color: #059669;
		margin-top: 4rpx;
	}

	.iv-empty {
		padding: 60rpx 0;
		text-align: center;
	}

	.iv-empty-text {
		font-size: 24rpx;
		color: #94a3b8;
	}

	.iv-bar {
		position: fixed;
		left: 28rpx;
		right: 28rpx;
		bottom: 40rpx;
		z-index: 200;
	}

	.iv-bar-box {
		background: rgba(15, 23, 42, .95);
		border-radius: 28rpx;
		padding: 22rpx 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, .3);
	}

	.iv-bar-txt {
		font-size: 22rpx;
		color: #fff;
		line-height: 1.4;
	}

	.iv-bar-btn {
		background: #E60012;
		color: #fff;
		font-size: 24rpx;
		font-weight: 700;
		border-radius: 20rpx;
		padding: 18rpx 36rpx;
		margin-left: 20rpx;
		flex-shrink: 0;
	}

	.iv-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 300;
	}

	.iv-sheet {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		border-radius: 28rpx 28rpx 0 0;
		z-index: 301;
	}

	.iv-sheet-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 36rpx 16rpx;
	}

	.iv-sheet-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #333;
	}

	.iv-sheet-close {
		font-size: 22rpx;
		color: #94a3b8;
		padding: 8rpx;
	}

	.iv-sheet-body {
		padding: 0 36rpx 60rpx;
	}

	.iv-type-tabs {
		display: flex;
		background: #f1f5f9;
		border-radius: 20rpx;
		padding: 8rpx;
	}

	.iv-type-tab {
		flex: 1;
		height: 68rpx;
		line-height: 68rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 600;
		border-radius: 16rpx;
		color: #64748b;

		&.active {
			background: #fff;
			color: #E60012;
			box-shadow: 0 2rpx 8rpx rgba(15, 23, 42, .08);
		}
	}

	.iv-form-row {
		margin-top: 20rpx;
	}

	.iv-form-label {
		display: block;
		font-size: 24rpx;
		color: #64748b;
		margin-bottom: 10rpx;
	}

	.iv-form-input {
		border: 1rpx solid #e2e8f0;
		border-radius: 16rpx;
		padding: 0 24rpx;
		margin: 0;
		background: #fff;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		color: #333;
	}

	.iv-sum-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
		border-radius: 20rpx;
		background: rgba(230, 0, 18, .06);
		border: 1rpx solid rgba(230, 0, 18, .1);
		padding: 20rpx 24rpx;
	}

	.iv-sum-label {
		font-size: 22rpx;
		color: #b45309;
	}

	.iv-sum-value {
		font-size: 28rpx;
		font-weight: 700;
		color: #d97706;
	}

	.iv-btn-primary {
		background: #E60012;
		color: #fff;
		font-size: 28rpx;
		font-weight: 700;
		text-align: center;
		border-radius: 20rpx;
		padding: 24rpx 0;
		margin-top: 28rpx;
	}

	.iv-sheet-tip {
		display: block;
		text-align: center;
		font-size: 20rpx;
		color: #94a3b8;
		margin-top: 20rpx;
	}
</style>
