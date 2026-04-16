<template>
	<view>
		<view class="cu-modal bottom-modal" :class="showModel?'show':''">
			<view class="cu-dialog">
				<scroll-view scroll-y style="height: 300upx; ">
					<view class="cu-form-group">
						<view class="title">{{ $t('carNum') }}</view>
						<input v-model="carNum" :placeholder="$t('pleaseInputCarNum')" style="text-align:right"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">{{ $t('carBrand') }}</view>
						<input v-model="carBrand" :placeholder="$t('enterCarNum')" style="text-align:right"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">{{ $t('carColor') }}</view>
						<input v-model="carColor" :placeholder="$t('enterCarNum')" style="text-align:right"></input>
					</view>
				</scroll-view>
				<view class="btn-box padding">
					<button class=" btn bg-blue" @click="_doSaveMemberCarNum()">{{ $t('submit') }}</button>
					<button class="line-red margin-top" @click="cancel()">{{ $t('cancel') }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {saveMemberCar} from '@/api/car/carApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js'
	export default {
		name:"addMemberCar",
		data() {
			return {
				showModel: false,
				carId:'',
				carNum:'',
				carBrand:'',
				carColor:''
			};
		},
		methods:{
			_showSaveMemberCarNum(_car){
				this.carId = _car.carId;
				this.showModel = true;
			},
			_doSaveMemberCarNum:function(){
				let _that = this;
				saveMemberCar({
					carId:this.carId,
					carNum:this.carNum,
					carBrand:this.carBrand,
					carColor:this.carColor,
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
					this.$emit("loadData",{})
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