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
				<view class="banner-title">物业账单</view>
				<view class="banner-amount">
					<text class="amount" v-if="billAmount != '0.00'">{{billAmount}}</text>
					<text class="amount" v-else>暂无账单</text>
					<text class="unit" v-if="billAmount != '0.00'">元</text>
				</view>
				<text class="banner-date" >本期账单</text>
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

		<!-- 社区动态 -->
		<view class="active_box">
			<view class="active_title">
				<view class="title-left">
					<text class="title-line"></text>
					<text class="title-text">社区动态</text>
				</view>
				<view class="more" @click="goToActivites">更多 ></view>
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
				<text class="text">暂无活动哦~</text>
			</view>
		</view>
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
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';
	import {
		queryOwnerFees
	} from '@/api/fee/feeApi.js';
	import {
		loadActivites,
		loadAdverts
	} from '@/api/index/indexApi.js';

	export default {
		data() {
			return {
				billAmount: '0.00',
				billDate: '',
				latestNotice: '暂无公告',
				activites: [],
				adverts: [],
				currentAdIndex: 0,
				gridMenu: [
					{ name: '家庭成员', icon: 'icon-users c-blue', href: '/pages/family/familyList' },
					{ name: '投诉建议', icon: 'icon-message-square c-orange', href: '/pages/complaint/complaint' },
					{ name: '停车月卡', icon: 'icon-car c-green', href: '/pages/fee/payParkingFeeList' },
					{ name: '水电充值', icon: 'icon-droplet c-blue', href: '/pages/meter/meter' },
					{ name: '联系物业', icon: 'icon-phone c-purple', href: '_callProperty' },
					{ name: '小区公示', icon: 'icon-file-text c-red', href: '/pages/common/communityPublicityList' },
					{ name: '缴费记录', icon: 'icon-file-dollar c-orange', href: '/pages/fee/oweFee' }
				]
			};
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: '业主版'
			})
			this.vc.onLoad(options);
			autoLogin(options);
		},
		onShow() {
			this._loadOwnerFee();
			this._loadActivites();
			this._loadAdverts();
		},
		created() {
			this._loadNotices();
		},
		methods: {
			_loadOwnerFee: function() {
				let _that = this;
				let _objData = {
					page: 1,
					row: 50,
					communityId: getCommunityId(),
					payObjType: '3333'
				}
				queryOwnerFees(_objData).then(function(_fees) {
					if (!_fees || _fees.length < 1) {
						_that.billAmount = '0.00';
						return;
					}
					let _totalOwe = 0;
					_fees.forEach(_fee => {
						_fee.childs.forEach(_feeConfig => {
							_feeConfig.childs.forEach(_child => {
								_totalOwe += parseFloat(_child.oweAmount);
							});
						});
					});
					_that.billAmount = _totalOwe.toFixed(2);
				}, function(error) {
					_that.billAmount = '0.00';
				});
			},
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
			_loadActivites: function() {
				let _that = this;
				loadActivites({
					page: 1,
					row: 5,
					communityId: getCommunityId(),
					defaultShow: 'Y',
					clientType: 'H5'
				}).then(function(_acts) {
					_that.activites = _acts;
				});
			},
			_loadAdverts: function() {
				let _that = this;
				loadAdverts({
					communityId: getCommunityId(),
					locationCode: 'INDEX_BANNER',
					clientType: 'H5'
				}).then(function(_adverts) {
					_that.adverts = _adverts;
				}).catch(function() {
					_that.adverts = [];
				});
			},
			onAdChange: function(e) {
				this.currentAdIndex = e.detail.current;
			},
			onAdClick: function(item) {
				if (item && item.url && item.urlHref) {
					this.vc.navigateTo({
						url: item.urlHref
					});
				} else {
					this.vc.navigateTo({
						url: '/pages/fee/oweFee'
					});
				}
			},
			goToActivites: function() {
				this.vc.navigateTo({
					url: '/pages/activites/activitesList'
				});
			},
			goToActivitesDetail: function(item) {
				this.vc.navigateTo({
					url: '/pages/activites/activitesDetail?activitiesId=' + item.activitiesId +
						'&title=' + item.title +
						'&communityId=' + item.communityId
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
					url: '/pages/fee/oweFee'
				});
			},
			goToNotice: function() {
				this.vc.navigateTo({
					url: '/pages/notice/index'
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

	.active_box {
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
