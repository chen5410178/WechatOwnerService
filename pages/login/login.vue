<template>
	<view class="">
		<view class="flex justify-center logo">
			<view class="cu-avatar xl round margin-left logo-lage" :style="{backgroundImage: 'url(' + logoUrl + ')' }">
			</view>
		</view>

		<view class="margin-top padding-left padding-right radius" v-if="!loginByPhone">
			<view class="cu-form-group margin-top">
				<view class="title">{{ $t('login.username') }}</view>
				<input :placeholder="$t('login.pleaseInputUsername')" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">{{ $t('login.password') }}</view>
				<input :placeholder="$t('login.pleaseInputPassword')" type="password" name="input" v-model="password"></input>
			</view>
		</view>
		<view class="margin-top padding-left padding-right radius" v-else>
			<view class="cu-form-group margin-top">
				<view class="title">{{ $t('login.phone') }}</view>
				<input :placeholder="$t('login.pleaseInputPhone')" name="input" v-model="username"></input>
			</view>
			<view class="cu-form-group border-bottom">
				<view class="title">{{ $t('login.verificationCode') }}</view>
				<input v-model="password" :placeholder="$t('login.pleaseInputCode')" name="input"></input>
				<button class='cu-btn bg-blue shadow' :disabled="btnDisabled"
					@click="sendMsgCode()">{{btnValue}}</button>
			</view>
		</view>

		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-blue lg" @click="_doLogin()">{{ $t('login.loginBtn') }}</button>
			<!-- #ifdef MP-WEIXIN -->
			<wechat-login ref="wechatLoginRef"></wechat-login>
			<!-- #endif -->
		</view>

		<view class="padding-lr flex justify-between">
			<view class="text-green" @click="_doLoginPhone()">{{phoneLoginName}}</view>
			<view class="text-green" @click="_doRegister()">{{ $t('login.register') }}</view>
		</view>


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
				btnValue: '',
				phoneLoginName: ''

			};
		},
		computed: {
			btnValue() {
				return this.$t('login.verificationCode');
			},
			phoneLoginName() {
				return this.loginByPhone ? this.$t('login.passwordLogin') : this.$t('login.codeLogin');
			}
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
					uni.showToast({
						title: this.$t('login.pleaseInputUsername'),
						icon: "none"
					});
					return;
				}
				if (this.password == '') {
					uni.showToast({
						title: this.$t('login.pleaseInputPassword'),
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
