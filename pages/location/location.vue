<template>
	<view>
		<view class="header">
			<view class="search-input">
				<input :placeholder="$t('inputCommunityName')" @input="input"></input>
			</view>
			<view class="search-btn">{{ $t('search') }}</view>
		</view>
		<view class="result-container" :hidden="hidden">
			<scroll-view scroll-y="true" class="search-result-list" :hidden="hidden">
				<block v-for="(item, index) in locationList" :key="index">
					<view class="search-result" @tap="onTap" :data-key="item.address">{{item.name}}
						<view class="search-result-desc">{{item.address}}</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="getLocation" @tap="getLocation">{{ $t('clickLocate') }}</view>
		<view class="addLocation">{{ $t('addDeliveryAddress') }}<view class="addLocation-icon">+</view>
		</view>
		<view class="myLocation">{{ $t('myDeliveryAddress') }}</view>
		<view class="LocatonInfo"></view>
		<view class="userTel"></view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		data() {
			return {
				locationList: [],
				hidden: true
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
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
			onTap: function(e) {
				uni.setStorageSync('location', e.currentTarget.dataset.key);
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			getLocation: function() {
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			input: function(e) {
				if (e.detail.value) {
					this.setData({
						hidden: false
					});
					this.search(e.detail.value);
				} else {
					this.setData({
						hidden: true
					});
				}
			},
			search: function(text) {
				var that = this;
				uni.request({
					url: 'http://api.map.baidu.com/place/v2/search?query=' + text +
						'&page_size=20&page_num=0&scope=2&region=南昌&output=json&ak=btsVVWf0TM1zUBEbzFz6QqWF',
					success: function(res) {
						console.log(res);
						that.locationList = res.data.results;
					}
				});
			}
		}
	};
</script>
<style>
	@import "./location.css";
</style>
