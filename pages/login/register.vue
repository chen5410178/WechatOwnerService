<template>
	<view>
		<view class="block__title">{{ $t('login.registerInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('login.phone') }}</view>
			<input v-model="link" required label="手机号" clearable :placeholder="$t('login.pleaseInputPhone')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('login.password') }}</view>
			<input v-model="password" required type="password" label="密码" clearable :placeholder="$t('login.pleaseInputPassword')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('login.confirmPassword') }}</view>
			<input v-model="rePassword" required type="password" label="确认密码" clearable :placeholder="$t('login.pleaseConfirmPassword')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('login.verificationCode') }}</view>
			<input v-model="msgCode" :placeholder="$t('login.pleaseInputCode')" name="input"></input>
			<button class='cu-btn bg-green shadow' :disabled="btnDisabled" @click="_sendMsgCode()">{{btnValue}}</button>
		</view>
		<view class="padding flex justify-start">
			<checkbox-group @change="_changeReadme">
				<checkbox style="transform: scale(0.7)" value="readme"></checkbox>
			</checkbox-group>
			<view class="read-me">
				<text class="margin-left-xs">{{ $t('login.iHaveRead') }}</text>
				<text class="user-read" @click="_readMe">{{ $t('login.userNotice') }}</text>
			</view>
		</view>
		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-green   lg" @click="_doRegister()">{{ $t('login.submit') }}</button>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import conf from '../../conf/config';
	import {sendSmsCode,ownerRegiter} from '../../api/user/userApi.js';

	export default {
		data() {
			return {
				link: '',
				second: 60,
				codeMsg: '',
				msgCode: '',
				areaShow: false,
				btnValue: '',
				btnDisabled: false,
				password: '',
				rePassword: '',
				readme:false,
			};
		},
		computed: {
			btnValue() {
				return this.$t('login.verificationCode');
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
		},
		methods: {
			_sendMsgCode: function() {
				sendSmsCode(this.link,this)
			},
			_changeReadme:function(e){
				if(e.detail.value && e.detail.value.length>0){
					this.readme = true;
				}else{
					this.readme =false;
				}
			},
			_doRegister: function(e) {
				let _communityId = uni.getStorageSync("DEFAULT_COMMUNITY_ID")
				if(!_communityId){
					_communityId = conf.DEFAULT_COMMUNITY_ID;
				}
				let obj = {
					"link": this.link,
					"msgCode": this.msgCode,
					"password": this.password,
					"openId": uni.getStorageSync(constant.mapping.CURRENT_OPEN_ID),
					"defaultCommunityId": _communityId
				}
				if(!this.readme){
					uni.showToast({
						title: this.$t('login.pleaseReadNotice'),
						icon: 'none',
						duration: 2000
					})
					return;
				}
				let msg = "";
				if (this.password == '' || this.password != this.rePassword) {
					msg = this.$t('login.passwordNotMatch');
				} else if (obj.link == "") {
					msg = this.$t('login.pleaseInputPhone');
				} else if (obj.msgCode == "") {
					msg = this.$t('login.pleaseInputCode');
				}
				if (msg != "") {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					})
					return;
				}
				ownerRegiter(obj).then(_data=>{
					if (_data.code == 0) {
						uni.hideLoading();
						uni.redirectTo({
							url: "/pages/login/login"
						});
						return;
					}
				});
			},
			change: function(data) {
				let _that = this;
				_that.areaName = '';
				data.data.forEach(function(_obj) {
					_that.areaName += _obj.name;
				});
				_that.areaCode = data.data[2].code;
				console.log(data);
			},
			
			_readMe:function(){
				uni.navigateTo({
					url:'/pages/login/registerProtocol'
				})
			}
		}
	};
</script>
<style>
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
		text-align: center;
	}
	
	.read-me{
		line-height: 64upx;
	}
	
	.user-read{
		margin-left: 10upx;
		color: darkgreen;
	}
</style>
