<template>
	<view class="index-activities">
		<view class="active_box">
			<view class="active_title">
				<view class="title-left">
					<text class="title-line"></text>
					<text class="title-text">{{ $t('indexActivities.communityDynamics') }}</text>
				</view>
				<view class="more" @click="goToActivites">{{ $t('indexActivities.more') }} ></view>
			</view>
			<view class="active_list" v-if="activites && activites.length > 0">
				<view class="noticesList-list" v-for="(item,index) in activites" :key="index" @click="goToActivitesDetail(item)">
					<view class="notices-info">
						<view class="notices-info-name">{{item.title}}</view>
						<view class="notice-bottom">
							<view>
								<text class="lg text-gray cuIcon-time"></text>
								<text class="notice-startTime margin-left-xs">{{item.startTime}}</text>
							</view>
						</view>
					</view>
					<view class="notices-info-image">
						<image :src="item.src" />
					</view>
				</view>
			</view>
			<view class="active_empty" v-else>
				<text class="text">{{ $t('indexActivities.noActivity') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { loadActivites } from '@/api/index/indexApi.js';
	import { getCommunityId } from '@/api/community/communityApi.js';

	export default {
		data() {
			return {
				activites: []
			};
		},
		methods: {
			async loadActivites() {
				this.activites = await loadActivites({
					page: 1,
					row: 5,
					communityId: getCommunityId(),
					defaultShow: 'Y',
					clientType: 'H5'
				});
			},
			goToActivites() {
				this.vc.navigateTo({ url: '/pages/activites/activites' });
			},
			goToActivitesDetail(item) {
				this.vc.navigateTo({
					url: `/pages/activites/activitesDetail?activitiesId=${item.activitiesId}&title=${item.title}&communityId=${item.communityId}`
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index-activities {
		padding: 0 30rpx 30rpx;

		.active_title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;

			.title-left {
				display: flex;
				align-items: center;
			}

			.title-line {
				width: 8rpx;
				height: 32rpx;
				background: #E60012;
				margin-right: 16rpx;
				border-radius: 4rpx;
			}

			.title-text {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.more {
				font-size: 24rpx;
				color: #999;
			}
		}

		.active_list {
			background: #fff;
			border-radius: 24rpx;
			padding: 0 20rpx;
		}

		.active_empty {
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 100rpx 0;
			border-radius: 24rpx;

			.text {
				font-size: 28rpx;
				color: #999;
			}
		}
	}

	.noticesList-list {
		font-size: 25rpx;
		display: flex;
		width: 100%;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
		color: #6D6D6D;
		justify-content: space-between;

		&:last-child {
			border-bottom: none;
		}
	}

	.notices-info-name {
		margin-top: 10rpx;
		color: #333;
		font-size: 30rpx;
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.notices-info-image image {
		width: 200rpx;
		height: 150rpx;
		margin-left: 20rpx;
		border-radius: 10rpx;
	}

	.notices-info {
		margin-left: 20rpx;
		height: 150rpx;
		flex-direction: column;
		display: flex;
		justify-content: space-between;
	}

	.notice-bottom {
		display: flex;
		text-align: left;
	}

	.notice-bottom view text {
		font-size: 25rpx;
		line-height: 40rpx;
	}
</style>
