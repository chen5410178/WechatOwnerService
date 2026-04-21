<template>
	<view>
		<view class="top_blank"></view>
		<view class="padding-left-xl padding-right-xl margin-top">
			<canvas style="width: 520upx;height: 520upx;  margin: 0 auto;" canvas-id="openDoorQrcode"></canvas>
		</view>
		<view class="text-center">{{ $t('shareQrcodeTip') }}</view>

		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-blue margin-tb-sm lg" @tap="_closeModal()">{{ $t('close') }}</button>
		</view>
	</view>
</template>

<script>
	const qrCode = require('@/lib/weapp-qrcode.js');
	import {
		getMemberId
	} from '../../api/owner/ownerApi.js';
	import {
		getCommunityId,
		getCommunityName
	} from '../../api/community/communityApi.js';
	import {
		queryVisitQrCode
	} from '../../api/visit/visit.js';

	export default {
		data() {
			return {
				communityName: '',
				communityId: '',
				memberId: '',
				qrCode: ''
			};
		},


		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {

			let memberId = getMemberId();
			if (!memberId || '-1' == memberId) {
				uni.showToast({
					icon: 'none',
					title: this.$t('addVisit.houseNotCertified')
				});
				return;
			}

			this.communityId = getCommunityId();
			this.communityName = getCommunityName();
			this._loadQrCode();

		},

		methods: {
			_loadQrCode: function() {
				let _that = this;
				queryVisitQrCode({
					communityId: this.communityId
				}).then(_data => {
					if (_data.code != 0) {
						uni.showToast({
							icon: 'none',
							title: _data.msg
						});
						return;
					}
					_that.qrCode = _data.data.url;
					_that._generatorQrCode();
				})
			},
			_generatorQrCode: function() {
				let _that = this;
				//生成二维码
				new qrCode('openDoorQrcode', {
					text: _that.qrCode ,
					width: 250,
					height: 250,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.L
				})

			},
			_closeModal: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {}
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
	
	.top_blank{
		height: 100upx;
	}

	.button_up_blank {
		height: 40rpx;
	}
</style>