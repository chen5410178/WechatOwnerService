<template>
	<view>

		<view class="padding-xl" style="height: 600upx;">
			<web-view :src="videoUrl" style="height: 600upx;"></web-view>
		</view>

	</view>
</template>

<script>
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	import {
		listOwnerMachines,
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
				videoType:''
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.machineName = options.machineName;
			this.machineCode = options.machineCode;
			this.memberId = options.memberId;
			this.videoType=options.videoType;
			autoLogin(options);
			this._loadVideo();
		},
		methods: {
			_loadVideo: function() {
				let _that = this;
				getOwnerAcVideoUrl({
					machineId: this.machineId,
					communityId: getCommunityId(),
					videoType:this.videoType
				}).then(_data => {
					// #ifndef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/video.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
					// #ifdef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/videoh5.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
					_that.videoUrl = _url;
				});
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