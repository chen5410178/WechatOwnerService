<template>
	<view>
		<view class="block__title">
			<text>{{ $t('visitDetail.qrCode') }}</text>
		</view>
		<view class="u-qrcode" style="text-align: center;">
			<canvas style="width: 520upx;height: 520upx;  margin: 0 auto;" canvas-id="myQrcode" v-show="!needLongTapSaveImg"></canvas>
			<image :src="tempFilePath" style="width: 200px; height: 200px; margin: 0 auto;" v-show="needLongTapSaveImg"></image>
		</view>
		
		<view class="block__title">
			<text>{{ $t('visitDetail.visitInfo') }}</text>
		</view>
		<view class="bg-white margin-bottom padding">
			<view class="flex padding-bottom-xs solid-bottom justify-between">
				<view>{{ $t('visitDetail.auditStatus') }}</view>
				<view class="text-gray">{{visitInfo.stateName}}</view>
			</view>
			<view class="flex margin-top justify-between">
				<view class="text-gray">{{ $t('visitDetail.createTime') }}</view>
				<view class="text-gray">{{visitInfo.createTime}}</view>
			</view>
			<view class="flex margin-top justify-between">
				<view class="text-gray">{{ $t('visitDetail.visitorName') }}</view>
				<view class="text-gray">{{visitInfo.name}}</view>
			</view>
			<view class="flex margin-top-xs justify-between">
				<view class="text-gray">{{ $t('visitDetail.contactWay') }}</view>
				<view class="text-gray">{{visitInfo.phoneNumber}}</view>
			</view>
			<view class="flex margin-top-xs justify-between">
				<view class="text-gray">{{ $t('visitDetail.visitType') }}</view>
				<view class="text-gray">{{visitInfo.visitTypeName}}</view>
			</view>
			<view class="flex margin-top-xs justify-between">
				<view class="text-gray w100">{{ $t('visitDetail.visitCase') }}</view>
				<view class="text-gray">{{visitInfo.visitCase}}</view>
			</view>
			<view class="flex margin-top-xs justify-between">
				<view class="text-gray">{{ $t('visitDetail.estimatedVisitTime') }}</view>
				<view class="text-gray">{{visitInfo.visitTime}}</view>
			</view>
			<view class="flex margin-top-xs justify-between">
				<view class="text-gray">{{ $t('visitDetail.estimatedLeaveTime') }}</view>
				<view class="text-gray">{{visitInfo.departureTime}}</view>
			</view>
			<view class="flex margin-top-xs justify-between" v-if="visitInfo.roomName">
				<view class="text-gray">{{ $t('visitDetail.visitRoom') }}</view>
				<view class="text-gray">{{visitInfo.roomName}}</view>
			</view>
			<view class="flex margin-top-xs justify-between" v-if="visitInfo.ownerName">
				<view class="text-gray">{{ $t('visitDetail.visitOwner') }}</view>
				<view class="text-gray">{{visitInfo.ownerName}}</view>
			</view>
			<view class="flex margin-top-xs justify-between" v-if="visitInfo.carNum">
				<view class="text-gray">{{ $t('visitDetail.visitCar') }}</view>
				<view class="text-gray">{{visitInfo.carNum}}</view>
			</view>
			<view class="flex margin-top-xs justify-between" v-show="visitInfo.msg">
				<view class="text-gray w100">{{ $t('visitDetail.auditRemark') }}</view>
				<view class="text-gray">{{visitInfo.msg}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {
		listOwnerVisit
	} from '../../api/visit/visit.js'
	const qrCode = require('@/lib/weapp-qrcode.js');
		const constant = context.constant;
	const util = context.util;
	import { getCommunityId } from '../../api/community/communityApi.js';
	export default {
		data() {
			return {
				visitInfo: {},
				ownerInfo: {},
				qrcodeValue: '',
				tempFilePath: '',
				communityId:'',
				needLongTapSaveImg: false,
			}
		},
		components: {
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			this.communityId = options.communityId;
			this.$nextTick(() => {
				let _that = this;
				//生成二维码
				new qrCode('myQrcode', {
					text: options.visitId ,
					width: 250,
					height: 250,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.L
				});
			});
			_that._loadVisitInfo(options.visitId);
		},
		onReachBottom : function(){},
		methods: {
			_toTempFilePath: function() {
				let _that = this;
				if(this.tempFilePath == ''){
						uni.showToast({
							title: _that.$t('visitDetail.imageNotGenerated'),
							icon: 'none'
						})
					return;
				}
				//#ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.tempFilePath,
					success: function() {
						uni.showToast({
							title: _that.$t('visitDetail.savedToAlbum'),
							icon: 'none'
						})
					}
				});
				//#endif
				//#ifdef H5
				uni.showToast({
					title: _that.$t('longPressSave')
				})
				//#endif
			},
			
			_loadVisitInfo: function(vId){
				let _that = this;
				let _objData = {
					page: 1,
					row: 1,
					visitId: vId,
					communityId: getCommunityId()
				}
				listOwnerVisit(_objData).then(function(_visits){
					_that.visitInfo = _visits.data[0];
				})
			}
		}
	}
</script>

<style>
	.solid-bottom::after {
		border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
	}

	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.block__title {
		display: flex;
		justify-content: space-between;
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.block__bottom {
		height: 180rpx;
	}
	.u-qrcode{
		width: 256px;
		margin: 0 auto;
	}
	.w100{
		width: 500rpx;
	}
</style>
