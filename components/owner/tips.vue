<template>
	<view>
		<view class="cu-modal" :class="showTips==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{title}}</view>
					<view class="action" @tap="_cancleTip()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view >{{content}}</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleTip()">关闭</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"tips",
		data() {
			return {
				showTips:false,
				title:'',
				content:''
			};
		},
		methods:{
			openTip:function(_title,_content){
				
				this.title = _title;
				this.content = _content;
				this.showTips = true;
				console.log('openTip',this.showTips)
			},
			_cancleTip:function(){
				this.showTips = false;
			}
		}
	}
</script>

<style>

</style>