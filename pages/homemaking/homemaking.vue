<template>
	<view>
		<service-index></service-index>
	</view>
</template>

<script>
	import serviceIndex from '@/components/service/service-index.vue'
	export default {
		data() {
			return {};
		},
		components: {
			serviceIndex
		},
		onLoad(options) {
			this.vc.onLoad(options)
		},
		onShow: function() {
		},
		methods: {}
	}
</script>

<style lang="less">
</style>
