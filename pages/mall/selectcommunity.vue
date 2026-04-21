<template>
	<view>
		<view class="block__title">{{ $t('selectcommunity.selectCommunity') }}</view>

		<view class="cu-form-group arrow">
			<view class="title">{{ $t('selectcommunity.cityArea') }}</view>
			<pickerAddress @change="change" class="text-right" style="width:80%">{{areaName}}</pickerAddress>
			<text class='cuIcon-right'></text>
		</view>

		<view class="cu-form-group" @tap="chooseCommunity">
			<view class="title">{{ $t('selectcommunity.communityName') }}</view>
				<input v-model="communityName" required readonly label="小区名称" :placeholder="$t('selectcommunity.selectCommunity')" name="communityName" icon="arrow"
			 ></input>
			<text class='cuIcon-right'></text>
		</view>
		<view class="padding flex flex-direction margin-top" >
			<button class="cu-btn bg-green lg" @click="_doSure()">{{ $t('selectcommunity.confirm') }}</button>
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
				areaName: this.$t('selectcommunity.selectArea'),
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
					uni.showToast({
						title: this.$t('selectcommunity.selectAreaFirst'),
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
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
