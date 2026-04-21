<template>
	<view>
		<form>
			
<view class="cu-form-group margin-top">
				<view class="title">{{ $t('changePassword.oldPassword') }}</view>
				<input :placeholder="$t('changePassword.inputOldPwd')" type="password" name="input" v-model="oldPwd"></input>
			</view>
			<view class="cu-form-group ">
				<view class="title">{{ $t('changePassword.newPassword') }}</view>
				<input :placeholder="$t('changePassword.inputNewPwd')" type="password" name="input" v-model="pwd"></input>
			</view>
			<view class="cu-form-group ">
				<view class="title">{{ $t('changePassword.confirmPassword') }}</view>
				<input :placeholder="$t('changePassword.inputConfirmPwd')" type="password" name="input" v-model="newPwd"></input>
			</view>
		</form>
		
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green lg" @tap="_doChangePwd()">{{ $t('changePassword.submit') }}</button>
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
				oldPwd:'',
				pwd:'',
				newPwd:''
			}
		},
		methods: {
			_doChangePwd:function(){
				
if(this.oldPwd == ''){
					uni.showToast({
						icon:'none',
						title: this.$t('changePassword.passwordCannotBeEmpty')
					});
					return;
				}
				
				if(this.pwd == ''){
					uni.showToast({
						icon:'none',
						title: this.$t('changePassword.newPasswordCannotBeEmpty')
					});
					return;
				}
				
				if(this.newPwd == ''){
					uni.showToast({
						icon:'none',
						title: this.$t('changePassword.confirmPasswordCannotBeEmpty')
					});
					return;
				}
				
				if(this.newPwd != this.pwd){
					uni.showToast({
						icon:'none',
						title: this.$t('changePassword.passwordNotMatch')
					});
					return;
				}
				
				const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO);
				
				
				let _userInfo = {
					userId: userInfo.userId,
					oldPwd: this.oldPwd,
					newPwd: this.newPwd
				};
				
				context.request({
					url: constant.url.changeStaffPwd,
					header: context.getHeaders(),
					method: "POST",
					data: _userInfo,
					success: function(res) {
						if(res.statusCode != 200){
							uni.showToast({
								icon:"none",
								title: res.data
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
							title: this.$t('changePassword.interfaceFailed')
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