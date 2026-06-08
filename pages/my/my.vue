<template>
	<view class="page-mine">
		<!-- 红色背景头部 -->
		<view class="mine-header-red" @click="goToLogin">
			<view class="avatar">
				<image class="avatar-icon-img" :src="commonBaseUrl + '/h5/owner/fa-user-white.png'"></image>
			</view>
			<view class="user-info" v-if="isLogin">
				<view class="user-name">{{userName}}</view>
				<view class="user-addr">{{communityInfo}}</view>
			</view>
			<view class="user-info" v-else>
				<view class="user-name">{{ $t('my.clickToLogin') }}</view>
				<view class="user-addr">{{ $t('my.loginToSeeMore') }}</view>
			</view>
		</view>

		<!-- 悬浮的白色资产卡片 -->
		<view class="assets-card">
			<view class="asset-item" @click="goToHouse">
				<view class="asset-num">{{houseCount}}</view>
				<view class="asset-label">{{ $t('my.house') }}</view>
			</view>
			<view class="asset-item" @click="goToCar">
				<view class="asset-num">{{carCount}}</view>
				<view class="asset-label">{{ $t('my.car') }}</view>
			</view>
			<view class="asset-item" @click="goToCoupon">
				<view class="asset-num">{{couponCount}}</view>
				<view class="asset-label">{{ $t('my.coupon') }}</view>
			</view>
		</view>

		<!-- 我的服务 -->
		<view class="mine-grid-container">
			<view class="mine-grid-title">{{ $t('my.myService') }}</view>
			<view class="mine-grid-row">
				<view class="mine-grid-item" v-for="(item, index) in serviceList1" :key="index" @click="onServiceClick(item)">
					<view class="icon-wrapper" >
						<image class="service-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					</view>
					<text class="item-text">{{item.name}}</text>
				</view>
			</view>
			<view class="mine-grid-row">
				<view class="mine-grid-item" v-for="(item, index) in serviceList2" :key="index" @click="onServiceClick(item)">
					<view class="icon-wrapper" >
						<image class="service-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					</view>
					<text class="item-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 设置与认证 -->
		<view class="setting-list">
			<view class="setting-item" @click="goToChangeCommunity">
				<view class="setting-left">
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-building.png'"></image> {{ $t('my.changeCommunity') }}
				</view>
				<view class="setting-right">
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-chevron-right.png'"></image>
				</view>
			</view>
			<view class="setting-item" @click="onAuthClick">
				<view class="setting-left">
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-house-user.png'"></image> {{ $t('my.houseAuth') }}
				</view>
				<view class="setting-right">
					<text class="auth-status">{{authStatusText}}</text>
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-chevron-right.png'"></image>
				</view>
			</view>
			<view class="setting-item" @click="goToSetting">
				<view class="setting-left">
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-gear.png'"></image> {{ $t('my.settings') }}
				</view>
				<view class="setting-right">
					<image class="setting-icon-img" :src="commonBaseUrl + '/h5/owner/fa-chevron-right.png'"></image>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-btn" @click="logout" v-if="isLogin">
			{{ $t('my.logout') }}
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
	import config from '@/conf/config.js';

	export default {
		data() {
			return {
				isLogin: false,
				userName: '',
				communityInfo: '',
				houseCount: '0',
				carCount: '0',
				couponCount: '0',
				isAuthOwner: false,
				commonBaseUrl: config.commonBaseUrl
			};
		},
		computed: {
			serviceList1() {
				return [
					{ name: this.$t('my.paymentRecord'), iconImg: 'fa-file-lines.png', href: '/pages/fee/payFeeDetail' },
					{ name: this.$t('my.repairRecord'), iconImg: 'fa-screwdriver-wrench-orange.png', href: '/pages/repair/myRepair' },
					{ name: this.$t('my.complaintRecord'), iconImg: 'fa-comment-dots.png', href: '/pages/complaint/complaintList' },
					{ name: this.$t('my.vacantRoom'), iconImg: 'fa-house-chimney-crack.png', href: '/pages/applyRoom/myApplyRoomList' },
					{ name: this.$t('my.renovationRecord'), iconImg: 'fa-paint-roller-blue.png', href: '/pages/renovation/myRoomRenovationList' }
				];
			},
			serviceList2() {
				return [
					{ name: this.$t('my.accessLog'), iconImg: 'fa-id-card.png', href: '/pages/machine/machineTranslateLog' },
					{ name: this.$t('my.invoiceHistory'), iconImg: 'fa-receipt-orange.png', href: '/pages/invoice/invoiceApply' }
				];
			},
			authStatusText() {
				return this.isAuthOwner ? this.$t('my.verified') : this.$t('my.unverified');
			}
		},
		onLoad: function(options) {
			this.vc.onLoad(options);
		},
		onShow: function() {
			this._checkLogin();
		},
		methods: {
			_checkLogin: function() {
				if (hasLogin()) {
					this.isLogin = true;
					this._loadData();
				} else {
					this.isLogin = false;
					this.userName = '';
					this.communityInfo = '';
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
					title: this.$t('my.tip'),
					content: this.$t('my.logoutConfirm'),
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

		.avatar-icon-img {
			width: 64rpx;
			height: 64rpx;
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

			.service-icon-img {
				width: 40rpx;
				height: 40rpx;
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

		.setting-icon-img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 10rpx;
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

		.setting-icon-img {
			width: 32rpx;
			height: 32rpx;
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
