<template>
	<view>
		<index-home></index-home>
	</view>
</template>

<script>
	import indexHome from '@/components/index/index-home.vue'
	import {autoLogin} from '../../api/user/sessionApi.js';
	export default {
		data() {
			return {};
		},
		components: {
			indexHome,
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: '业主版'
			})
			this.vc.onLoad(options);
			autoLogin(options);
		},
		onShow: function() {
		},
		methods: {}
	};
</script>
<style lang="less">
	@import "./index.css";
</style>
