<template>
	<view>
		<view class="cu-form-group margin-top-sm">
			<view class="title">{{ $t('giftParkingCoupon.carNum') }}</view>
			<input :placeholder="$t('giftParkingCoupon.inputCarNum')" class="text-right" v-model="carNum"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('giftParkingCoupon.parkingLot') }}</view>
			<picker @change="parkingAreaChange" :value="paIdIndex" :range="parkingAreas" :range-key="'num'">
				<view class="picker">
					{{paIdIndex > -1 ? paNum:$t('giftParkingCoupon.selectParkingLot')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top-sm">
			<view class="title">{{ $t('giftParkingCoupon.coupon') }}</view>
			<input :placeholder="$t('giftParkingCoupon.inputCoupon')" class="text-right" disabled="disabled" v-model="couponName"></input>
		</view>
		<view class="cu-form-group margin-top-sm">
			<view class="title">{{ $t('giftParkingCoupon.giftCount') }}</view>
			<input :placeholder="$t('giftParkingCoupon.inputGiftCount')" class="text-right" type="number" v-model="giftCount"></input>
		</view>
		<view class="padding">
			<button class="cu-btn block bg-blue margin-tb-sm lg" @click="_saveCustomCoupon()" type="">{{ $t('giftParkingCoupon.gift') }}</button>
		</view>
	</view>
</template>

<script>
		import {getCommunityId,listParkingAreas} from '@/api/community/communityApi.js';
		import {couponPropertyUserGiftCar} from '@/api/fee/feeApi.js'
	export default {
		data() {
			return {
				carNum:'',
				couponName:'',
				couponId:'',
				giftCount:1,
				paId:'',
				parkingAreas:[],
				paIdIndex:'-1',
				paNum:''
				
			};
		},
		onLoad(options) {
			this.couponName = options.couponName;
			this.couponId = options.couponId;
			this._loadParkingArea();
		},
		methods:{
			_loadParkingArea:function(){
				let _that = this;
				listParkingAreas({
					page:1,
					row:100,
					communityId:getCommunityId()
				}).then(_data=>{
					_that.parkingAreas = _data;
				})
			},
			parkingAreaChange(e) {
				this.paIdIndex = e.detail.value;
				this.paNum = this.parkingAreas[this.paIdIndex].num;
				this.paId = this.parkingAreas[this.paIdIndex].paId;
			},
			_saveCustomCoupon:function(){
				if(!this.carNum){
					uni.showToast({
						icon:'none',
						title: this.$t('giftParkingCoupon.noCarNum')
					});
					return ;
				}
				
				if(!this.couponId){
					uni.showToast({
						icon:'none',
						title: this.$t('giftParkingCoupon.noParkingTicket')
					});
					return ;
				}
				
				let _data = {
					communityId:getCommunityId(),
					carNum:this.carNum,
					couponId:this.couponId,
					giftCount:this.giftCount,
					paId:this.paId
				}
				
				couponPropertyUserGiftCar(_data).then(_msg=>{
					uni.showToast({
						icon:'none',
						title: this.$t('giftParkingCoupon.giftSuccess')
					});
					uni.navigateBack({
						delta:1
					})
				},err=>{
					uni.showToast({
						icon:'none',
						title:err
					});
				})
				
			}
		}
	}
</script>

<style>

</style>