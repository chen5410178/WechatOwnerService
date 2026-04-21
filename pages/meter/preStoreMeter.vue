<template>
	<view>
		<view class="block__title">{{machineName}}{{ $t('preStoreMeter.recharge') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('preStoreMeter.meterNo') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{address}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('preStoreMeter.remainBalance') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{curDegrees}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('preStoreMeter.rechargeAmount') }}</text>
				</view>
				<view class="action">
					<input v-model="amount" :placeholder="$t('preStoreMeter.inputRechargeAmount')" type="number" class="text-right"></input>
				</view>
			</view>
		</view>
		
		<view class=" bg-white  border flex justify-end" style="position: fixed;width: 100%;bottom: 0;">
		
			<view class="action text-orange margin-right line-height">
				{{ $t('preStoreMeter.total') }}：{{amount}}{{ $t('preStoreMeter.yuan') }}
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('preStoreMeter.submitOrder') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/account/myAccount.js
	import context from '../../lib/java110/Java110Context.js';
	import {getMeterMachine} from '../../api/machine/machineApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js';
	import {getUserId} from '../../api/user/userApi.js';
	
	import {payFeeApp,payFeeWechat} from '@/api/fee/feeApi.js';
	export default {
		data() {
			return {
				machineId:'',
				machineName:'',
				address:'',
				curDegrees:'0',
				amount:'0',
				appId:'',
				communityId:'',
				roomId:''
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.roomId = options.roomId;
			this.loadMeterMachine();
		},
		methods: {
			loadMeterMachine: function() {
				let _that = this;
				getMeterMachine({
					page:1,
					row:10,
					communityId:getCommunityId(),
					machineId:this.machineId,
					roomId:this.roomId
				}).then(_data=>{
					_that.machineName=_data[0].machineName;
					_that.address=_data[0].address;
					_that.curDegrees=_data[0].curDegrees;
					_that.amount=_data[0].amount;
				})
			},
			
			onPayFee: function() {
				if(!this.amount){
					uni.showToast({
						icon:'none',
						title: this.$t('preStoreMeter.noAmountFilled')
					});
					return ;
				}
				let _receivedAmount = this.amount;
				let _tradeType = 'JSAPI';
				let _objData = {
					business: "preStoreMeter",
					communityId:getCommunityId(),
					roomId: this.roomId,
					machineId: this.machineId,
					feeName: this.feeConfigName + this.$t('preStoreMeter.recharge'),
					receivedAmount: _receivedAmount,
					tradeType: _tradeType,
				};
				uni.setStorageSync('doing_cashier',_objData);
				uni.navigateTo({
					url:'/pages/fee/cashier?money='+_receivedAmount+"&business=preStoreMeter&communityId="+getCommunityId()+"&cashierUserId="+getUserId()
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
