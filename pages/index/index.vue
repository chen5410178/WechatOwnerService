<template>
	<view class="page-home">
		<index-top ref="indexTop"></index-top>

		<!-- 头条 -->
		<view class="news-bar" @click="goToNotice">
			<view class="news-tag">小区头条</view>
			<view class="news-content">{{latestNotice}}</view>
		</view>

		<!-- 网格菜单 -->
		<view class="grid-menu">
			<view class="grid-item" @click="onGridMenu(item)" v-for="(item, index) in gridMenu" :key="index">
				<view class="grid-icon iconfont" :class="item.icon"></view>
				<text class="grid-text">{{item.name}}</text>
			</view>
		</view>

		<!-- 广告轮播 -->
		<view class="ad-banner-css" @click="onAdClick">
			<swiper v-if="adverts && adverts.length > 0" class="ad-swiper" :autoplay="true" :interval="3000" :circular="true" @change="onAdChange">
				<swiper-item v-for="(item, index) in adverts" :key="index">
					<image :src="item.url" mode="aspectFill" class="ad-image" />
				</swiper-item>
			</swiper>
			<view v-else class="ad-content">
				<view class="ad-text">
					<view class="ad-title">预交物业费 享受优惠</view>
					<view class="ad-desc">限时开启，年费缴纳享减免打折优惠</view>
				</view>
				<view class="ad-btn">立即查看</view>
			</view>
			<view class="ad-indicator" v-if="adverts && adverts.length > 1">
				<view v-for="(item, index) in adverts" :key="index" :class="index == currentAdIndex ? 'active' : ''"></view>
			</view>
		</view>

		<index-activities ref="indexActivities"></index-activities>
		<call-property ref="callPropertyRef"></call-property>
	</view>
</template>

<script>
	import {autoLogin} from '../../api/user/sessionApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		queryNotices
	} from '@/api/index/indexApi.js';
	import {
		loadAdverts
	} from '@/api/index/indexApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';
	import indexTop from '@/components/index/index-top.vue';
	import indexActivities from '@/components/index/index-activities.vue';
	import callProperty from '@/components/index/call-property.vue';

	export default {
		data() {
			return {
				latestNotice: '暂无公告',
				adverts: [],
				currentAdIndex: 0,
				gridMenu: [
					{ name: '家庭成员', icon: 'fa-solid fa-users c-blue', href: '/pages/family/familyList' },
					{ name: '投诉建议', icon: 'fa-solid fa-comment c-orange', href: '/pages/complaint/complaint' },
					{ name: '停车月卡', icon: 'fa-solid fa-car c-green', href: '/pages/fee/payParkingFeeList' },
					{ name: '水电充值', icon: 'fa-solid fa-droplet c-blue', href: '/pages/meter/meter' },
					{ name: '联系物业', icon: 'fa-solid fa-phone-volume c-purple', href: '_callProperty' },
					{ name: '小区公示', icon: 'fa-solid fa-newspaper c-red', href: '/pages/common/communityPublicityList' },
					{ name: '缴费记录', icon: 'fa-solid fa-file-invoice-dollar c-orange', href: '/pages/fee/payFeeDetail' }
				]
			};
		},
		components: {
			indexTop,
			indexActivities,
			callProperty
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: '业主版'
			})
			this.vc.onLoad(options);
			autoLogin(options);
		},
		onShow() {
			this.loadNotices();
			this.loadAdverts();		
			this.$refs.indexActivities.loadActivites();

			if (hasLogin()) {
				this.$refs.indexTop.loadOwnerFee();
			}
		},
		methods: {
			async loadNotices() {
				const notices = await queryNotices({
					communityId: getCommunityId(),
					page: 1,
					row: 1,
					noticeTypeCd: '1000,1003',
					clientType: 'H5'
				});
				if (notices && notices.length > 0) {
					this.latestNotice = notices[0].title;
				}
			},
			async loadAdverts() {
				try {
					this.adverts = await loadAdverts({
						communityId: getCommunityId(),
						locationCode: 'INDEX_BANNER',
						clientType: 'H5'
					});
				} catch (e) {
					this.adverts = [];
				}
			},
			onAdChange(e) {
				this.currentAdIndex = e.detail.current;
			},
			onAdClick(item) {
				if (item && item.url && item.urlHref) {
					this.vc.navigateTo({ url: item.urlHref });
				} else {
					this.vc.navigateToWithLogin({ url: '/pages/fee/oweFee' });
				}
			},
			onGridMenu(item) {
				if (item.href === '_callProperty') {
					this.$refs.callPropertyRef.open();
					return;
				}
				if (item.href) {
					this.vc.navigateToWithLogin({ url: item.href });
				}
			},
			goToNotice() {
				this.vc.navigateTo({ url: '/pages/notice/index' });
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background: #F5F7FA;
	}

	.page-home {
		background: #F5F7FA;
		padding-bottom: 20rpx;
	}

	.news-bar {
		background: #fff;
		margin: 0 30rpx 30rpx 30rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		align-items: center;
	}

	.news-tag {
		font-weight: 800;
		color: #E60012;
		margin-right: 20rpx;
		font-style: italic;
		border-right: 1px solid #eee;
		padding-right: 20rpx;
	}

	.news-content {
		font-size: 26rpx;
		color: #555;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.grid-menu {
		background: #fff;
		margin: 0 30rpx 30rpx 30rpx;
		border-radius: 24rpx;
		padding: 30rpx 10rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		row-gap: 40rpx;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.grid-icon {
			font-size: 48rpx;
			margin-bottom: 16rpx;
		}

		.grid-text {
			font-size: 24rpx;
			color: #333;
		}
	}

	.ad-banner-css {
		margin: 0 30rpx 40rpx 30rpx;
		border-radius: 24rpx;
		overflow: hidden;
		position: relative;
	}

	.ad-swiper {
		width: 100%;
		height: 200rpx;
	}

	.ad-image {
		width: 100%;
		height: 200rpx;
	}

	.ad-indicator {
		position: absolute;
		bottom: 16rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 8rpx;
	}

	.ad-indicator view {
		width: 16rpx;
		height: 6rpx;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 3rpx;
	}

	.ad-indicator view.active {
		background: #fff;
	}

	.ad-content {
		background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
		padding: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
	}

	.ad-text {
		.ad-title {
			font-size: 36rpx;
			margin-bottom: 10rpx;
			font-weight: bold;
		}

		.ad-desc {
			font-size: 24rpx;
			opacity: 0.9;
		}
	}

	.ad-btn {
		background: #fff;
		color: #FF5E62;
		padding: 12rpx 30rpx;
		border-radius: 40rpx;
		font-weight: bold;
		font-size: 24rpx;
	}
</style>
