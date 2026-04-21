<template>
<view class="user-container">
	<view class="flex-sub text-center bg-white">
		<view class="solid-bottom text-xl padding">
			<text class="text-black text-bold">{{notice.title}}</text>
		</view>
		  <view class="footer">{{ $t('noticeDetail.time') }}: {{notice.timeStr}}</view>
	</view>
	<view class="flex-sub bg-white">
		<view class="content">
		    <!-- <rich-text class="solid-bottom text-df padding" :nodes="notice.context"></rich-text> -->
			<jyf-parser :html="notice.context" ref="article"></jyf-parser>
			
		</view>
	</view>
</view>
</template>

<script>
	/** detail.js **/
	
	import context from '../../lib/java110/Java110Context.js'
	const constant = context.constant; //获取app实例
	import conf from '../../conf/config.js'
	import {replaceImgSrc} from '../../lib/java110/utils/ImageUtil.js'
	//获取app实例
	const app = getApp().globalData;
	import {
		queryNotices
	} from '@/api/index/indexApi.js';
	
	import jyfParser from "@/components/jyf-parser/jyf-parser";

	export default {
		data() {
			return {
				notice: {},
				noticeId: '',
				communityId:''
			};
		},
		
		components:{jyfParser},

		onLoad: function(options) {
			context.onLoad(options);
			let _noticeId = options.noticeId;
			this.noticeId = _noticeId;
			this.communityId = options.communityId;
			this._loadNoticeDetail();
		},
		onShow: function() {
			let that = this; // that.setData({
			//     userInfo: app.globalData.userInfo
			// });
		},
		methods: {
			_loadNoticeDetail: function() {
				let that = this;
				queryNotices({
					communityId: that.communityId,
					page: 1,
					row: 10,
					noticeId: that.noticeId
				}).then((_notices) => {
					let notice = _notices[0]
					notice.timeStr = notice.startTime.replace(/:\d{1,2}$/, ' ');
					notice.context = replaceImgSrc(notice.context,conf.baseUrl);
					that.notice = notice;
				});
			}
		}
	};
</script>
<style>
	/* 样式内联 */
</style>
