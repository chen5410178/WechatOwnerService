<template>
	<view class="page-service">
		<!-- 页面标题 -->
		<view class="page-title">服务大厅</view>

		<!-- 费用管理 -->
		<view class="list-group">
			<view class="list-header">费用管理</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in feeList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 居住通行 -->
		<view class="list-group">
			<view class="list-header">居住通行</view>
			<view class="grid-menu">
				<view class="grid-item" v-for="(item, index) in passList" :key="index" @click="onItemClick(item)">
					<text class="grid-icon iconfont" :class="item.icon"></text>
					<text class="grid-text">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';

	export default {
		data() {
			return {
				feeList: [
					{ name: '房屋费', icon: 'icon-house c-red', href: '/pages/fee/roomFeeListNew' },
					{ name: '车位费', icon: 'icon-car c-blue', href: '/pages/fee/payParkingFeeList' },
					{ name: '合同费', icon: 'icon-contract c-orange', href: '/pages/fee/contractFeeList' },
					{ name: '发票', icon: 'icon-receipt c-green', href: '/pages/invoice/invoice' }
				],
				passList: [
					{ name: '家庭成员', icon: 'icon-users c-blue', href: '/pages/family/familyList' },
					{ name: '访客通行', icon: 'icon-clock c-purple', href: '/pages/visit/visitList' },
					{ name: '空置房', icon: 'icon-door c-green', href: '/pages/applyRoom/applyRoom' },
					{ name: '装修备案', icon: 'icon-renovation c-red', href: '/pages/renovation/roomRenovation' }
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
		padding: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		font-weight: bold;
		font-size: 30rpx;
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
