<template>
	<view>
		<scroll-view scroll-y class="padding-top">
			<view v-if="rooms && rooms.length > 0">
				<view class="room-group" v-for="(room, index) in rooms" :key="index">
					<view class="room-item" @click="goToRulePreFee(room)">
						<view class="room-box">
							<view class="room-info">
								<text class="room-name">{{room.floorNum}}-{{room.unitNum}}-{{room.roomNum}}</text>
								<text class="room-label">{{ $t('preFee.prepaid') || '预付款' }}</text>
							</view>
						</view>
					</view>
					<view class="room-item" @click="goToMeterRulePreFee(room)">
						<view class="room-box">
							<view class="room-info">
								<text class="room-name">{{room.floorNum}}-{{room.unitNum}}-{{room.roomNum}}</text>
								<text class="room-label">{{ $t('preFee.waterElectricPrepaid') || '水电预付款' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// pages/fee/preFee.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	
	import {
		getRooms
	} from '../../api/room/roomApi.js'
	
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	
	import {
		autoLogin
	} from '../../api/user/sessionApi.js';

	export default {
		data() {
			return {
				rooms: []
			};
		},
		components: {
			noDataPage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			autoLogin(options);
			this.loadRooms();
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.loadRooms();
		},
		methods: {
			/**
			 * 加载业主房屋列表
			 */
			loadRooms: function() {
				let _that = this;
				getRooms({
					communityId: getCommunityId()
				}).then(data => {
					_that.rooms = data.rooms || [];
				}).catch(error => {
					console.error(this.$t('loadRoomListFailed') + ':', error);
					_that.rooms = [];
				});
			},
			
			/**
			 * 跳转到预付款页面
			 */
			goToRulePreFee: function(room) {
				uni.navigateTo({
					url: '/pages/fee/rulePreFee?roomId=' + room.roomId
				});
			},
			
			/**
			 * 跳转到水电预付款页面
			 */
			goToMeterRulePreFee: function(room) {
				uni.navigateTo({
					url: '/pages/fee/meterRulePreFee?roomId=' + room.roomId
				});
			}
		}
	};
</script>

<style>
	.padding-top {
		padding-top: 20rpx;
		padding-bottom: 40rpx;
	}
	
	.room-group {
		margin-bottom: 30rpx;
	}
	
	.room-item {
		margin: 0 30rpx 20rpx 30rpx;
	}
	
	.room-box {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid #e5e5e5;
	}
	
	.room-item {
		cursor: pointer;
	}
	
	.room-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	
	.room-name {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 15rpx;
		line-height: 1.5;
	}
	
	.room-label {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
</style>
