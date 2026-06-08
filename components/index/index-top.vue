<template>
	<view class="index-top">
		<!-- 顶部沉浸式背景 -->
		<view class="header-bg">
			<view class="hero-actions">
				<view class="hero-item" @click="onHeroAction('openDoor')">
					<view class="fa-icon-box">
						<image class="fa-icon-img" :src="commonBaseUrl + '/h5/owner/fa-key-white.png'"></image>
					</view>
					<text class="hero-text">{{ $t('indexTop.indexOpenDoor') }}</text>
				</view>
				<view class="hero-item" @click="onHeroAction('visitor')">
					<view class="fa-icon-box">
						<image class="fa-icon-img" :src="commonBaseUrl + '/h5/owner/fa-qrcode.png'"></image>
					</view>
					<text class="hero-text">{{ $t('indexTop.indexVisit') }}</text>
				</view>
				<view class="hero-item" @click="onHeroAction('payment')">
					<view class="fa-icon-box">
						<image class="fa-icon-img" :src="commonBaseUrl + '/h5/owner/fa-yen-sign.png'"></image>
					</view>
					<text class="hero-text">{{ $t('indexTop.indexPayment') }}</text>
				</view>
				<view class="hero-item" @click="onHeroAction('repair')">
					<view class="fa-icon-box">
						<image class="fa-icon-img" :src="commonBaseUrl + '/h5/owner/fa-user-shield.png'"></image>
					</view>
					<text class="hero-text">{{ $t('indexTop.quickRepair') }}</text>
				</view>
			</view>
		</view>

		<!-- 浮动卡片(物业账单) -->
		<view class="banner-card" @click="goToPayment">
			<view class="banner-text">
				<view class="banner-title">{{ $t('indexTop.propertyBill') }}</view>
				<view class="banner-amount">
					<text class="amount" >{{billAmount}}</text>
					<text class="unit">{{ $t('indexTop.yuanUnit') }}</text>
				</view>
				<text class="banner-date">{{ $t('indexTop.currentBill') }}</text>
			</view>
			<view class="banner-btn">{{ $t('indexTop.goPay') }}</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		queryOwnerFees
	} from '@/api/fee/feeApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import config from '@/conf/config.js';

	export default {
		data() {
			return {
				billAmount: '0.00',
				commonBaseUrl: config.commonBaseUrl
			};
		},
		methods: {
			async loadOwnerFee() {
				if (!hasLogin()) return;
				try {
					const data = await queryOwnerFees({
						page: 1,
						row: 50,
						communityId: getCommunityId(),
						payObjType: '3333'
					});
					if (!data || data.length < 1) {
						this.billAmount = '0.00';
						return;
					}
					let totalOwe = 0;
					for (const fee of data) {
						for (const feeConfig of fee.childs) {
							for (const child of feeConfig.childs) {
								totalOwe += parseFloat(child.oweAmount);
							}
						}
					}
					this.billAmount = totalOwe.toFixed(2);
				} catch (error) {
					this.billAmount = '0.00';
				}
			},
			async onHeroAction(type) {
				if (!hasLogin()) {
					uni.showToast({ title: this.$t('indexTop.pleaseLoginFirst'), icon: 'none' });
					return;
				}
				const urlMap = {
					openDoor: '/pages/machine/openDoor',
					visitor: '/pages/visit/visitList',
					payment: '/pages/fee/oweFee',
					repair: '/pages/repair/repair'
				};
				if (!urlMap[type]) return;
				try {
					await hasAuthOwner(this);
					this.vc.navigateToWithLogin({ url: urlMap[type] });
				} catch (e) {}
			},
			goToPayment() {
				this.vc.navigateToWithLogin({ url: '/pages/fee/oweFee' });
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index-top {
		background: #F5F7FA;
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

	.fa-icon-img {
		width: 40rpx;
		height: 40rpx;
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
</style>
