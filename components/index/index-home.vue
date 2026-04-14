<template>
	<view class="page-home">
		<!-- 顶部沉浸式背景 -->
		<view class="header-bg">
			<!-- 核心金刚区 -->
			<view class="hero-actions">
				<view class="hero-item" @click="onHeroAction('openDoor')">
					<view class="fa-icon-box">
						<text class="iconfont icon-key"></text>
					</view>
					<text class="hero-text">开门</text>
				</view>
				<view class="hero-item" @click="onHeroAction('visitor')">
					<view class="fa-icon-box">
						<text class="iconfont icon-qrcode"></text>
					</view>
					<text class="hero-text">访客</text>
				</view>
				<view class="hero-item" @click="onHeroAction('payment')">
					<view class="fa-icon-box">
						<text class="iconfont icon-yen"></text>
					</view>
					<text class="hero-text">缴费</text>
				</view>
				<view class="hero-item" @click="onHeroAction('repair')">
					<view class="fa-icon-box">
						<text class="iconfont icon-shield"></text>
					</view>
					<text class="hero-text">报修</text>
				</view>
			</view>
		</view>

		<!-- 浮动卡片(物业账单) -->
		<view class="banner-card" @click="goToPayment">
			<view class="banner-text">
				<view class="banner-title">本月物业账单</view>
				<view class="banner-amount">
					<text class="amount">{{billAmount}}</text>
					<text class="unit">元</text>
				</view>
				<text class="banner-date">{{billDate}}账单</text>
			</view>
			<view class="banner-btn">去支付</view>
		</view>

		<!-- 头条 -->
		<view class="news-bar" @click="goToNotice">
			<view class="news-tag">小区头条</view>
			<view class="news-content">{{latestNotice}}</view>
		</view>

		<!-- 网格菜单 -->
		<view class="grid-menu">
			<view class="grid-item" @click="onGridMenu(item)" v-for="(item, index) in gridMenu" :key="index">
				<text class="grid-icon iconfont" :class="item.icon"></text>
				<text class="grid-text">{{item.name}}</text>
			</view>
		</view>

		<!-- 广告位 -->
		<view class="ad-banner-css" @click="onAdClick">
			<view class="ad-content">
				<view class="ad-title">预缴物业费 9.8折</view>
				<view class="ad-desc">限时开启，年费缴纳赠送家政券</view>
			</view>
			<view class="ad-btn">立即查看</view>
		</view>

		<!-- 社区动态 -->
		<view class="section-header">
			<view class="section-title">社区动态</view>
			<view class="section-more" @click="goToArticleList">更多 ></view>
		</view>
		<view class="article-list">
			<view class="article-item" v-for="(item, index) in articleList" :key="index" @click="goToArticle(item)">
				<view class="article-content">
					<view class="article-title">{{item.title}}</view>
					<view class="article-meta">
						<text class="tag" :class="item.tagClass">{{item.tagText}}</text>
						<text class="article-time">{{item.time}}</text>
					</view>
				</view>
				<view class="article-thumb" :class="item.thumbClass">
					<text class="iconfont" :class="item.icon"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		queryNotices
	} from '@/api/index/indexApi.js';
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';

	export default {
		data() {
			return {
				billAmount: '285.00',
				billDate: '2025年4月',
				latestNotice: '关于本周六小区水箱清洗停水的通知...',
				gridMenu: [
					{ name: '生活缴费', icon: 'icon-bolt c-orange', href: '/pages/fee/oweFee' },
					{ name: '物业费', icon: 'icon-file-dollar c-red', href: '/pages/fee/roomFee' },
					{ name: '车位费', icon: 'icon-parking c-blue', href: '/pages/fee/payParkingFeeList' },
					{ name: '水电充值', icon: 'icon-droplet c-blue', href: '/pages/meter/meter' },
					{ name: '报修记录', icon: 'icon-wrench c-green', href: '/pages/repair/myRepair' },
					{ name: '联系物业', icon: 'icon-phone c-purple', href: '_callProperty' },
					{ name: '社区公告', icon: 'icon-bullhorn c-orange', href: '/pages/notice/index' },
					{ name: '全部', icon: 'icon-ellipsis', href: '/pages/homemaking/homemaking' }
				],
				articleList: [
					{
						title: '【活动】周末露天电影节，邀您共赏《流浪地球2》',
						tagText: '热门',
						tagClass: 'tag-hot',
						time: '4月20日 19:30',
						thumbClass: 'thumb-1',
						icon: 'icon-film'
					},
					{
						title: '关于地下车库地坪漆翻新施工的温馨提示',
						tagText: '公告',
						tagClass: 'tag-notice',
						time: '物业中心',
						thumbClass: 'thumb-2',
						icon: 'icon-paint'
					}
				]
			};
		},
		created() {
			this._loadNotices();
		},
		methods: {
			_loadNotices: function() {
				let that = this;
				queryNotices({
					communityId: getCommunityId(),
					page: 1,
					row: 1,
					noticeTypeCd: '1000,1003',
					clientType: 'H5'
				}).then((notices) => {
					if (notices && notices.length > 0) {
						that.latestNotice = notices[0].title;
					}
				});
			},
			onHeroAction: function(type) {
				let _that = this;
				switch(type) {
					case 'openDoor':
						if (hasLogin()) {
							hasAuthOwner(_that).then(() => {
								_that.vc.navigateTo({ url: '/pages/machine/openDoor' });
							});
						}
						break;
					case 'visitor':
						if (hasLogin()) {
							hasAuthOwner(_that).then(() => {
								_that.vc.navigateTo({ url: '/pages/visit/visitList' });
							});
						}
						break;
					case 'payment':
						if (hasLogin()) {
							hasAuthOwner(_that).then(() => {
								_that.vc.navigateTo({ url: '/pages/fee/oweFee' });
							});
						}
						break;
					case 'repair':
						if (hasLogin()) {
							hasAuthOwner(_that).then(() => {
								_that.vc.navigateTo({ url: '/pages/repair/repair' });
							});
						}
						break;
				}
			},
			onGridMenu: function(item) {
				let _that = this;
				if (item.href === '_callProperty') {
					this.vc.navigateTo({
						url: '/pages/notice/index'
					});
					return;
				}
				if (item.href) {
					this.vc.navigateTo({
						url: item.href
					});
				}
			},
			goToPayment: function() {
				this.vc.navigateTo({
					url: '/pages/fee/roomFee'
				});
			},
			goToNotice: function() {
				this.vc.navigateTo({
					url: '/pages/notice/index'
				});
			},
			goToArticleList: function() {
				this.vc.navigateTo({
					url: '/pages/common/communityPublicityList'
				});
			},
			goToArticle: function(item) {
				this.vc.navigateTo({
					url: '/pages/common/communityPublicityDetail'
				});
			},
			onAdClick: function() {
				this.vc.navigateTo({
					url: '/pages/fee/roomFee'
				});
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

	.header-bg {
		background: linear-gradient(180deg, #FF6B6B 0%, #FF8E8E 100%);
		height: 360rpx;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		padding: 20rpx 30rpx 0;
	}

	.hero-actions {
		display: flex;
		justify-content: space-around;
		color: #fff;
		margin-top: 40rpx;
	}

	.hero-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 26rpx;
		font-weight: 500;
	}

	.fa-icon-box {
		width: 90rpx;
		height: 90rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
		background: rgba(255, 255, 255, 0.2);
	}

	.fa-icon {
		font-size: 40rpx;
	}

	.hero-text {
		color: #fff;
	}

	.banner-card {
		background: #fff;
		margin: -120rpx 30rpx 30rpx 30rpx;
		padding: 30rpx;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 30rpx rgba(255, 107, 107, 0.15);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 2;
	}

	.banner-text {
		.banner-title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 10rpx;
		}

		.banner-amount {
			color: #E60012;
			font-weight: bold;
			font-size: 36rpx;

			.unit {
				font-size: 24rpx;
				font-weight: normal;
				color: #999;
			}
		}

		.banner-date {
			font-size: 20rpx;
			color: #999;
		}
	}

	.banner-btn {
		background: #ffecec;
		color: #E60012;
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		font-weight: bold;
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
		padding: 40rpx;
		border-radius: 24rpx;
		background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.ad-banner-css::before {
		content: '';
		position: absolute;
		right: -40rpx;
		top: -40rpx;
		width: 200rpx;
		height: 200rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}

	.ad-content {
		z-index: 2;

		.ad-title {
			font-size: 36rpx;
			margin-bottom: 10rpx;
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
		z-index: 2;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.section-header {
		margin: 0 30rpx 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: flex;
		align-items: center;

		&::before {
			content: '';
			display: block;
			width: 8rpx;
			height: 32rpx;
			background: #E60012;
			margin-right: 16rpx;
			border-radius: 4rpx;
		}
	}

	.section-more {
		font-size: 24rpx;
		color: #999;
	}

	.article-list {
		background: #fff;
		margin: 0 30rpx 30rpx 30rpx;
		border-radius: 24rpx;
		padding: 0 30rpx;
	}

	.article-item {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}
	}

	.article-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-right: 20rpx;

		.article-title {
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
			line-height: 1.4;
			margin-bottom: 16rpx;
		}

		.article-meta {
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #999;
		}
	}

	.tag {
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		margin-right: 16rpx;
	}

	.tag-hot {
		background: #FFF0F0;
		color: #FF4D4F;
	}

	.tag-notice {
		background: #E6F7FF;
		color: #1890ff;
	}

	.article-thumb {
		width: 180rpx;
		height: 120rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		flex-shrink: 0;

		&.thumb-1 {
			background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
		}

		&.thumb-2 {
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		}
	}
</style>
