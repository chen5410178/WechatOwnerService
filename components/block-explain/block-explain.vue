<template>
	<view>
		<view class="box">
			<view class="title text-df text-grey">{{ $t('blockExplain.discountAndPenalty') }}</view>
			<view class="sub-title text-df">{{ $t('blockExplain.discount') }}</view>
			<view class="con text-sm">{{ $t('blockExplain.discountRule') }}： <text class="detail text-grey">{{ $t('blockExplain.discountFormula') }}</text></view>
			<view class="con text-sm">{{ $t('blockExplain.reduction') }}： <text class="detail text-grey">{{ $t('blockExplain.reductionRule') }}</text></view>
			<view class="sub-title text-df">{{ $t('blockExplain.penalty') }}</view>
			<view class="con text-sm">{{ $t('blockExplain.dailyPenalty') }}： <text class="detail text-grey">{{ $t('blockExplain.dailyPenaltyFormula') }}</text></view>
			<view class="con text-sm">{{ $t('blockExplain.monthlyPenalty') }}： <text class="detail text-grey">{{ $t('blockExplain.monthlyPenaltyFormula') }}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>
.box{
	margin: 20upx;
}
.title{
	
}
.sub-title{
	
}
.con{
	text-indent: 2rem;
}
.detail{
	
}
</style>
