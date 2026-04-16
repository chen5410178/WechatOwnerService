<template>
	<view>

		<scroll-view scroll-y>
			<view class="block__title">{{ $t('parkingSpaceInfo') }}</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('community') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{communityName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('parkingSpaceNo') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{num + '号车位'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('parkingSpaceType') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeTypeCdName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('carNum') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{carNum}}</text>
					</view>
				</view>
			</view>
			<view class="block__title">{{ $t('feeInfo') }}</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('feeId') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feeId }}</text>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">{{ $t('amount') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feePrice + $t('yuanPerMonth') }}</text>
					</view>
				</view>
				<view class="cu-item" v-else>
					<view class="content">
						<text class="text-grey">{{ $t('amount') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{feePrice + $t('yuan') }}</text>
					</view>
				</view>
				<view class="cu-item arrow" v-if="feeFlag == '1003006'">
					<view class="content">
						<text class="text-grey">{{ $t('cycle') }}</text>
					</view>
					<view class="action">
						<picker bindchange="PickerChange" :value="index" :range="feeMonthList" @change="dateChange">
							<view class="picker">
								{{feeMonthName}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="feeFlag != '2006012'">
					<view class="content">
						<text class="text-grey">{{ $t('paymentAfterTime') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{endTime }}</text>
					</view>
				</view>
				<vc-discount ref="vcDiscountRef" @computeFeeDiscount="computeFeeDiscount" :feeId="feeId" :cycles="feeMonth"
				 :communityId="communityId"></vc-discount>


			</view>
		</scroll-view>
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">

			<view class="action text-orange margin-right line-height">
				{{ $t('total') }}：{{receivableAmount}}{{ $t('yuan') }}
			</view>
			<view class="btn-group">
				<!-- #ifdef H5 || MP-WEIXIN -->
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('submitOrder') }}</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="_payWxApp()">{{ $t('submitOrder') }}</button>
				<!-- #endif -->
			</view>
		</view>
	</view>

	</view>
</template>

<script>

	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import {
		getCurCommunity
	} from '../../api/community/communityApi.js'
	import vcDiscount from '@/components/vc-discount/vc-discount.vue'
	import {
		addMonth,
		formatDate,
		date2String
	} from '../../lib/java110/utils/DateUtil.js'


	// #ifdef H5

	const WexinPayFactory = require('../../factory/WexinPayFactory.js');

	// #endif

	export default {
		components: {
			vcDiscount
		},
		computed: {
			computedFeeMonthList() {
				let list = [];
				for (let _index = 1; _index < 7; _index++) {
					list.push(_index * this.paymentCycle + this.$t('months'))
				}
				return list;
			},
			computedFeeMonthName() {
				return this.paymentCycle + this.$t('months');
			}
		},
		data() {
			return {
				showFeeMonth: false,
				feeMonthList: [],
				feeMonthName: '',
				feeMonth: 1,
				endTime: '',
				ordEndTime: '',
				formatEndTime:'',
				amount: 0,
				receivableAmount: 0.00,
				additionalAmount: 0,
				num: '',
				feeTypeCdName: '',
				carNum: '',
				feePrice: 0.00,
				communityId: '',
				communityName: '',
				feeId: '',
				appId: '',
				feeFlag: '',
				paymentCycle: 1,
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			let _that = this;
			// #ifdef MP-WEIXIN
			let accountInfo = uni.getAccountInfoSync();
			this.appId = accountInfo.miniProgram.appId;
			// #endif

			// #ifdef H5
			this.appId = uni.getStorageSync(constant.mapping.W_APP_ID)
			// #endif
			let _fee = JSON.parse(options.fee);
			console.log(_fee);
			let _receivableAmount = _fee.paymentCycle * _fee.feePrice;
			
			getCurCommunity()
			.then(function(_communityInfo){
				_that.communityId = _communityInfo.communityId;
				_that.communityName = _communityInfo.communityName;
			})
				
			let _lastDate = new Date(_fee.endTime);


			this.receivableAmount = _receivableAmount;
			this.num = _fee.num;
			this.feeTypeCdName = _fee.feeTypeCdName;
			this.carNum = _fee.carNum;
			this.feeId = _fee.feeId;
			this.feePrice = _fee.feePrice;

			this.ordEndTime = _fee.endTime;
			this.formatEndTime = date2String(_fee.endTime);
			this.feeFlag = _fee.feeFlag;
			if (this.feeFlag == '2006012') {
				return;
			}
			this.paymentCycle = _fee.paymentCycle;
			this.feeMonth = _fee.paymentCycle;
			this.feeMonthList = this.computedFeeMonthList;
			this.feeMonthName = this.computedFeeMonthName;
			let _endTime = addMonth(_lastDate, parseInt(this.feeMonth));
			this.endTime = formatDate(_endTime);
			var pages = getCurrentPages();
			var prevPage = pages[pages.length - 2]; //上一个页面
			//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			prevPage.needFefresh = false;
			this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId, this.communityId, this.feeMonth);
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			computeFeeDiscount: function(_price) {
				this.receivableAmount = this.receivableAmount - _price;
			},
			dateChange: function(e) {
				console.log("onConfirm", e);
				let _feeMonthName = null;
				_feeMonthName = this.feeMonthList[e.detail.value];
				let _feeMonth = _feeMonthName.replace("个月", "");;

				let _receivableAmount = _feeMonth * this.feePrice;

				let _lastDate = new Date(this.ordEndTime);
				let _newDate = addMonth(_lastDate, parseInt(_feeMonth));

				this.showFeeMonth = false;
				this.feeMonthName = _feeMonthName;
				this.receivableAmount = _receivableAmount;
				this.feeMonth = _feeMonth;
				this.endTime = formatDate(_newDate);
				this.$refs.vcDiscountRef._loadFeeDiscount(this.feeId, this.communityId, this.feeMonth);
			},
			onFeeMonthCancel: function(e) {
				this.showFeeMonth = false;
			},
			_payWxApp: function(_data) {
				let _receivedAmount = this.receivableAmount;
				uni.showLoading({
					title: this.$t('processing')
				});
				let _tradeType = 'APP';
				let _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					feeId: this.feeId,
					feeName: this.$t('parkingFee'),
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					endTime: this.formatEndTime
				};
				context.request({
					url: constant.url.preOrder,
					header: context.getHeaders(),
					method: "POST",
					data: _objData,
					//动态数据
					success: function(res) {

						if (res.statusCode == 200 && res.data.code == '0') {
							let data = res.data; //成功情况下跳转
							let obj = {
								appid: data.appId,
								noncestr: data.nonceStr,
								package: 'Sign=WXPay', // 固定值，以微信支付文档为主
								partnerid: data.partnerid,
								prepayid: data.prepayid,
								timestamp: data.timeStamp,
								sign: data.sign // 根据签名算法生成签名
							}
							// 第二种写法，传对象字符串
							let orderInfo = JSON.stringify(obj)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: orderInfo, //微信、支付宝订单数据
								success: function(res) {
									uni.navigateTo({
										url:"/pages/successPage/successPage?msg=" + encodeURIComponent(_that.$t('paySuccess')) + "&objType=3003"
									})
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
							uni.hideLoading();
							return;
						}

						uni.hideLoading();
						uni.showToast({
							title: this.$t('paymentFailed'),
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						uni.hideLoading();
						uni.showToast({
							title: this.$t('serverError'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			onPayFee: function() {
				let _receivedAmount = this.receivableAmount;
				uni.showLoading({
					title: this.$t('processing'),
				});
				let _tradeType = 'JSAPI';
				let _objData = {
					cycles: this.feeMonth,
					communityId: this.communityId,
					feeId: this.feeId,
					feeName: this.$t('parkingFee'),
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
					appId: this.appId,
					endTime: this.formatEndTime
				}

				context.request({
					url: constant.url.preOrder,
					header: context.getHeaders(),
					method: "POST",
					data: _objData, //动态数据
					success: function(res) {
						console.log(res);
						if (res.statusCode == 200 && res.data.code == '0') {
							let data = res.data;
							// #ifdef MP-WEIXIN
							let _that = this;
							uni.requestPayment({
								'timeStamp': data.timeStamp,
								'nonceStr': data.nonceStr,
								'package': data.package,
								'signType': data.signType,
								'paySign': data.sign,
								'success': function(res) {
									uni.showToast({
										title: _that.$t('paySuccess'),
										duration: 2000
									});
									uni.navigateBack({});
								},
								'fail': function(res) {
									console.log('fail:' + JSON.stringify(res));
								}
							});
							// #endif
							// #ifdef H5
							let _that2 = this;
							WexinPayFactory.wexinPay(data, function() {
								uni.showToast({
									title: _that2.$t('paySuccess'),
									duration: 2000
								});
								uni.navigateBack({});
							});
							// #endif
							uni.hideLoading();
							return;
						}
						uni.hideLoading();
						uni.showToast({
							title: this.$t('paymentFailed'),
							icon: 'none',
							duration: 2000
						})
					},
					fail: function(e) {
						uni.hideLoading();
						uni.showToast({
							title: "服务器异常了",
							icon: 'none',
							duration: 2000
						})
					}
				});
			}
		}
	};
</script>
<style>
	
.ppf_item{
  padding: 0rpx 0rpx 0rpx 0rpx;
}

.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69,90,100,.6);
  padding: 40rpx 30rpx 20rpx;
}

.button_up_blank{
  height: 40rpx;
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
