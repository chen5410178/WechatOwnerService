<template>
	<view class="">
		<view class="flex justify-center logo">
			<view class="cu-avatar xl round margin-left logo-lage" :style="{backgroundImage: 'url(' + logoUrl + ')' }">
			</view>
		</view>

		<view class="margin-top padding-left padding-right radius" v-if="!loginByPhone">
			<view class="cu-form-group margin-top">
				<view class="title">{{ $t('loginsaveUser.username') }}</view>
				<input :placeholder="$t('loginsaveUser.inputUsername')" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">{{ $t('loginsaveUser.password') }}</view>
				<input :placeholder="$t('loginsaveUser.inputPassword')" type="password" name="input" v-model="password"></input>
			</view>
		</view>
		<view class="margin-top padding-left padding-right radius" v-else>
			<view class="cu-form-group margin-top">
				<view class="title">{{ $t('loginsaveUser.phoneNumber') }}</view>
				<input :placeholder="$t('loginsaveUser.inputPhone')" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">{{ $t('loginsaveUser.verificationCode') }}</view>
				<input v-model="password" :placeholder="$t('loginsaveUser.inputSmsCode')" name="input"></input>
				<button class='cu-btn bg-green shadow' :disabled="btnDisabled"
					@click="sendMsgCode()">{{btnValue}}</button>
			</view>
		</view>

		<view class="padding-left padding-right padding-top flex flex-direction margin-top">
			<button class="cu-btn bg-green lg" @click="_doLogin()">{{ $t('loginsaveUser.loginBtn') }}</button>
			<button class="cu-btn line-orange  margin-tb-sm lg" @click="_doRegister()">{{ $t('loginsaveUser.registerBtn') }}</button>
		</view>
		<view class="padding-right flex justify-end">
			<checkbox-group @change="_changeSaveLogin">
				<checkbox style="transform: scale(0.7)" :checked="loginInfo == 'ON'" ></checkbox>
			</checkbox-group>
			<view class="read-me">
				<text class="margin-left-xs">{{ $t('loginsaveUser.rememberPassword') }}</text>
			</view>
		</view>

	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-input.vue' //input
	import wButton from '../../components/watch-button.vue' //button
	import {
		sendSmsCode,
		ownerLogin,
	} from '../../api/user/userApi.js'
	import context from '../../lib/java110/Java110Context.js';

	import {
		
		getLoginCode
	} from '../../lib/java110/page/Page.js';
	
	import {
		saveOwnerStorage,
		saveUserLoginInfo,
		removeUserLoginInfo,
		getWAppId,
		saveWAppId,
		getLoginFlag
	} from '@/lib/java110/utils/StorageUtil.js'

	const constant = context.constant;
	const factory = context.factory;

	const login = 1; //1标识登录页面 请下发code 不要下发key
	export default {
		data() {
			return {
				logoUrl: '',
				username: '',
				password: '',
				code: "",
				loginByPhone: false,
				msgCode: '',
				btnDisabled: false,
				btnValue: this.$t('loginsaveUser.verificationCode'),
				phoneLoginName: this.$t('loginsaveUser.verificationCodeLogin'),
				loginInfo:'OFF'

			};
		},
		onLoad(option) {
			let that = this;
			this.logoUrl = constant.url.baseUrl + 'logo.png';
			
			let wAppId = uni.getStorageSync(constant.mapping.W_APP_ID);
			let _loginInfo = uni.getStorageSync('logoUserInfo');
			//todo 清除缓存内容，以防 业主后退，然后还显示他的东西 
			uni.clearStorageSync();
			if (wAppId) {
				uni.setStorageSync(constant.mapping.W_APP_ID, wAppId);
			}
			if(_loginInfo){
				this.username = _loginInfo.username;
				this.password = _loginInfo.password;
				this.loginInfo = _loginInfo.loginInfo;
				uni.setStorageSync('logoUserInfo',_loginInfo);
			}
		},
		methods: {
			_changeSaveLogin:function(){
				if(this.loginInfo == 'ON'){
					this.loginInfo = 'OFF';
					uni.removeStorageSync('logoUserInfo');
				}else{
					this.loginInfo = 'ON';
				}
			},
			_doLogin: function() {
				let _that = this;
				if (this.username == '') {
					uni.showToast({
						title: this.$t('loginsaveUser.pleaseInputUsername'),
						icon: "none"
					});
					return;
				}
				if (this.password == '') {
					uni.showToast({
						title: this.$t('loginsaveUser.pleaseInputPassword'),
						icon: "none"
					});
					return;
				}
				let _obj = {
					username: this.username,
					password: this.password,
					code: _that.code,
					appId: this.vc.getWAppId(),
					loginByPhone: this.loginByPhone
				};
				ownerLogin(this,_obj)
					.then((_user) => {
						if(_that.loginInfo == 'ON'){
							uni.setStorageSync('logoUserInfo',{
								username:_that.username,
								password:_that.password,
								loginInfo:_that.loginInfo
							});
						}
						//todo 保存登录信息
						saveUserLoginInfo(_user.userId, _user.token, _user.key);
						uni.navigateTo({
							url:'/pages/login/loginInitWechat?communityId='+_user.communityId
						})
					},err=>{
						uni.showToast({
							icon:'none',
							title:err
						})
					});
			},
			_doRegister: function() {
				//let _url = '/pages/login/registerByWechat';
				let _url = '/pages/login/register';
				this.vc.navigateTo({
					url: _url
				})
			},
			sendMsgCode: function() {
				sendSmsCode(this.username, this);
			},
			_doLoginPhone: function() {
				this.loginByPhone = !this.loginByPhone;
				if (this.loginByPhone) {
					this.phoneLoginName = "密码登录"
				} else {
					this.phoneLoginName = "验证码登录"
				}
				this.username = '';
				this.password = '';
			}

		}
	}
</script>

<style>
	page {
		background-color: #FFF;
	}

	.logo {
		margin-top: 160upx;
		margin-bottom: 140upx;
	}

	.logo .logo-lage {
		height: 180upx;
		width: 180upx;
	}

	.login-nav {
		background-color: #00AA00;
		height: 120upx;
	}

	.login-nav text {
		color: #FFFFFF;
		font-size: 30upx;
	}
</style>
