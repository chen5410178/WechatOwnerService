<template>
	<view>
		<view class="cu-form-group arrow" @click="showRenovationRecord()">
			<view class="title">{{ $t('renovationTracking') }}</view>
		</view>
		<view class="block__title">{{ $t('userInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('name') }}</view>
			{{renovationDetail.personName}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('contact') }}</view>
			{{renovationDetail.personTel}}
		</view>
	
		<view class="block__title">{{ $t('houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('roomNum') }}</view>
			{{renovationDetail.roomName}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('startDate') }}</view>
			{{renovationDetail.startTime}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('endDate') }}</view>
			{{renovationDetail.endTime}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('currentProgress') }}</view>
			{{renovationDetail.stateName}}
		</view>
		<view class="btn-box" v-if="renovationDetail.state == 3000">
			<button type="default" class="btn-sub" @click="renovationComplete()">{{ $t('renovationComplete') }}</button>
		</view>
	
		<view class="button_up_blank"></view>
	
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const factory = context.factory;
	import {compareDate} from '../../lib/java110/utils/DateUtil.js'
	import {updateRoomRenovationState} from '../../api/roomRenovation/roomRenovationApi.js'
	export default {
		data() {
			return {
				renovationDetail: {},
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
			_that.renovationDetail = JSON.parse(options.room);
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
			
			// 装修完成
			renovationComplete: function(){
				let _that = this;
				uni.showModal({
				    title: _that.$t('tip'),
				    content: _that.$t('confirmComplete'),
				    success: function (res) {
				        if (res.confirm) {
							let params = _that.renovationDetail;
							updateRoomRenovationState(params).then(function(_res){
								uni.showToast({
									title: _that.$t('operationSuccess')
								});
								setTimeout(function(){
									uni.navigateBack({})
								}, 1000);
							})
				        } else if (res.cancel) {
				            // do nothing
				        }
				    }
				});
			},
			
			/**
			 * 查看跟踪记录
			 */
			showRenovationRecord: function(){
				uni.navigateTo({
					url: '/pages/renovation/myRoomRenovationRecord?apply=' + JSON.stringify(this.renovationDetail)
				});
			},
		}
	};
</script>

<style>
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
	
	.btn-box{
		padding: 30rpx 0;
	}
	.btn-sub{
		width: 80%;
		margin: 0 auto;
		background-color: #1F8DEE!important;
		color: #fff!important;
	}
</style>
