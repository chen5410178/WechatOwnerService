<template>
	<view>
		<view>
			<view class="cu-list menu">
				<view class="cu-item arrow" @click="settingHeadImg()">
					<view class="content">
						<text class="cuIcon-emojiflashfill text-pink"></text>
						<text class="text-grey">{{ $t('settings.myAvatar') }}</text>
					</view>
					<view class="action">
						<view class="cu-avatar round " :style="{backgroundImage: 'url(' + headerImg + ')'}"></view>
					</view>
				</view>
				<view class="cu-item arrow" @click="_toPage('/pages/settings/changeOwnerPhone')">
					<view class="content">
						<text class="cuIcon-mobilefill text-cyan"></text>
						<text class="text-grey">{{ $t('settings.phone') }}</text>
					</view>
					<view class="action">

					</view>
				</view>
				<view class="cu-item arrow" @click="_toPage('/pages/settings/changePassword')">
					<view class="content">
						<text class="cuIcon-warnfill text-cyan"></text>
						<text class="text-grey">{{ $t('settings.password') }}</text>
					</view>
					<view class="action">

					</view>
				</view>
			</view>
			<view class="cu-list menu">
				<view class="cu-item arrow" @click="switchLanguage">
					<view class="content">
						<text class="cuIcon-global text-cyan"></text>
						<text class="text-grey">{{ $t('settings.language') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{ currentLanguageName }}</text>
					</view>
				</view>
				<view class="cu-item arrow" @click="_toPage('/pages/my/viewAdmin')">
					<view class="content">
						<text class="cuIcon-questionfill text-cyan"></text>
						<text class="text-grey">{{ $t('settings.support') }}</text>
					</view>
					<view class="action">

					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-warn text-green"></text>
						<text class="text-grey">{{ $t('settings.version') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">V2.0</text>
					</view>
				</view>

			</view>

	


		</view>
		
		<!--#ifdef MP-WEIXIN -->
		 <canvas canvas-id="materCanvas" style="display: none;" type="2d" id="materCanvas"></canvas>
		 <!--#endif -->
	</view>
</template>

<script>
	
	import context from '../../lib/java110/Java110Context.js'
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';
	import {refreshOwner} from '@/api/owner/ownerApi.js';
	import {loadLoginOwner,getMemberId,hasAuthOwner} from '../../api/owner/ownerApi.js';
	import {getCommunityId,getCommunityName}  from '../../api/community/communityApi.js';
	import conf from '@/conf/config.js';
	const constant = context.constant;
	const factory = context.factory;
	
	export default {
		data() {
			return {
				headerImg: null,
				imageList: [],
				logoutUser: false,
				login: true
			}
		},
		computed: {
			currentLanguageName() {
				const langMap = {
					'zh-CN': '中文',
					'en': 'English',
					'zh-TW': '繁體中文'
				};
				return langMap[this.$i18n.locale] || '中文';
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			const userInfo = uni.getStorageSync(constant.mapping.OWNER_INFO);
			if (userInfo == null || userInfo == '') {
				this.login = false;
				return;
			}
			this.loadOwnerHeaderImg();
			
		},
		methods: {
			settingHeadImg: function() {
				var _that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.showToast({
							title: _that.$t('settings.uploading'),
							icon: 'loading',
							mask: true,
							duration: 1000
						});
						var tempFilePaths = res.tempFilePaths
						console.log('头像地址', tempFilePaths);
						TanslateImage.translate(_that,tempFilePaths[0], (_baseInfo) => {
							_that.headerImg = _baseInfo;
							_that._uploadOwnerHeaderImg();
							uni.hideLoading()
						})
					}
				})
			},
			/**
			 * 查询业主头像
			 */
		loadOwnerHeaderImg: function() {
				let _that = this;
				
				loadLoginOwner({
					memberId:getMemberId(),
					communityId:getCommunityId()
				}).then(_data=>{
					//console.log(_data);
					if(_data.faceUrl){
						_that.headerImg = _data.faceUrl;
					}else{
						_that.headerImg =conf.imgUrl+'/h5/images/serve/head.png';
					}
				})
			},
			_uploadOwnerHeaderImg: function() {
				let _that = this;
				context.getOwner(function(_owner) {
					let _memberId = _owner.memberId;
					let _communityId = _owner.communityId;
					let obj = {
						memberId: _memberId,
						communityId: _communityId,
						photo: _that.headerImg
					};
					context.request({
						url: constant.url.uploadOwnerPhoto,
						header: context.getHeaders(),
						method: "POST",
						data: obj,
						success: function(res) {
							console.log(res);
							if (res.statusCode != 200) {
								uni.showToast({
									title: this.$t('settings.uploadAvatarFailed'),
									icon: 'none',
									duration: 2000
								});
								return;
							}
							
							_that.loadOwnerHeaderImg();
						},
						fail: function(e) {
							uni.showToast({
								title: this.$t('settings.serverError'),
								icon: 'none',
								duration: 2000
							});
						}
					});
				});

			},
			//退出系统
			_logout: function() {
				this.logoutUser = true;
			},
			_cancleLogout: function() {
				this.logoutUser = false;
			},
			_toPage: function(_url) {
				this.vc.navigateTo({
					url: _url
				});
			},
			switchLanguage: function() {
				const _that = this;
				const languageList = [
					{ name: '中文', value: 'zh-CN' },
					{ name: 'English', value: 'en' },
					{ name: '繁體中文', value: 'zh-TW' }
				];
				uni.showActionSheet({
					itemList: languageList.map(item => item.name),
					success: function(res) {
						const selected = languageList[res.tapIndex];
						_that.$i18n.locale = selected.value;
						uni.setStorageSync('language', selected.value);
						uni.showToast({
							title: _that.$t('settings.switchSuccess'),
							icon: 'success'
						});
					}
				});
			},
			_doLogoutUser: function() {
				let _data = {
					token: uni.getStorageSync('token')
				}
				let that = this;
				context.request({
					url: constant.url.userLogout,
					header: context.getHeaders(),
					method: "POST",
					data: _data,
					success: function(res) {
						if (res.statusCode != 200) {
							uni.showToast({
								icon: "none",
								title: res.data
							});
							return;
						}
						let wAppId = uni.getStorageSync(constant.mapping.W_APP_ID);
						uni.clearStorageSync();
						if (wAppId != null && wAppId != undefined && wAppId != '') {
							uni.setStorageSync(constant.mapping.W_APP_ID, wAppId);
						}
						that.vc.navigateTo({
							url: '/pages/login/login'
						});
					},
					fail: function(error) {
						// 调用服务端登录接口失败
						uni.showToast({
							title: '调用接口失败'
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
