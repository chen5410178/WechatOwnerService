<template>
	<view class="page-mine">
		<!-- 红色背景头部 -->
		<view class="mine-header-red" @click="goToLogin">
			<view class="avatar">
				<view class="iconfont fa-solid fa-user"></view>
			</view>
			<view class="user-info">
				<view class="user-name">{{userName}}</view>
				<view class="user-addr">{{communityInfo}}</view>
			</view>
		</view>

		<!-- 悬浮的白色资产卡片 -->
		<view class="assets-card">
			<view class="asset-item" @click="goToHouse">
				<view class="asset-num">{{houseCount}}</view>
				<view class="asset-label">房屋</view>
			</view>
			<view class="asset-item" @click="goToCar">
				<view class="asset-num">{{carCount}}</view>
				<view class="asset-label">车辆</view>
			</view>
			<view class="asset-item" @click="goToCoupon">
				<view class="asset-num">{{couponCount}}</view>
				<view class="asset-label">优惠券</view>
			</view>
		</view>

		<!-- 我的服务 -->
		<view class="mine-grid-container">
			<view class="mine-grid-title">我的服务</view>
			<view class="mine-grid-row">
				<view class="mine-grid-item" v-for="(item, index) in serviceList1" :key="index" @click="onServiceClick(item)">
					<view class="icon-wrapper" >
						<view class="iconfont" :class="item.icon"></view>
					</view>
					<text class="item-text">{{item.name}}</text>
				</view>
			</view>
			<view class="mine-grid-row">
				<view class="mine-grid-item" v-for="(item, index) in serviceList2" :key="index" @click="onServiceClick(item)">
					<view class="icon-wrapper" >
						<view class="iconfont" :class="item.icon"></view>
					</view>
					<text class="item-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 设置与认证 -->
		<view class="setting-list">
			<view class="setting-item" @click="goToChangeCommunity">
				<view class="setting-left">
					<view class="iconfont fa-solid fa-building"></view> 切换小区
				</view>
				<view class="setting-right">
					<view class="iconfont fa-solid fa-chevron-right"></view>
				</view>
			</view>
			<view class="setting-item" @click="onAuthClick">
				<view class="setting-left">
					<view class="iconfont fa-solid fa-house-user"></view> 房屋认证
				</view>
				<view class="setting-right">
					<text class="auth-status">{{authStatusText}}</text>
					<view class="iconfont fa-solid fa-chevron-right"></view>
				</view>
			</view>
			<view class="setting-item" @click="goToSetting">
				<view class="setting-left">
					<view class="iconfont fa-solid fa-gear"></view> 设置
				</view>
				<view class="setting-right">
					<view class="iconfont fa-solid fa-chevron-right"></view>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-btn" @click="logout" v-if="isLogin">
			退出登录
		</view>
	</view>
</template>

<script>
	import {
		getCommunityName,
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		getMemberId,
		getOwnerTel,
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import {
		getRooms
	} from '@/api/room/roomApi.js';
	import {
		getCars
	} from '@/api/car/carApi.js';
	import {
		getCouponUsers
	} from '@/api/fee/feeApi.js';
	import {
		getUserName
	} from '@/api/user/userApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';

	export default {
		data() {
			return {
				isLogin: false,
				userName: '请点击登录',
				communityInfo: '登录后查看更多信息',
				houseCount: '0',
				carCount: '0',
				couponCount: '0',
				isAuthOwner: false,
				serviceList1: [
					{ name: '缴费记录', icon: 'fa-solid fa-file-lines c-red', href: '/pages/fee/payFeeDetail' },
					{ name: '报修记录', icon: 'fa-solid fa-screwdriver-wrench c-orange', href: '/pages/repair/myRepair' },
					{ name: '投诉记录', icon: 'fa-solid fa-comment-dots c-blue', href: '/pages/complaint/complaintList' },
					{ name: '空置房', icon: 'fa-solid fa-house-chimney-crack c-orange', href: '/pages/applyRoom/myApplyRoomList' },
					{ name: '装修记录', icon: 'fa-solid fa-paint-roller c-blue', href: '/pages/renovation/myRoomRenovationList' }
				],
				serviceList2: [
					{ name: '门禁日志', icon: 'fa-solid fa-id-card c-purple', href: '/pages/machine/machineTranslateLog' },
					{ name: '开票历史', icon: 'fa-solid fa-receipt c-orange', href: '/pages/invoice/invoiceApply' }
				]
			};
		},
		onLoad: function(options) {
			this.vc.onLoad(options);
		},
		onShow: function() {
			this._checkLogin();
		},
		computed: {
			authStatusText: function() {
				return this.isAuthOwner ? '已认证' : '未认证';
			}
		},
		methods: {
			_checkLogin: function() {
				if (hasLogin()) {
					this.isLogin = true;
					this._loadData();
				} else {
					this.isLogin = false;
					this.userName = '请点击登录';
					this.communityInfo = '登录后查看更多信息';
					this.houseCount = '0';
					this.carCount = '0';
					this.couponCount = '0';
					this.isAuthOwner = false;
				}
			},
			goToLogin: function() {
				if (!this.isLogin) {
					this.vc.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			_loadData: function() {
				let _that = this;
				let _memberId = getMemberId();
				let _ownerTel = getOwnerTel();
				let _communityId = getCommunityId();

				hasAuthOwner(this).then(owner => {
					_that.isAuthOwner = true;
					_that.userName = owner.ownerName || getUserName() ;
					_that.communityInfo = owner.floorNum || getCommunityName() ;
				}, () => {
					_that.isAuthOwner = false;
				});

				getRooms({
					memberId: _memberId,
					communityId: _communityId,
					page:1,
					row:100
				}).then(rooms => {
					_that.houseCount = rooms.rooms ? rooms.rooms.length : '0';
				}).catch(() => {
					_that.houseCount = '0';
				});

				getCars({
					memberId: _memberId,
					communityId: _communityId,
					page:1,
					row:100
				}).then(cars => {
					_that.carCount = cars.length || '0';
				}).catch(() => {
					_that.carCount = '0';
				});

				if (_ownerTel) {
					getCouponUsers({
						page: 1,
						row: 100,
						tel: _ownerTel,
						communityId: _communityId,
						state: '1001'
					}).then(result => {
						let count = 0;
						result.data.forEach(item => {
							if (item.isExpire == 'Y') {
								count += parseInt(item.stock);
							}
						});
						_that.couponCount = count || '0';
					}).catch(() => {
						_that.couponCount = '0';
					});
				}
			},
			onServiceClick: function(item) {
				if (item.href) {
					this.vc.navigateToWithLogin({
						url: item.href
					});
				}
			},
			goToHouse: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/my/myHouse'
				});
			},
			goToCar: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/car/ownerCars'
				});
			},
			goToCoupon: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/coupon/myCoupons'
				});
			},
			onAuthClick: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/index/authOwnerLog'
				});
			},
			goToChangeCommunity: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/my/changeOwnerCommunity'
				});
			},
			goToSetting: function() {
				this.vc.navigateToWithLogin({
					url: '/pages/settings/settings'
				});
			},
			logout: function() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page-mine {
		background: #F5F7FA;
		padding-bottom: 120rpx;
	}

	.mine-header-red {
		background: linear-gradient(180deg, #FF6B6B 0%, #FF8E8E 100%);
		padding: 80rpx 40rpx 160rpx 40rpx;
		display: flex;
		align-items: center;
		color: #fff;
		position: relative;
	}

	.avatar {
		width: 128rpx;
		height: 128rpx;
		background: rgba(255, 255, 255, 0.2);
		border: 4rpx solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.iconfont {
			font-size: 64rpx;
			color: #fff;
		}
	}

	.user-info {
		.user-name {
			font-size: 40rpx;
			margin-bottom: 10rpx;
			font-weight: bold;
		}

		.user-addr {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.9);
			background: rgba(0, 0, 0, 0.1);
			padding: 8rpx 20rpx;
			border-radius: 40rpx;
			display: inline-block;
		}
	}

	.assets-card {
		background: #fff;
		margin: -100rpx 30rpx 30rpx 30rpx;
		border-radius: 24rpx;
		padding: 40rpx 0;
		display: flex;
		justify-content: space-around;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
		position: relative;
		z-index: 2;
	}

	.asset-item {
		text-align: center;

		.asset-num {
			font-size: 40rpx;
			font-weight: bold;
			color: #333;
		}

		.asset-label {
			font-size: 24rpx;
			color: #888;
			margin-top: 8rpx;
		}
	}

	.mine-grid-container {
		background: #fff;
		margin: 30rpx;
		border-radius: 24rpx;
		padding: 40rpx 0;
	}

	.mine-grid-title {
		padding: 0 30rpx 30rpx 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.mine-grid-row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		row-gap: 40rpx;
		margin-bottom: 20rpx;
	}

	.mine-grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.icon-wrapper {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16rpx;
			border-radius: 50%;
			background: #f5f5f5;

			.iconfont {
				font-size: 40rpx;
			}
		}

		.item-text {
			font-size: 22rpx;
			color: #666;
		}
	}

	.setting-list {
		background: #fff;
		margin: 30rpx;
		border-radius: 24rpx;
		padding: 0 30rpx;
	}

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 1px solid #f9f9f9;

		&:last-child {
			border-bottom: none;
		}
	}

	.setting-left {
		font-size: 28rpx;
		color: #333;
		display: flex;
		align-items: center;

		.iconfont {
			width: 40rpx;
			text-align: center;
			margin-right: 10rpx;
			color: #666;
			display: inline-block;
		}
	}

	.setting-right {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #ccc;

		.auth-status {
			color: #1890ff;
		}

		.icon-arrow-right {
			margin-left: 10rpx;
		}
	}

	.logout-btn {
		background: #fff;
		margin: 40rpx 30rpx 60rpx 30rpx;
		padding: 30rpx;
		border-radius: 24rpx;
		text-align: center;
		color: #ff4d4f;
		font-size: 30rpx;
		font-weight: 500;
	}

	.c-blue { color: #1890ff; }
	.c-orange { color: #fa8c16; }
	.c-green { color: #52c41a; }
	.c-red { color: #f5222d; }
	.c-purple { color: #722ed1; }
</style>
