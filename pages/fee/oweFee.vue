<template>
	<view>
		<scroll-view scroll-y class="padding-top ">
			<view v-if="batchFees && batchFees.length >0">
				<view class="cu-list menu " v-for="(payObj,index) in batchFees" :key="index" :data-item="payObj">
					<view class="cu-item  " @click="switchSimplifyFeeFlag(payObj)">
						<view class="content padding-tb-sm">
							<view>
								<view class="text-cut" style="width:150px">{{payObj.payerObjName}}
								</view>
							</view>
							<view class="text-gray text-sm">
								<text class="margin-right-xs">{{payObj.ownerName}}</text>
							</view>
						</view>
						<view class="action ">
							<text class="text-red text-lg">￥{{payObj.oweAmount}}</text>
						</view>
					</view>
					<view v-if="payObj.showFlag == 'Y'">
						<view v-for="(feeConfig,fIndex) in payObj.childs" :key="fIndex">
							<view class="block__title">{{feeConfig.feeName}}</view>
							<checkbox-group class="block" @change="checkboxChange($event,feeConfig)">
								<view class="cu-list menu left-line">
									<view class="cu-item" v-for="(fee,feeIndex) in feeConfig.childs" :key="feeIndex"
										:data-item="fee">
										<view class="padding-tb-sm flex justify-start">
											<view style="line-height: 1.6rem; display: flex; align-items: center;">
												<checkbox :value="fee.feeId">
												</checkbox>
											</view>
											<view class="margin-left-sm" @click="_showDetailFee(fee)">
												<view>
													<view class="text-cut" style="width:220px">
														{{fee.startTime}}~{{fee.endTime}}
													</view>
												</view>
												<view class="text-gray text-sm">
													<text>{{fee.remark}}</text>
												</view>
											</view>
										</view>
										<view class="action">
											<text class="text-red text-sm">￥{{fee.oweAmount}}</text>
										</view>
									</view>
								</view>
							</checkbox-group>
							<view class="cu-list menu left-line margin-top-xs">
								<view class="cu-item" v-for="(discount,discountIndex) in feeConfig.discounts"
									:key="discountIndex" :data-item="discount">
									<view class="padding-tb-sm flex justify-start">
										<view class="margin-left-sm">
											<view>
												<view class="text-cut" style="width:220px">
													{{discount.discountName}}
												</view>
											</view>
											<view class="text-gray text-sm">
												<text>{{discount.ruleName}}</text>
											</view>
										</view>
									</view>
									<view class="action">
										<text class="text-red text-sm">￥{{discount.discountPrice}}</text>
									</view>
								</view>
							</view>

						</view>
					</view>
				</view>

				<vcUserAccount ref="vcUserAccountRef" @getUserAmount="getUserAmount"></vcUserAccount>

			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</scroll-view>
		<view v-if="batchFees.length > 0" class="bg-white  border flex justify-end"
			style="position: fixed;width: 100%;bottom: 0;">
			<view class="action text-orange margin-right line-height">
				合计：{{receivableAmount}}元
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">缴费</button>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/fee/payParkingFee.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import vcUserAccount from '@/components/vc-user-account/vc-user-account.vue';
	import noDataPage from '../../components/no-data-page/no-data-page.vue'

	import {
		addMonth,
		formatDate,
		dateSubOneDay,
		getDate,
	} from '../../lib/java110/utils/DateUtil.js';


	import {
		getCommunityId
	} from '../../api/community/communityApi.js';

	import {
		getUserId
	} from '../../api/user/userApi.js';

	import {
		queryOwnerFees,
		computeAppFeeDiscount
	} from '../../api/fee/feeApi.js'

	import {
		autoLogin
	} from '../../api/user/sessionApi.js';


	export default {
		data() {
			return {
				scrollLeft: 0,
				discount: 0,
				receivableAmount: 0.00,
				communityId: '',
				communityName: '',
				ownerId:'',
				appId: '',
				batchFees: [],
				selectUserAccount: [], // 选中的账户
				accountAmount: 0.0, // 账户金额
			};
		},
		components: {
			noDataPage,
			vcUserAccount,
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			autoLogin(options);
			this.communityId = options.communityId;
			if (!this.communityId) {
				this.communityId = getCommunityId();
			}
			
		},
		onShow() {
			let _that = this;
			_that._loadOwnerFee();
		},
		methods: {
			_loadOwnerFee: function() {
				let _that = this;
				let _objData = {
					page: 1,
					row: 50,
					communityId: this.communityId,
					payObjType: '3333'
				}
				_that.feeIds = [];
				queryOwnerFees(_objData)
					.then(function(_fees) {
						if (!_fees || _fees.length < 1) {
							return;
						}
						_fees = _that._initSelectAll(_fees);
						_that.batchFees = _fees;
						return _fees;
					}, function(error) {
						uni.showToast({
							icon: 'none',
							title: '没有应缴费用'
						})
					});
			},
			_initSelectAll: function(_fees) {
				if (_fees.length < 1) {
					return _fees;
				}
				let _that = this;
				_fees.forEach(_fee => {
					_that.ownerId = _fee.ownerId;
					_fee.childs.forEach(_feeConfig => {
						_feeConfig.selectedFeeIds = [];
						//_feeConfig.selectedFeeIds = _feeConfig.childs.map(_fee => _fee.feeId);
						_feeConfig.childs.map(_fee => {
							_fee.receivedAmount = _fee.oweAmount;
						});
						this._computeDiscount(_feeConfig);
					})
				});
				_fees[0].showFlag = 'Y';
				setTimeout(function(){
					_that.$refs.vcUserAccountRef._listOwnerAccount( _that.communityId);
				},500)
				return _fees;
			},
			checkboxChange: function(e, feeConfig) {
				console.log(e)
				let _that = this;
				feeConfig.selectedFeeIds = e.detail.value;
				this._computeDiscount(feeConfig);
				this._doComputeTotalFee();
			},
			switchSimplifyFeeFlag: function(payerObj) {
				payerObj.showFlag = (payerObj.showFlag == 'Y') ? 'N' : 'Y';
				this.$forceUpdate()
			},
			_doComputeTotalFee: function() {
				let _payObjs = this.batchFees;
				let _totalFee = 0;
				let _discountFee = 0;
				_payObjs.forEach(obj => {
					obj.childs.forEach(_feeConfig => {
						_feeConfig.selectedFeeIds.forEach(_feeId => {
							_feeConfig.childs.forEach(_fee => {
								if (_fee.feeId == _feeId) {
									_totalFee += parseFloat(_fee.receivedAmount);
								}
							})
						})
						if (!_feeConfig.selectedDiscountIds || _feeConfig.selectedDiscountIds.length ==
							0) {
							return;
						}
						// 优惠是负数
						_feeConfig.selectedDiscountIds.forEach(_discountId => {
							_feeConfig.discounts.forEach(_discount => {
								if (_discount.discountId == _discountId) {
									_totalFee += parseFloat(_discount.discountPrice);
									_discountFee += parseFloat(_discount
										.discountPrice);
								}
							})
						})
					})
				});
				
				this.receivableAmount = _totalFee.toFixed(2);
				if(this.receivableAmount > this.accountAmount){
					this.receivableAmount = (this.receivableAmount - this.accountAmount).toFixed(2)
				}else{
					this.receivableAmount = 0;
				}
				this.discount = _discountFee.toFixed(2);
				this.$forceUpdate()

			},
			_computeDiscount: function(_feeConfig) {
				let _that = this;
				if (_feeConfig.selectedFeeIds.length == 0) {
					_feeConfig.discounts = [];
					_feeConfig.selectedDiscountIds = [];
					return;
				}
				computeAppFeeDiscount({
					communityId: this.communityId,
					feeIds: _feeConfig.selectedFeeIds,
				}).then(_json => {
					_feeConfig.discounts = _json.data;
					_feeConfig.selectedDiscountIds = _feeConfig.discounts.map(_discount => _discount
						.discountId);
					_that._doComputeTotalFee();
				})
			},
			getUserAmount: function(_accInfo) {
				// 选中的账户列表
				this.selectUserAccount = _accInfo.selectedAccounts;
				// 账户金额
				this.accountAmount = _accInfo.totalUserAmount;
				this._doComputeTotalFee();
			},
			onPayFee: function() {
				//payOweFee(this);
				let _receivedAmount = this.receivableAmount;
				let _tradeType = 'JSAPI';
				let _fees = this.batchFees;
				let _payFees = [];
				_fees.forEach(_fee => {
					_fee.childs.forEach(_feeConfig => {
						const payFees = _feeConfig.childs.filter(child =>
							_feeConfig.selectedFeeIds.includes(child.feeId)
						);
						_payFees.push({
							configId: _feeConfig.configId,
							payFees: payFees
						});
					});
				});
				if (_payFees.length < 1) {
					uni.showToast({
						icon: 'none',
						title: '未选择费用'
					});
					return;
				}
				let _acctId = '';
				if (this.selectUserAccount && this.selectUserAccount.length > 0) {
					_acctId = this.selectUserAccount[0].acctId;
				}
				let _objData = {
					business: "oweFee",
					feeConfigs: this._payFees,
					communityId: this.communityId,
					ownerId: this.ownerId,
					feeName: '物业费',
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					acctId: _acctId,
				};
				uni.setStorageSync('doing_cashier', _objData);
				uni.navigateTo({
					url: '/pages/fee/cashier?money=' + _receivedAmount + "&business=oweFee&communityId=" + this
						.communityId + "&cashierUserId=" + getUserId()
				})
			},



		}
	};
</script>
<style lang="scss">
	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.cu-list {
		.left-line {
			border-left-style: solid;
			/* 添加这一行 */
			border-left-width: 6upx;
			border-left-color: #3E77FC;
		}

	}

	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 20rpx;
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

	.sub-info {
		background-color: #fff;
		//margin-top: 0.5upx;
		padding: 15upx;

		.sub-info-item {
			width: 45%;
			margin: 10upx 15upx 0upx 15upx;
		}
	}

	/* 在 style 部分添加 */
	::v-deep checkbox .uni-checkbox-input {
		border-width: 2px !important;
		/* 调整边框粗细 */
	}

	::v-deep checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border-width: 2px !important;
		/* 选中状态边框 */
		background-color: #3E77FC !important;
		/* 选中背景色 */
	}

	::v-deep checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
		font-size: 18px !important;
		/* 调整勾选标记大小 */
		line-height: 1 !important;
	}
</style>