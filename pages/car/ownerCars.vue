<template>
	<view>
		<view class="block__title">{{ $t('ownerCars.title') }}</view>
		<view class="cu-list menu" v-for="(item,index) in cars" :key="index">
			<view class="cu-item arrow" @click="_toCarDetail(item)" >
				<view class="content">
					<text class="text-grey">{{item.carNum}}</text>
				</view>
				<view class="action ">
					<text class="text-grey text-sm" v-if="item.areaNum">{{item.areaNum}}-{{item.num}}</text>
					<text class="text-grey text-sm" v-else>{{ $t('ownerCars.noParkingSpace') }}</text>
				</view>
			</view>
		</view>
		<view class="flex flex-direction">
			<button @click="_applyParking()" class="cu-btn line-blue margin-tb-sm lg">{{ $t('ownerCars.applyParking') }}</button>
		</view>
	</view>
</template>

<script>
	import {
		hasLogin
	} from '../../api/user/sessionApi.js';
	import {queryAppOwnerCars} from '../../api/car/carApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js';
	
	export default {
		data() {
			return {
				cars: []
			}
		},
		onLoad(options) {
			if (!hasLogin()) {
				this.vc.navigateTo({
					url: '/pages/login/showlogin'
				});
				return;
			}
			this._loadCars();
		},
		methods: {
			_loadCars: function() {
				let _that = this;
				queryAppOwnerCars({
					page:1,
					row:30,
					carTypeCd:'1001',
					communityId:getCommunityId(),
				}).then(_data=>{
					console.log(_data)
					_that.cars = _data;
				})
			},
			_toCarDetail:function(_car){
				uni.navigateTo({
					url:'/pages/car/carDetail?carId='+_car.memberId
				})
			},
			_applyParking: function() {
				uni.navigateTo({
					url: '/pages/car/applyparking'
				})
			}
		}
	}
</script>

<style>
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}
	
	.button_up_blank {
		height: 40rpx;
	}
	
</style>