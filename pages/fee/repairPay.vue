<template>
	<view>
		<scroll-view scroll-y>
			<view class="block__title">{{ $t('repairPay.repairInfo') }}</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.orderNo') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{repairId}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.repairType') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{repairTypeName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.repairLocation') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{repairObjName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.repairUser') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{repairName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.repairContent') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{remark}}</text>
					</view>
				</view>
			</view>
			<view class="block__title">{{ $t('repairPay.feeInfo') }}</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.feeId') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeInfo.feeId }}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('repairPay.amount') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeInfo.amount + $t('repairPay.yuan') }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">

			<view class="action text-orange margin-right line-height">
				{{ $t('repairPay.total') }}：{{feeInfo.amount}}{{ $t('repairPay.yuan') }}
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('repairPay.submitOrder') }}</button>
			</view>


		</view>
	</view>
</template>

<script>
	import {
		date2String
	} from '../../lib/java110/utils/DateUtil.js'
	import {getUserId} from '../../api/user/userApi.js';

	import { listFeeByAttr } from '@/api/fee/feeApi.js';
	import { queryUserRepair } from '@/api/repair/repairApi.js';


	export default {
		data() {
			return {
				communityId: '',
				communityName: '',
				repairId: '',
				appId: '',
				repairInfo: {},
				feeInfo: {},
				userId: '',
				payerObjId: '',
				payerObjType: '3333',
				endTime: '',
				repairTypeName: '',
				repairObjName: '',
				repairName: '',
				remark: '',
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.communityId = options.communityId;
			this.repairId = options.repairId;
			this.userId = options.userId;
			this.payerObjId = options.repairObjId;
			this.endTime = date2String(new Date(options.appointmentTime.replace(/-/g, "/")));
			this.repairTypeName = options.repairTypeName;
			this.repairObjName = options.repairObjName;
			this.repairName = options.repairName;
			this.remark = options.context

			this._loadRepair();
			this._listFee();
		},

		methods: {
			/**
			 * 加载我的报修
			 * 
			 */
			_listFee: function() {
				let _that = this;
				listFeeByAttr({
					communityId: _that.communityId,
					page: 1,
					row: 1,
					specCd: '390001',
					value: _that.repairId
				}).then(function(_data) {
					_that.feeInfo = _data[0];
				}).catch(function() {
					uni.showToast({
						title: _that.$t('repairPay.queryFeeFailed'),
						icon: 'none'
					});
				});
			},
			_loadRepair: function() {
				let _that = this;
				queryUserRepair({
					communityId: _that.communityId,
					page: 1,
					row: 1,
					userId: _that.userId,
					repairId: _that.repairId
				}).then(function(_data) {
					_that.repairInfo = _data.data[0];
				}).catch(function() {
					uni.showToast({
						title: _that.$t('repairPay.queryRepairFailed'),
						icon: 'none'
					});
				});
			},
			onPayFee: function() {
				uni.showLoading({
					title: this.$t('repairPay.processing')
				});
				let _that = this;
				let _tradeType = 'JSAPI';
				let _receivedAmount = this.feeInfo.feePrice;
				let _payFees = [{
					configId: _that.feeInfo.configId,
					payFees: [_that.feeInfo]
				}];
				let _objData = {
					business: "oweFee",
					feeConfigs: _payFees,
					communityId: _that.communityId,
					feeName: _that.$t('repairPay.repairFee'),
					receivedAmount: _receivedAmount,
					tradeType: _tradeType
				};
				uni.setStorageSync('doing_cashier', _objData);
				uni.navigateTo({
					url: '/pages/fee/cashier?money=' + _receivedAmount + "&business=oweFee&communityId=" + _that
						.communityId + "&cashierUserId=" + getUserId()
				});
			}
		}
	};
</script>
<style>
	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.block__bottom {
		height: 180rpx;
	}

	.fee-last {
		margin-bottom: 200upx;
	}

	.cu-btn.lgplus {
		padding: 0 20px;
		font-size: 18px;
		height: 100upx;

	}

	.cu-btn.sharp {
		border-radius: 0upx;
	}

	.line-height {
		line-height: 100upx;
	}
</style>