<template>
	<view>

		<view class="bg-white money-info text-center">
			<view class="money-black"></view>
			<view class="money-title">{{ $t('orderAmount') }}</view>
			<view class="money-value">{{money}}</view>
		</view>

		<view class="padding-sm">
			<view class="block__title">{{ $t('useIntegral') }}</view>
			<checkbox-group @change="_checkIntegral" >
				<view class="cu-list menu">
					<view class="cu-item ">
						<view class="content padding-tb-sm">
							<view>
								<view class="text-cut" style="width:220px">
									<!---->
									<checkbox value="Y" v-if="integral <=0" disabled="true"/>
									<checkbox value="Y" v-else/>
								</view>
							</view>
						</view>
						<view class="action">
							<text class="text-grey text-sm">{{integral}}{{ $t('integralUnit') }}</text>
						</view>
					</view>
				</view>
			</checkbox-group>
			<view class="text-right" @click="_viewGetIntegral()">{{ $t('howGetIntegral') }}</view>
		</view>

		<view class="cu-bar btn-group" style="margin-top: 30px;" v-if="!appId">
			<button disabled="disabled" class="cu-btn bg-blue shadow-blur round lg">{{ $t('confirmPayment') }}</button>
		</view>
		<view class="cu-bar btn-group" style="margin-top: 30px;" v-else>
			<button @click="_submit" class="cu-btn bg-blue shadow-blur round lg" :disabled="banButton">{{ $t('confirmPayment') }}</button>
		</view>

		<tips ref="tipRef"></tips>

	</view>
</template>

<script>
	import {
		isNotNull
	} from '../../lib/java110/utils/StringUtil.js';
	import {
		refreshUserOpenId,
		getOpenIdFromAliPay,
		getWechatMiniOpenId,
		getCommunityWechatAppId
	} from '../../api/user/userApi.js';
	import {
		isWxOrAli
	} from '../../lib/java110/utils/EnvUtil.js';

	import {
		cashierPayFee
	} from '../../api/fee/feeApi.js';

	import tips from '@/components/owner/tips.vue';

	import {
		hasLogin
	} from '../../api/user/sessionApi.js';
	import {
		queryUserIntegral
	} from '@/api/user/userApi.js';

	export default {
		data() {
			return {
				communityId: '',
				orgMoney:0.0,
				money: 0.0,
				business: '',
				openId: '',
				appId: '',
				data: {},
				appId: '',
				cashierUserId: '',
				banButton: false, // 禁用支付按钮
				useIntegral:'N',
				integral: 0,
				integralMoney:0,
			}
		},
		mounted() {
			// #ifdef H5
			if (isWxOrAli() == "ALIPAY") {
				const oScript = document.createElement('script');
				oScript.type = 'text/javascript';
				oScript.src = 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js';
				document.body.appendChild(oScript);
			}
			// #endif
		},
		onLoad(options) {
			this.openId = options.openId;
			this.communityId = options.communityId;
			this.cashierUserId = options.cashierUserId;
			let _that = this;
			this._loadAppId(function() {
				if (!isNotNull(_that.openId)) {
					//刷新 openId
					// #ifdef H5
					if (isWxOrAli() == 'ALIPAY') {
						_that._refreshAliPayOpenId();
						return;
					}
					//todo h5 情况
					_that._refreshWechatOpenId();
					return;
					// #endif

					// #ifdef MP-WEIXIN
					_that._refreshWechatMiniOpenId();
					// #endif
				}
			});


			this.money = options.money;
			this.orgMoney = options.money;
			this.business = options.business;
			this.data = uni.getStorageSync('doing_cashier');

			if (hasLogin()) {
				//todo 如果登录了查询用户积分
				this._loadUserIntegral();

			}

		},
		components: {
			tips
		},
		methods: {
			_loadAppId: function(_call) {
				let _objType = "1100"; // todo public
				// #ifdef MP-WEIXIN
				_objType = "1000";
				// #endif

				let _that = this;
				getCommunityWechatAppId({
					communityId: this.communityId,
					objType: _objType
				}).then(_data => {
					_that.appId = _data.data;
					_call();
				})
			},
			_refreshWechatOpenId: function() {
				let _redirectUrl = window.location.href;
				refreshUserOpenId({
					redirectUrl: _redirectUrl,
					wAppId: this.appId,
				}).then(_data => {
					if (_data.code == 0) {
						window.location.href = _data.data.openUrl;
						return;
					}
				});
			},
			_refreshWechatMiniOpenId: function() {
				let _that = this;
				uni.login({
					success: function(loginRes) {
						if (!loginRes.code) {
							return;
						}
						let accountInfo = uni.getAccountInfoSync();
						let appId = accountInfo.miniProgram.appId;
						getWechatMiniOpenId({
							code: loginRes.code,
							appId: appId,
						}).then(_data => {
							if (_data.code != 0) {
								uni.showToast({
									icon: 'none',
									title: _data.msg
								})
								return;
							}
							_that.openId = _data.data;
						})

					},
					fail: function(error) {
						// 调用 wx.login 接口失败
						console.log('调用wx.login获取code失败');
						console.log(error);
					}
				});
			},
			_submit: function() {
				if (!this.appId) {
					uni.showToast({
						icon: 'none',
						title: this.$t('paymentNotConfigured')
					});
					return;
				}
				this.banButton = true;
				let _data = this.data;
				_data.business = this.business;
				_data.tradeType = 'JSAPI';
				_data.appId = this.appId;
				_data.cashierUserId = this.cashierUserId;
				_data.openId = this.openId;
				_data.useIntegral = this.useIntegral;
				cashierPayFee(this, _data)
			},
			_loadUserIntegral: function() {
				let _that = this;
				queryUserIntegral({
					page: 1,
					row: 1,
				}).then(_data=>{
					_that.integral = _data.integral;
					_that.integralMoney = _data.integralMoney;
				})
			},
			_checkIntegral:function(e){
				console.log(e);
				
				let _value = e.detail.value;
				if(!_value || _value.length < 1){
					this.useIntegral = 'N';
					this.money = this.orgMoney;
					return;
				}
				
				this.useIntegral = 'Y';
				if(parseFloat(this.integralMoney)>parseFloat(this.orgMoney)){
					this.money = 0;
					return;
				}
				this.money = parseFloat(this.orgMoney) - parseFloat(this.integralMoney);
				this.money = this.money.toFixed(2);
			},
			_viewGetIntegral: function() {
				let _content = this.$t('getIntegralTip');
				this.$refs.tipRef.openTip(this.$t('howGetIntegral'), _content);
			}
		}
	}
</script>

<style lang="scss">
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 0rpx 30rpx 20rpx;
	}

	.money-info {
		height: 400upx;
		margin: 20upx;

		.money-black {
			height: 120upx;
		}

		.money-title {
			font-size: 32upx;
		}

		.money-value {
			color: #e54d42;
			margin-top: 20upx;
			font-size: 64upx;
		}
	}
</style>