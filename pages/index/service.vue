<template>
	<view class="page-service">
		<!-- 费用 -->
		<view class="list-group">
			<view class="list-header">费用</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in feeList" :key="index" @click="onItemClick(item)">
					<view class="grid-icon iconfont" :class="item.icon"></view>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 物业服务 -->
		<view class="list-group">
			<view class="list-header">物业服务</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in propertyList" :key="index" @click="onItemClick(item)">
					<view class="grid-icon iconfont" :class="item.icon"></view>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 工单 -->
		<view class="list-group">
			<view class="list-header">工单</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in workOrderList" :key="index" @click="onItemClick(item)">
					<view class="grid-icon iconfont" :class="item.icon"></view>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 通行 -->
		<view class="list-group">
			<view class="list-header">通行</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in passList" :key="index" @click="onItemClick(item)">
					<view class="grid-icon iconfont" :class="item.icon"></view>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 其他 -->
		<view class="list-group">
			<view class="list-header">其他</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in otherList" :key="index" @click="onItemClick(item)">
					<view class="grid-icon iconfont" :class="item.icon"></view>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feeList: [
					{ name: '物业缴费', icon: 'fa-solid fa-house-user c-red', href: '/pages/fee/oweFee' },
					{ name: '水电充值', icon: 'fa-solid fa-droplet c-blue', href: '/pages/meter/meter' },
					{ name: '车辆月卡', icon: 'fa-solid fa-car c-orange', href: '/pages/fee/payParkingFeeList' },
					{ name: '发票', icon: 'fa-solid fa-receipt c-green', href: '/pages/invoice/invoice' }
				],
				propertyList: [
					{ name: '社区公告', icon: 'fa-solid fa-bullhorn c-orange', href: '/pages/notice/index' },
					{ name: '家庭成员', icon: 'fa-solid fa-users c-blue', href: '/pages/family/familyList' },
					{ name: '业主信息', icon: 'fa-solid fa-user c-purple', href: '/pages/viewBindOwner/viewBindOwner' },
					{ name: '车位申请', icon: 'fa-solid fa-square-parking c-green', href: '/pages/car/applyparking' },
					{ name: '空置房申请', icon: 'fa-solid fa-door-open c-red', href: '/pages/applyRoom/applyRoom' },
					{ name: '小区公示', icon: 'fa-solid fa-newspaper c-blue', href: '/pages/common/communityPublicityList' }
				],
				workOrderList: [
					{ name: '报事报修', icon: 'fa-solid fa-screwdriver-wrench c-green', href: '/pages/repair/repair' },
					{ name: '投诉咨询', icon: 'fa-solid fa-comment c-orange', href: '/pages/complaint/complaint' },
					{ name: '装修报备', icon: 'fa-solid fa-paint-roller c-red', href: '/pages/renovation/roomRenovation' },
					{ name: '球场预约', icon: 'fa-solid fa-baseball c-blue', href: '/pages/appointment/appointment' }
				],
				passList: [
					{ name: '一键开门', icon: 'fa-solid fa-key c-red', href: '/pages/machine/openDoor' },
					{ name: '访客通行', icon: 'fa-solid fa-user-clock c-purple', href: '/pages/visit/visitList' }
				],
				otherList: [
					{ name: '充电桩', icon: 'fa-solid fa-bolt c-blue', href: '/pages/machine/chargeMachines' }
				]
			};
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

		.grid-icon {
			font-size: 48rpx;
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
