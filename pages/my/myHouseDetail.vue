<template>
	<view>
<view class="block__title">{{ $t('my.houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.houseId') }}</view>
			{{roomDetail.roomId}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.building') }}</view>
			{{roomDetail.floorNum}}{{ $t('my.buildingNum') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.unit') }}</view>
			{{roomDetail.unitNum}}{{ $t('my.unitNum') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.room') }}</view>
			{{roomDetail.roomNum}}{{ $t('my.roomNum') }}
		</view>

		<view class="cu-form-group">
			<view class="title">{{ $t('my.floor') }}</view>
			{{roomDetail.layer}}{{ $t('my.floorLayer') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.houseType') }}</view>
			{{roomDetail.apartment}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('my.builtUpArea') }}</view>
			{{roomDetail.builtUpArea}}{{ $t('my.sqm') }}
		</view>

		<view class="button_up_blank"></view>

	</view>
</template>

<script>
	// pages/my/myHouseDetail.js
	import context from '../../lib/java110/Java110Context.js';
	import {hasLogin} from '@/api/user/sessionApi.js';
	const factory = context.factory;

	export default {
		data() {
			return {
				ownerInfo: {},
				// 用户信息
				userInfo: {},
				// 用户信息
				ownerFlag: false,
				// 是否有业主信息 标记 如果有为 true  没有为false
				roomDetail: {}
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			_that.roomDetail = JSON.parse(options.room);

		
			_that.loadOwenrInfo();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			loadOwenrInfo: function() {
				let _that = this;

				context.getOwner(function(_ownerInfo) {
					console.log(_ownerInfo);

					if (_ownerInfo) {
						_that.ownerFlag = true;
						_that.ownerInfo = _ownerInfo;
					} else {
						_that.ownerFlag = false;
					}
				});
			}
		}
	};
</script>
<style>
	@import "./myHouseDetail.css";

	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.block__bottom {
		height: 180rpx;
	}
</style>
