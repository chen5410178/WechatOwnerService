<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">{{ $t('changeOwnerPhone.phone') }}</view>
				<input :placeholder="$t('changeOwnerPhone.inputPhone')" type="number" v-model="phone"></input>
				<!-- #ifdef MP-WEIXIN -->
				<!-- <button  class="cu-btn bg-green" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取手机号</button> -->
				<!-- #endif -->
			</view>
		</form>
		
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green lg" @tap="_doChangePhoto()">{{ $t('changeOwnerPhone.confirm') }}</button>
		</view>
		
	</view>
</template>

<script>

	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	const factory = context.factory;
	export default {
		data() {
			return {
				phone:''
			}
		},
		onLoad() {
			
			let _that = this;
			uni.login({
				success: (res) => {
					console.log("login", res);
					_that.wxLogin(res.code);
				}
			})
		},
		methods: {
			wxLogin: function(_code) {
				let _that = this;
				let _appId = '';
				// #ifdef MP-WEIXIN
				let accountInfo = uni.getAccountInfoSync();
				_appId = accountInfo.miniProgram.appId;
				// #endif
				uni.request({
					url: constant.url.loginUrl,
					method: 'post',
					header: context.getHeaders(),
					data: {
						code: _code,
						signature: '',
						encryptedData: '',
						iv: '',
						appId: _appId,
						userInfo:{}
			
					},
					success: function(res) {
						let sessionKey = res.data.sessionKey;
						_that.sessionKey = sessionKey;
						_that.openId = res.data.openId;
					},
					fail: function(error) {
						// 调用服务端登录接口失败
						let sessionKey = res.data.sessionKey;
						_that.sessionKey = sessionKey;
						_that.openId = res.data.openId;
						
					}
				});
			},
			onGetPhoneNumber(e) {
				if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					uni.showToast({
						title: this.$t('changeOwnerPhone.phoneNotAuthorized'),
						icon: "none"
					});
					return;
				}
				let _that = this;
				uni.request({
					url: constant.url.getWxPhoto,
					method: 'post',
					header: context.getHeaders(),
					data: {
						iv: e.detail.iv,
						key: _that.sessionKey,
						decryptData: e.detail.encryptedData,
					},
					success: function(res) {
						let _json = res.data;
						console.log('日志',_json)
						if(_json.code == 0){
							_that.phone = _json.data.phoneNumber;
						}
					},
					fail: function(error) {}
				});
			},
			_doChangePhoto:function(){
				
				if(this.phone == ''){
					uni.showToast({
						icon:'none',
						title: this.$t('changeOwnerPhone.phoneCannotBeEmpty')
					});
					return;
				}
				
				const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO);
				let _userInfo = {
					memberId: userInfo.memberId,
					link: this.phone,
					communityId:userInfo.communityId,
					userId:userInfo.userId
				};
				context.request({
					url: constant.url.changeOwnerPhone,
					header: context.getHeaders(),
					method: "POST",
					data: _userInfo,
					success: function(res) {
						let _json = res.data
						if(_json.code != 0){
							uni.showToast({
								icon:"none",
								title: _json.msg
							});
							return ;
						}	
						uni.navigateBack({
							delta:1
						});
					},
					fail: function(error) {
						// 调用服务端登录接口失败
						uni.showToast({
							title: this.$t('changeOwnerPhone.interfaceFailed')
						});
						console.log(error);
					}
				});	
			}	
		}
	}
</script>

<style>

</style>