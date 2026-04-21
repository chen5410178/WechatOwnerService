<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input v-model="searchValue" data-name="searchValue" name="searchValue" @focus="onChange" @blur="onSearch"
				 :adjust-position="false" :placeholder="$t('selectFloor.searchPlaceholder')" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="onSearch">{{ $t('selectFloor.search') }}</button>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item" v-for="(floor, idx) in floors" :key="idx" :label="floor.floorId">
				<view class="content padding-tb-sm" is-link @click="chooseFloor(floor)">
					<view>
						<text class="cuIcon-clothesfill text-blue margin-right-xs"></text> {{floor.floorName}}</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text> {{floor.floorId}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	export default {
		
		data() {
			return {
				appUserName: '',
				areaCode: '',
				searchValue: '',
				FloorName: "",
				floors: []
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			
			context.onLoad(options);
			this.loadFloor();
		},
		methods: {
			onSearch() {
				this.loadFloor();
			},

			onClick() {
				this.loadFloor();
			},

			chooseFloor: function(_Floor) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				uni.setStorageSync("_selectFloor", _Floor);
				prevPage.FloorName = _Floor.name;
				//console.log(e);
				uni.navigateBack({
					delta: 1
				});
			},
			loadFloor: function() {
				let _that = this;
				let _communityInfo = context.getCurrentCommunity();
				let dataObj = {
					page: 1,
					row: 15,
					communityId: _communityInfo.communityId,
					name: this.searchValue
				};
				context.request({
					url: constant.url.queryFloor,
					header: context.getHeaders(),
					method: "GET",
					data: dataObj,
					//动态数据
					success: function(res) {
						console.log(res); //成功情况下跳转

						if (res.statusCode == 200) {
							let _floors = res.data.apiFloorDataVoList;

							_that.floors = _floors;
						}
					},
					fail: function(e) {
						uni.showToast({
							title: this.$t('selectFloor.serverError'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
