<template>
	<view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input v-model="searchValue" data-name="searchValue" name="searchValue" @focus="onChange" @blur="onSearch"
				 :adjust-position="false" :placeholder="$t('viewCommunitys.inputCommunityName')" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="onSearch">{{ $t('viewCommunitys.search') }}</button>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item" v-for="(community, idx) in communitys" :key="idx" :label="community.address">
				<view class="content padding-tb-sm" is-link @click="chooseCommunity(community)">
					<view>
						<text class="cuIcon-clothesfill text-blue margin-right-xs"></text> {{community.name}}</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text> {{community.address}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {getCommunitys} from "@/api/community/communityApi.js"
	
	export default {
		data() {
			return {
				appUserName: '',
				areaCode: '',
				searchValue: '',
				communityName: "",
				communitys: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.vc.onLoad(options);
			let _areaCode = options.areaCode;
			this.areaCode = _areaCode;
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.loadCommunityFun();
		},


		methods: {
			onSearch() {
				this.loadCommunityFun();
			},
			onClick() {
				this.loadCommunityFun();
			},
			chooseCommunity: function(_community) {
				let _title = {
					action: "setCommunity",
					data: _community,
					url:''
				}
				uni.setStorageSync("_selectCommunity",_community);
				uni.navigateBack({
					delta: 2
				});
			},
			loadCommunityFun: function() {
				let _that = this;
				let dataObj = {
					page: 1,
					row: 50,
					cityCode: this.areaCode,
					state: '1100',
					name: this.searchValue
				};
				getCommunitys(dataObj)
					.then((_communtiys) => {
							_that.communitys = _communtiys;
					})
			}
		}
	};
</script>
<style>
	/* pages/viewCommunitys/viewCommunitys.wxss */
	.vc_community_search{
	 
	}
	
	.vc_communitys{
	  margin-top: 20rpx;
	}
</style>
