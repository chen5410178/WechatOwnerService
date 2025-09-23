<template>
	<view class="">
		<view class="flex justify-center logo">
			<view class="cu-avatar xl round margin-left logo-lage" :style="{backgroundImage: 'url(' + logoUrl + ')' }">
			</view>
		</view>

		<view class="margin-top padding-left padding-right radius" v-if="!loginByPhone">
			<view class="cu-form-group margin-top">
				<view class="title">用户名</view>
				<input placeholder="请输入用户名" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">密码</view>
				<input placeholder="请输入密码" type="password" name="input" v-model="password"></input>
			</view>
		</view>
		<view class="margin-top padding-left padding-right radius" v-else>
			<view class="cu-form-group margin-top">
				<view class="title">手机号</view>
				<input placeholder="请输入手机号" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">验证码</view>
				<input v-model="password" placeholder="请输入短信验证码" name="input"></input>
				<button class='cu-btn bg-blue shadow' :disabled="btnDisabled"
					@click="sendMsgCode()">{{btnValue}}</button>
			</view>
		</view>

		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-blue lg" @click="_doLogin()">登录</button>
			<!-- #ifdef MP-WEIXIN -->
			<wechat-login ref="wechatLoginRef"></wechat-login>
			<!-- #endif -->
		</view>
		<!-- #ifdef H5 -->
		<view class="padding-lr flex justify-between">
			<view class="text-green" @click="_doLoginPhone()">{{phoneLoginName}}</view>
			<view class="text-green" @click="_doRegister()">注册</view>
		</view>
		<!-- #endif -->

	</view>
</template>

<script>
	var _this;
	import wInput from '@/components/watch-input.vue' //input
	import wButton from '@/components/watch-button.vue' //button
	import {
		sendSmsCode,
		ownerLogin,
	} from '@/api/user/userApi.js'
	import context from '@/lib/java110/Java110Context.js';

	import {
		
		getLoginCode
	} from '@/lib/java110/page/Page.js';
	
	import {
		saveOwnerStorage,
		saveUserLoginInfo,
		removeUserLoginInfo,
		getWAppId,
		saveWAppId,
		getLoginFlag
	} from '@/lib/java110/utils/StorageUtil.js';
	import wechatLogin from '@/components/user/wechat-login.vue';

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
				btnValue: '验证码',
				phoneLoginName: '验证码登录'

			};
		},
		onLoad(option) {
			let that = this;
			this.logoUrl = constant.url.baseUrl + 'logo.png';
			let wAppId = uni.getStorageSync(constant.mapping.W_APP_ID);
			//todo 清除缓存内容，以防 业主后退，然后还显示他的东西 
			uni.clearStorageSync();
			if (wAppId) {
				uni.setStorageSync(constant.mapping.W_APP_ID, wAppId);
			}
			// #ifdef MP-WEIXIN
			setTimeout(function(){
				that.$refs.wechatLoginRef._initWechatLogin();
			},1000)
			// #endif
		},
		components:{
			wechatLogin
		},
		methods: {
			_doLogin: function() {
				let _that = this;
				if (this.username == '') {
					wx.showToast({
						title: '请填写用户名',
						icon: "none"
					});
					return;
				}
				if (this.password == '') {
					wx.showToast({
						title: '请填写密码',
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
