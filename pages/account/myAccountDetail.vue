<template>
	<view>
		<view  class="block__title">{{ $t('account.accountDetail') }}</view>
		<view v-if="accountDetails.length > 0">
			<view v-for="(item,index) in accountDetails" :key="index" class="bg-white margin-bottom margin-right-xs radius margin-left-xs padding">
				<view class="flex padding-bottom-xs solid-bottom justify-between">
					<view>{{acctType == 2004 ? $t('account.points') : $t('account.amount')}}</view>
					<view class="text-gray">{{item.amount}}{{acctType == 2004 ? $t('account.pointsUnit') : $t('account.yuan')}}</view>
				</view>
				<view class="flex margin-top justify-between">
					<view class="text-gray">{{ $t('account.transactionNo') }}</view>
					<view class="text-gray">{{item.orderId}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('account.detailNo') }}</view>
					<view class="text-gray">{{item.detailId}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('account.accountName') }}</view>
					<view class="text-gray">{{item.acctName}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('account.detailType') }}</view>
					<view class="text-gray">{{item.detailType =='1001' ? $t('account.transferIn') : $t('account.transferOut')}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('account.transactionTime') }}</view>
					<view class="text-gray">{{item.createTime}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">{{ $t('account.remark') }}</view>
					<view class="text-gray">{{item.remark}}</view>
				</view>
			</view>
			<uni-load-more :status="loadingStatus" :content-text="loadingContentText" />
		</view>
		<view v-else>
			<no-data-page></no-data-page>
		</view>

	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {queryOwnerAccountDetail} from '../../api/user/userApi.js'
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';


	const util = context.util;
	export default {
		data() {
			return {
				acctId: '',
				acctType: '', // 区分余额/积分
				accountDetails: [],
				communityId: '',
				noData: false,
				page: 1,
				loadingStatus : 'loading',
				loadingContentText: {
					contentdown: this.$t('account.pullUpLoadMore'),
					contentrefresh: this.$t('account.loading'),
					contentnomore: this.$t('account.noMore')
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
			this.acctId = options.acctId;
			this.acctType = options.acctType;
			let _that = this;
			context.getOwner(function(_owner) {
				_that.communityId = _owner.communityId;
				_that._loadAccountDetail();
			});

			
		},
		onReachBottom : function(){
			if(this.loadingStatus == 'noMore'){
				return;
			}
			this._loadAccountDetail();
		},
		methods: {
			_loadAccountDetail: function() {
				this.loadingStatus = 'more';
				let _that = this;
				let _objData = {
					page: _that.page,
					row: 10,
					acctId: _that.acctId,
					communityId: _that.communityId
				}
				queryOwnerAccountDetail(_objData).then((res) => {
					console.log(res);
					_that.accountDetails = _that.accountDetails.concat(res.data.data);
					_that.page ++;
					if(_that.accountDetails.length == res.data.total){
						_that.loadingStatus = 'noMore';
						return;
					}
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
