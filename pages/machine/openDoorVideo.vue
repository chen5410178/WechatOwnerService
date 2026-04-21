<template>
	<view>
		<!--#ifdef H5 -->
		<view class="padding-xl" style="height: 600upx;">
			<web-view :src="videoUrl" style="height: 600upx;"></web-view>
		</view>
		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-blue lg" @click="_doOpenDoor()">{{ $t('openDoorVideo.openDoor') }}</button>
			<button class="cu-btn line-orange  margin-tb-sm lg" @click="_goBack()">{{ $t('openDoorVideo.back') }}</button>
		</view>
		<!--#endif -->

		<!-- #ifndef H5 -->
		<view class="padding-xl">
			<web-view :src="videoUrl" @onPostMessage="_onMessage" @message="_onMessage"></web-view>
		</view>
		<!--#endif -->

	</view>
</template>

<script>
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	import {
		listOwnerMachines,
		openDoor,
		getOwnerAcVideoUrl
	} from '@/api/applicationKey/applicationKeyApi.js';

	import conf from '@/conf/config.js';
	import {
		autoLogin
	} from '../../api/user/sessionApi.js';
	export default {
		data() {
			return {
				videoUrl: '',
				machineId: '',
				machineName: '',
				machineCode: '',
				memberId: '',
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.machineName = options.machineName;
			this.machineCode = options.machineCode;
			this.memberId = options.memberId;
			autoLogin(options);
			this._loadVideo();
		},
		methods: {
			_loadVideo: function() {
				let _that = this;
				getOwnerAcVideoUrl({
					machineId: this.machineId,
					communityId: getCommunityId(),
					videoType: 'AccessControl'
				}).then(_data => {
					// #ifndef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/videoOpenDoor.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
					// #ifdef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/videoh5.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
					_that.videoUrl = _url;

				})
			},
			_onMessage: function(e) {
				let _data = e.detail.data;
				console.log(e.detail.data);
				this._doOpenDoor();
			},
			_doOpenDoor: function() {
				let _that = this;
				uni.showLoading({
					title: this.$t('openDoorVideo.processing')
				});
				openDoor({
					communityId: getCommunityId(),
					userRole: 'owner',
					machineCode: this.machineCode,
					memberId: this.memberId
				}).then((res) => {
					uni.hideLoading();
					let data = res.data;
					let msg = '';
					if (data.code == 0) {
						msg = this.$t('openDoorVideo.requestSentToDoor');
					} else {
						msg = data.msg;
					}
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				}, (err) => {
					uni.hideLoading();
					uni.showToast({
						title: this.$t('openDoorVideo.openDoorFailed'),
						icon: 'none',
						duration: 2000
					});
				})
			},
			_goBack: function() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.cover-box {
		position: fixed;
		bottom: 100px;
		z-index: 999999;
	}
</style>