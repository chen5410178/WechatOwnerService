<template>
	<view>
		<view class="block__title">选择小区</view>

		<view class="cu-form-group arrow">
			<view class="title">市/区</view>
			<pickerAddress @change="change" class="text-right" style="width:80%">{{areaName}}</pickerAddress>
			<text class='cuIcon-right'></text>
		</view>

		<view class="cu-form-group" @tap="chooseCommunity">
			<view class="title">小区名称</view>
			<input v-model="communityName" required readonly label="小区名称" placeholder="请选择小区" name="communityName" icon="arrow"
			 ></input>
			<text class='cuIcon-right'></text>
		</view>
		<view class="padding flex flex-direction margin-top" >
			<button class="cu-btn bg-green lg" @click="_doSure()">确定</button>
		</view>
	</view>
</template>

<script>
	
	import pickerAddress from '@/components/pickerAddress/pickerAddress.vue'

	export default {
		components: {
			pickerAddress
		},
		data() {
			return {
				title: 'Hello',
				areaCode: '',
				areaName: '请选择地区',
				communityName: '',
				communityId: '',
				areaList: {
					province_list: {

					},
					city_list: {

					},
					county_list: {

					}
				}
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			this.vc.onLoad(options);
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			if (this.areaCode == '' || this.areaCode == undefined) {
			} else {
				let community = uni.getStorageSync("_selectCommunity");
				if (community != null && community != undefined) {
					this.communityId = community.communityId;
					this.communityName = community.name;
				}
			}

		},
		methods: {
			_doSure: function(e) {
				//console.log(e);
				this.vc.navigateBack(true);
			},
			change: function(data) {
				let _that = this;
				_that.areaName = '';
				data.data.forEach(function(_obj) {
					_that.areaName += _obj.name;
				});
				_that.areaCode = data.data[2].code;
			},
			/**
			 * 选择小区
			 */
			chooseCommunity: function(e) {
				if (this.areaCode == '' || this.areaCode == undefined) {
					wx.showToast({
						title: '请先选择地区',
						icon: 'none'
					});
					return;
				}
				wx.navigateTo({
					url: '/pages/mall/viewCommunitys?areaCode=' + this.areaCode,
				})
			}
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
		text-align: center;
	}
</style>
