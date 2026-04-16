<template>
<view class="ak_context">
  <view class="ak_row">
    <view class="ak_row_black">
    </view>
    <view class="ak_row_title">
      <text>{{ $t('applyKey') }}</text>
    </view>
    <view class="ak_row_black_01"></view>
	
	
	<view class="bg-white padding">
			<view class="grid text-center" :class="'col-2'">
				<view class="padding">
				    <text class="iconfont iconshenqing ak_icon_text">\n</text>
					<text>{{ $t('submit') }}1.提交申请钥匙</text>
				</view>
				<view class="padding">
					<text class="iconfont icondengdai ak_icon_text">\n</text>
				    <text>2. {{ $t('propertyReview') }}</text>
				</view>
			</view>
			<view class="grid text-center" :class="'col-1'">
				<view class="padding">
					<text class="iconfont iconshenqingtongguo ak_icon_text">\n</text>
					<text>3. {{ $t('generateKey') }}</text>
				</view>
			</view>
	</view>
    <view class="ak_row_black_02"></view>
     <view class="ak_row_black_03"></view>
	  <view class="padding flex flex-direction">
		 <button class="cu-btn bg-green lg" @click="applyApplicationKey">{{ $t('applyKey') }}</button>
	  </view> 
     <view class="ak_row_black_04"></view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  this.vc.onLoad(options);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 申请钥匙
     */
    applyApplicationKey: function () {
      this.vc.navigateTo({
        url: '/pages/applicationKey/applicationKeyLocation'
      });
    }
  }
};
</script>
<style>
@import "./applicationKey.css";
</style>