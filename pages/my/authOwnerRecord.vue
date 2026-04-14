<template>
	<view class="page-container">
		<view class="block-title">房屋认证记录</view>
		<view v-if="appUsers && appUsers.length > 0">
			<view v-for="(item, index) in appUsers" :key="index" class="auth-card">
				<view class="auth-header">
					<view class="room-name">{{item.roomName || '-'}}</view>
					<view class="auth-state" :class="getStateClass(item.state)">{{getStateText(item.state)}}</view>
				</view>
				<view class="auth-info">
					<view class="info-row">
						<text class="info-label">审核说明</text>
						<text class="info-value">{{item.remark || '无'}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">人员名称</text>
						<text class="info-value">{{item.appUserName}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">人员类型</text>
						<text class="info-value">{{getOwnerTypeText(item.ownerTypeCd)}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">手机号</text>
						<text class="info-value">{{item.link}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">申请时间</text>
						<text class="info-value">{{item.createTime}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">小区</text>
						<text class="info-value">{{item.communityName}}</text>
					</view>
				</view>
				<view class="auth-action" v-if="item.state == '10000'">
					<button class="delete-btn" @click="_deleteAuthOwner(item)">删除认证</button>
				</view>
			</view>
		</view>
		<view class="empty-state" v-else>
			<text class="empty-icon">📋</text>
			<text class="empty-text">暂无认证记录</text>
		</view>
		<view class="to-auth">
			<button class="auth-btn" @click="_toAuthOwner()">去认证</button>
		</view>
	</view>
</template>

<script>
	import {queryAuthOwnerLog, deleteAuthOwner} from '@/api/owner/ownerApi.js';
	export default {
		data() {
			return {
				appUsers: []
			}
		},
		onLoad: function(options) {
			this._loadAppUser();
		},
		methods: {
			_loadAppUser: function() {
				let _that = this;
				queryAuthOwnerLog({
					page: 1,
					row: 30
				}).then(_data => {
					_that.appUsers = _data.data || [];
				}).catch(() => {
					_that.appUsers = [];
				});
			},
			getStateClass: function(state) {
				if (state == '10000') return 'state-pending';
				if (state == '12000') return 'state-success';
				if (state == '13000') return 'state-fail';
				return '';
			},
			getStateText: function(state) {
				if (state == '10000') return '审核中';
				if (state == '12000') return '认证完成';
				if (state == '13000') return '认证失败';
				return '未知状态';
			},
			getOwnerTypeText: function(type) {
				if (type == '1001') return '业主';
				if (type == '1002') return '家庭成员';
				if (type == '1003') return '租客';
				return '其他';
			},
			_toAuthOwner: function() {
				uni.navigateTo({
					url: '/pages/index/authOwner'
				});
			},
			_deleteAuthOwner: function(_app) {
				let _that = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该认证吗？',
					success: (res) => {
						if (res.confirm) {
							deleteAuthOwner({
								appUserId: _app.appUserId
							}).then(() => {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								_that._loadAppUser();
							}).catch(() => {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background: #F5F7FA;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	.block-title {
		padding: 40rpx 30rpx 20rpx;
		font-size: 28rpx;
		color: rgba(69, 90, 100, 0.6);
	}

	.auth-card {
		background: #fff;
		margin: 20rpx 30rpx;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.auth-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;

		.room-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.auth-state {
			font-size: 24rpx;
			padding: 6rpx 16rpx;
			border-radius: 20rpx;
		}

		.state-pending {
			background: #fff7e6;
			color: #fa8c16;
		}

		.state-success {
			background: #f6ffed;
			color: #52c41a;
		}

		.state-fail {
			background: #fff2f0;
			color: #ff4d4f;
		}
	}

	.auth-info {
		margin-top: 20rpx;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;

		.info-label {
			color: #888;
			font-size: 26rpx;
		}

		.info-value {
			color: #333;
			font-size: 26rpx;
		}
	}

	.auth-action {
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
	}

	.delete-btn {
		font-size: 24rpx;
		color: #ff4d4f;
		background: #fff2f0;
		padding: 10rpx 30rpx;
		border-radius: 20rpx;
		border: none;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;

		.empty-icon {
			font-size: 80rpx;
			margin-bottom: 20rpx;
		}

		.empty-text {
			color: #888;
			font-size: 28rpx;
		}
	}

	.to-auth {
		padding: 30rpx;
	}

	.auth-btn {
		background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
		color: #fff;
		font-size: 32rpx;
		padding: 24rpx 0;
		border-radius: 48rpx;
		border: none;
	}
</style>