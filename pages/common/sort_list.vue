<template>
<view>
<template name="sort_list">
  <view class="sort-list">
<view class="sort" @tap="onOverallTag">{{sortSelected}}<image src="../../static/images/down.png" style="width:20rpx;height:20rpx;"></image></view>
      <view data-index="0" @tap="onTapTag" :class="'sort ' + (selected == 0?'sort-active':'')">{{ $t('sort_list.salesHighest') }}</view>
      <view data-index="1" @tap="onTapTag" :class="'sort ' + (selected == 1?'sort-active':'')">{{ $t('sort_list.nearestDistance') }}</view>
      <view class="sort" @tap="onFilter">{{ $t('sort_list.filter') }}<image src="../../static/images/screen.png" style="width:22rpx;height:22rpx;"></image></view>
  </view>
</template>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									