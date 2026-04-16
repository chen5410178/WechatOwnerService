<template>
	<view>
		<view class="block__title">
			<text>{{ $t('visit.visitList') }}</text>
			<button class="cu-btn bg-blue" @click="_addVisit()">{{ $t('visit.addVisit') }}</button>
		</view>
		<view v-if="visits && visits.length > 0">
			<view v-for="(item,index) in visits" :key="index"
				class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding" @click="_showDetail(item)">
				<view class="flex padding-bottom-xs solid-bottom justify-between">
					<view>{{ $t('visit.visitStatus') }}</view>
					<view class="text-gray">
						{{item.stateName}}
					</view>
				</view>
				<view class="flex margin-top justify-between">
					<view class="text-gray">{{ $t('visit.visitorName') }}</view>
					<view class="text-gray">{{item.name}}</view>
				</view>
				<view class="flex margin-top-xs justify-between" v-if="item.carNum">
					<view class="text-gray">{{ $t('visit.carNum') }}</view>
					<view class="text-gray">{{item.carNum}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('visit.visitorPhone') }}</view>
					<view class="text-gray">{{item.phoneNumber}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('visit.estimatedVisitTime') }}</view>
					<view class="text-gray">{{item.visitTime}}</view>
				</view>
			</view>
		</view>
		<view v-else>
			<no-data-page></no-data-page>
		</view>

	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {
		listOwnerVisit
	} from '../../api/visit/visit.js'
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import { getCommunityId } from '../../api/community/communityApi.js';

	export default {
		data() {
			return {
				visits: [],
				ownerInfo: {},
				noData: false,
				page: 1,
				loadingStatus: 'loading',
				loadingContentText: {
					contentdown: this.$t('loadMore'),
					contentrefresh: this.$t('loading'),
					contentnomore: this.$t('noMore')
				}
			}
		},
		components: {
			noDataPage,
			uniLoadMore
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
		

		},
		onShow() {
				let _that = this;
			context.getOwner(function(_owner) {
				_that.ownerInfo = _owner;
				_that._loadVisitList();
			});
		},
		onReachBottom: function() {
			this._loadVisitList();
		},
		methods: {
			_addVisit: function() {
				uni.navigateTo({
					url: '/pages/visit/addVisit'
				})
			},
			_loadVisitList: function() {
				let _that = this;
				this.visits = [];
				listOwnerVisit({
					page: 1,
					row: 50,
					communityId: getCommunityId()
				}).then((_visits) => {
					_that.visits = _visits.data;
				})
			},

			_showDetail(_item) {
				uni.navigateTo({
					url: '/pages/visit/visitDetail?visitId=' + _item.visitId
				})
			}
		}
	}
</script>

<style>
	.solid-bottom::after {
		border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
	}

	.ppf_item {
		padding: 0rpx 0rpx 0rpx 0rpx;
	}

	.block__title {
		display: flex;
		justify-content: space-between;
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