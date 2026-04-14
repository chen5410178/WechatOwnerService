<template>
	<view class="page-service">
		<!-- 费用 -->
		<view class="list-group">
			<view class="list-header">费用</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in feeList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 物业服务 -->
		<view class="list-group">
			<view class="list-header">物业服务</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in propertyList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 工单 -->
		<view class="list-group">
			<view class="list-header">工单</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in workOrderList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 通行 -->
		<view class="list-group">
			<view class="list-header">通行</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in passList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 其他 -->
		<view class="list-group">
			<view class="list-header">其他</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in otherList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
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
					{ name: '物业缴费', icon: 'icon-house c-red', href: '/pages/fee/roomFee' },
					{ name: '水电充值', icon: 'icon-droplet c-blue', href: '/pages/meter/meter' },
					{ name: '车辆月卡', icon: 'icon-car c-orange', href: '/pages/fee/payParkingFeeList' },
					{ name: '发票', icon: 'icon-receipt c-green', href: '/pages/invoice/invoice' }
				],
				propertyList: [
					{ name: '社区公告', icon: 'icon-bullhorn c-orange', href: '/pages/notice/index' },
					{ name: '家庭成员', icon: 'icon-users c-blue', href: '/pages/family/familyList' },
					{ name: '业主信息', icon: 'icon-user c-purple', href: '/pages/my/viewAdmin' },
					{ name: '车位申请', icon: 'icon-parking c-green', href: '/pages/car/applyparking' },
					{ name: '空置房申请', icon: 'icon-door c-red', href: '/pages/applyRoom/applyRoom' },
					{ name: '小区公示', icon: 'icon-file-text c-blue', href: '/pages/common/communityPublicityList' }
				],
				workOrderList: [
					{ name: '报事报修', icon: 'icon-wrench c-green', href: '/pages/repair/myRepair' },
					{ name: '投诉咨询', icon: 'icon-message-square c-orange', href: '/pages/complaint/complaint' },
					{ name: '装修报备', icon: 'icon-renovation c-red', href: '/pages/renovation/roomRenovation' },
					{ name: '球场预约', icon: 'icon-ball c-blue', href: '/pages/reserve/reserveOrder' }
				],
				passList: [
					{ name: '一键开门', icon: 'icon-key c-red', href: '/pages/machine/openDoor' },
					{ name: '访客通行', icon: 'icon-clock c-purple', href: '/pages/visit/visitList' }
				],
				otherList: [
					{ name: '充电桩', icon: 'icon-zap c-blue', href: '/pages/charge/chargeStation' }
				]
			};
		},
		methods: {
			onItemClick: function(item) {
				if (item.href) {
					this.vc.navigateTo({
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
