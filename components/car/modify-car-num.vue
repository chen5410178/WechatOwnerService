<template>
	<view>
		<view class="cu-modal bottom-modal" :class="showModel?'show':''">
			<view class="cu-dialog">
				<scroll-view scroll-y style="height: 300upx; ">
					<view class="cu-form-group">
						<view class="title">旧车牌号</view>
						{{carNum}}
					</view>
					<view class="cu-form-group">
						<view class="title">新车牌号</view>
						<input v-model="newCarNum" placeholder="请输入车牌号" style="text-align:right"></input>
					</view>
				</scroll-view>
				<view class="btn-box padding">
					<button class=" btn bg-blue" @click="_doModifyCarNum()">确定修改</button>
					<button class="line-red margin-top" @click="cancel()">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {editSelfCarNum} from '@/api/car/carApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js'
	export default {
		name:"modifyCarNum",
		data() {
			return {
				showModel: false,
				carId:'',
				carNum:'',
				newCarNum:''
			};
		},
		methods:{
			_showModifyCarNum(_car){
				this.carId = _car.carId;
				this.carNum = _car.carNum;
				this.showModel = true;
			},
			_doModifyCarNum:function(){
				let _that = this;
				editSelfCarNum({
					carId:this.carId,
					carNum:this.carNum,
					newCarNum:this.newCarNum,
					communityId:getCommunityId()
				}).then((_data)=>{
					if(_data.code != 0){
						uni.showToast({
							icon:'none',
							title:_data.msg
						});
						return;
						
					}
					_that.showModel = false;
					uni.$emit("loadData")
				})
			},
			cancel:function(){
				this.showModel = false;
			}
		}
	}
</script>

<style>

</style>