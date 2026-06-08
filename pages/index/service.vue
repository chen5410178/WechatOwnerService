<template>
	<view class="page-service">
		<!-- 费用 -->
		<view class="list-group">
			<view class="list-header">{{ $t('service.fee') }}</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in feeList" :key="index" @click="onItemClick(item)">
					<image class="grid-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 物业服务 -->
		<view class="list-group">
			<view class="list-header">{{ $t('service.propertyService') }}</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in propertyList" :key="index" @click="onItemClick(item)">
					<image class="grid-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 工单 -->
		<view class="list-group">
			<view class="list-header">{{ $t('service.workOrder') }}</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in workOrderList" :key="index" @click="onItemClick(item)">
					<image class="grid-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 通行 -->
		<view class="list-group">
			<view class="list-header">{{ $t('service.access') }}</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in passList" :key="index" @click="onItemClick(item)">
					<image class="grid-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 其他 -->
		<view class="list-group">
			<view class="list-header">{{ $t('service.other') }}</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in otherList" :key="index" @click="onItemClick(item)">
					<image class="grid-icon-img" :src="commonBaseUrl + '/h5/owner/' + item.iconImg"></image>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/conf/config.js';

	export default {
		data() {
			return {
				commonBaseUrl: config.commonBaseUrl
			};
		},
		computed: {
			feeList() {
				return [
					{ name: this.$t('service.propertyPay'), iconImg: 'fa-house-user.png', href: '/pages/fee/oweFee' },
					{ name: this.$t('service.waterElectric'), iconImg: 'fa-droplet.png', href: '/pages/meter/meter' },
					{ name: this.$t('service.carMonthly'), iconImg: 'fa-car-orange.png', href: '/pages/fee/payParkingFeeList' },
					{ name: this.$t('service.invoice'), iconImg: 'fa-receipt.png', href: '/pages/invoice/invoice' }
				];
			},
			propertyList() {
				return [
					{ name: this.$t('service.communityNotice'), iconImg: 'fa-bullhorn.png', href: '/pages/notice/notice' },
					{ name: this.$t('service.familyMembers'), iconImg: 'fa-users.png', href: '/pages/family/familyList' },
					{ name: this.$t('service.ownerInfo'), iconImg: 'fa-user.png', href: '/pages/viewBindOwner/viewBindOwner' },
					{ name: this.$t('service.parkingApply'), iconImg: 'fa-square-parking.png', href: '/pages/car/applyparking' },
					{ name: this.$t('service.vacantApply'), iconImg: 'fa-door-open.png', href: '/pages/applyRoom/applyRoom' },
					{ name: this.$t('service.communityBulletin'), iconImg: 'fa-newspaper-blue.png', href: '/pages/common/communityPublicityList' },
					{ name: this.$t('service.voteQuestionnaire'), iconImg: 'fa-check-to-slot.png', href: '/pages/questionAnswer/questionAnswer' }
				];
			},
			workOrderList() {
				return [
					{ name: this.$t('service.repair'), iconImg: 'fa-screwdriver-wrench.png', href: '/pages/repair/repair' },
					{ name: this.$t('service.complaint'), iconImg: 'fa-comment.png', href: '/pages/complaint/complaint' },
					{ name: this.$t('service.renovation'), iconImg: 'fa-paint-roller.png', href: '/pages/renovation/roomRenovation' },
					{ name: this.$t('service.courtBooking'), iconImg: 'fa-baseball.png', href: '/pages/appointment/appointment' }
				];
			},
			passList() {
				return [
					{ name: this.$t('service.openDoor'), iconImg: 'fa-key.png', href: '/pages/machine/openDoor' },
					{ name: this.$t('service.visitorAccess'), iconImg: 'fa-user-clock.png', href: '/pages/visit/visitList' }
				];
			},
			otherList() {
				return [
					{ name: this.$t('service.charging'), iconImg: 'fa-bolt.png', href: '/pages/machine/chargeMachines' }
				];
			}
		},
		methods: {
			onItemClick: function(item) {
				if (item.href) {
					this.vc.navigateToWithLogin({
						url: item.href
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page-service {
		background: #F5F7FA;
		padding-bottom: 20rpx;
	}

	.page-title {
		background: #fff;
		padding: 80rpx 30rpx 30rpx 30rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.list-group {
		background: #fff;
		margin: 30rpx;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.list-header {
		padding-left: 30rpx;
		padding-top: 30rpx;
		font-weight: bold;
		font-size: 28rpx;
	}

	.grid-menu {
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

		.grid-icon-img {
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 16rpx;
		}

		.grid-text {
			font-size: 24rpx;
			color: #333;
		}
	}

	.c-blue { color: #1890ff; }
	.c-orange { color: #fa8c16; }
	.c-green { color: #52c41a; }
	.c-red { color: #f5222d; }
	.c-purple { color: #722ed1; }
</style>
