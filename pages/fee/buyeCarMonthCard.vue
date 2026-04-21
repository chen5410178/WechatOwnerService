<template>
	<view>
		<view class="block__title">{{ $t('buyeCarMonthCard.buyeCarMonthCard') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('buyeCarMonthCard.car') }}</text>
				</view>
				<view class="action">
					<picker bindchange="PickerChange" :value="carIndex" :range="cars" :range-key="'carNum'" @change="carChange">
						<view class="picker ">
							{{carIndex == -1? $t('buyeCarMonthCard.selectFirst'): cars[carIndex].carNum}}
						</view>
					</picker>
				</view>
			</view>
			<view class="cu-item" v-if="carNum">
				<view class="content">
					<text class="text-grey">{{ $t('buyeCarMonthCard.expireTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{endTime}}</text>
				</view>
			</view>
			<view class="cu-item" v-if="carNum">
				<view class="content">
					<text class="text-grey">{{ $t('buyeCarMonthCard.selectMonthCard') }}</text>
				</view>
				<view class="action">
					<picker bindchange="PickerChange" :value="cardIndex" :range="cards" :range-key="'cardName'" @change="cardChange">
						<view class="picker">
							{{cardIndex == -1? $t('buyeCarMonthCard.selectFirst'): cards[cardIndex].cardName}}
						</view>
					</picker>
				</view>
			</view>
			<view class="cu-item" v-if="carNum">
				<view class="content">
					<text class="text-grey">{{ $t('buyeCarMonthCard.payAmount') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{amount}}</text>
				</view>
			</view>
		</view>
		
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">
		
			<view class="action text-orange margin-right line-height">
				{{ $t('buyeCarMonthCard.total') }}：{{amount}}{{ $t('buyeCarMonthCard.yuanUnit') }}
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('buyeCarMonthCard.submitOrder') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/account/myAccount.js
	import context from '../../lib/java110/Java110Context.js';
	import {queryAppOwnerCars,queryAppCarMonthCard} from '../../api/car/carApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js';
	import {getUserId} from '../../api/user/userApi.js';
	
	import {payFeeApp,payFeeWechat} from '@/api/fee/feeApi.js';
	export default {
		data() {
			return {
				carIndex:-1,
				cars:[],
				carId:'',
				carNum:'',
				endTime:'',
				communityId:'',
				cardIndex:'-1',
				cards:[],
				cardId:'',
				amount:'0'
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.roomId = options.roomId;
			this._loadCars();
		},
		methods: {
			_loadCars: function() {
				let _that = this;
				queryAppOwnerCars({
					page:1,
					row:10,
					communityId:getCommunityId(),
				}).then(_data=>{
					console.log(_data)
					_that.cars = _data;
				})
			},
			carChange:function(e){
				this.carIndex = e.detail.value;
				let _selectCar = this.cars[e.detail.value];
				this.carNum = _selectCar.carNum;
				this.endTime = _selectCar.endTime;
				this.carId = _selectCar.carId;
				this._loadCarMonthCards();
			},
			cardChange:function(e){
				this.cardIndex = e.detail.value;
				let _selectCard = this.cards[e.detail.value];
				this.cardId = _selectCard.cardId;
				this.amount = _selectCard.cardPrice;
			},
			_loadCarMonthCards: function() {
				let _that = this;
				queryAppCarMonthCard({
					page:1,
					row:50,
					carId:this.carId,
					communityId:getCommunityId(),
				}).then(_data=>{
					console.log(_data)
					_that.cards = _data;
				})
			},
			onPayFee: function() {
				if(!this.cardId){
					uni.showToast({
						icon:'none',
						title: this.$t('buyeCarMonthCard.pleaseSelectMonthCard')
					});
					return ;
				}
				let _receivedAmount = this.amount;
				let _tradeType = 'JSAPI';
				let _objData = {
					business: "buyCarMonthCard",
					communityId:getCommunityId(),
					carId: this.carId,
					carNum: this.carNum,
					cardId: this.cardId,
					feeName: this.$t('buyeCarMonthCard.buyParkingMonthCard'),
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
				};
				uni.setStorageSync('doing_cashier',_objData);
				uni.navigateTo({
					url:'/pages/fee/cashier?money='+_receivedAmount+"&business=buyCarMonthCard&communityId="+getCommunityId()+"&cashierUserId="+getUserId()
				})
			}
		}
	}
</script>

<style lang="scss">
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
	
	.cu-btn.lgplus {
		padding: 0 20px;
		font-size: 18px;
		height: 100upx;
	
	}
	
	.cu-btn.sharp {
		border-radius: 0upx;
	}
	
	.line-height {
		line-height: 100upx;
	}
</style>
