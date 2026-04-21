<template>
<view>
<template name="commentPage">
<view class="commentPage-header">
  <view class="commentPage-score">
    <view class="overall">{{ $t('commentPage.overallScore') }}</view>4.3<view class="rate">{{ $t('commentPage.goodRate') }}</view>
  </view>
  <view class="commentPage-rating">
    <view class="restaurant">{{ $t('commentPage.restaurantScore') }}<view class="stars">★★★★★ 4</view>
    </view>
    <view class="distribute">{{ $t('commentPage.deliveryScore') }}<view class="stars">★★★★★ 4.6</view>
    </view>
    </view>
</view>
<view class="commentPage-category">
  <block v-for="(item, index) in categoryList" :key="index">
    <view class="category-item">{{item.text}}({{item.numb}})</view>
  </block>
</view>
</template>
</view>
</template>


	<script> 
		
		export default {
			props: []
		}
	</script> 
									