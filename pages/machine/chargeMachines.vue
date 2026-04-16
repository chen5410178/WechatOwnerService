<template>
	<view>
		<scroll-view scroll-x class="bg-white nav ">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==0?'text-blue cur':''" @tap="tabSelect(0)">
					{{ $t('machine.chargePile') }}
				</view>
				<view class="cu-item flex-sub" :class="active==1?'text-blue cur':''" @tap="tabSelect(1)">
					{{ $t('machine.order') }}
				</view>
			</view>
		</scroll-view>
		<view v-show="active == 0" class="margin-top-xs">
			<view class="cu-list grid" :class="'col-2'">
				<view class="cu-item" @click="_toChargeDetail(item);" v-for="(item,index) in machines" :key="index">
					<view :class="['cuIcon-command','text-grey']"></view>
					<text>{{item.machineName}}</text>
				</view>
			</view>
		</view>
		<view v-show="active == 1" class="margin-top-xs">
			<no-data-page v-if="!orders || orders.length < 1"></no-data-page>
			<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-else v-for="(item,index) in orders"
				:key="index">
				<view class="apply-title flex justify-between">
					<view>
						<text class="text-bold">{{item.personName}}/{{item.personTel}}</text>
					</view>
					<view class="flex justify-start">
						{{item.orderId}}
					</view>
				</view>
				<view class="apply-content flex justify-start flex-wrap">
					<view class="item">
						<text>{{ $t('machine.chargePile') }}:</text>
						<text>{{item.machineName}}>{{item.machineCode}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.socket') }}:</text>
						<text>{{item.portCode}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.chargeHours') }}:</text>
						<text>{{item.chargeHours}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.hourlyPrice') }}:</text>
						<text>{{item.durationPrice}}</text>
					</view>
<view class="item">
						<text>{{ $t('machine.chargeEnergy') }}:</text>
						<text>{{item.energy}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.deductAmount') }}:</text>
						<text>{{item.amount}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.startTime') }}:</text>
						<text>{{item.startTime}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.endTime') }}:</text>
						<text>{{item.endTime}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.status') }}:</text>
						<text>{{item.stateName}}</text>
					</view>
					<view class="item">
						<text>{{ $t('machine.remark') }}:</text>
						<text>{{item.remark}}</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getChargeMachines,
		getChargeMachineOrder
	} from '../../api/machine/machineApi.js';
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	import {
		hasOwner
	} from '@/api/owner/ownerApi.js';
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	export default {
		data() {
			return {
				topImg: this.imgUrl + '/h5/images/chargeMachine.jpg',
				machines: [],
				active:0,
				orders:[],
			}
		},
		onLoad(options) {
			this._loadChargeMachines();
		},
		components:{
			noDataPage
		},
		methods: {
			_loadChargeMachines: function() {
				let _that = this;
				getChargeMachines({
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_that.machines = _data.data;
				})
			},
			_loadChargeMachineOrder:function(){
				let _that =this;
				getChargeMachineOrder({
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_that.orders = _data.data;
				})
			},
			tabSelect:function(_active){
				this.active = _active;
				if(this.active == 0){
					this._loadChargeMachines();
					return;
				}
				if(this.active == 1){
					//listChargeMachinePortBmoImpl
					this._loadChargeMachineOrder();
					return;
				}
			},
			_toChargeDetail: function(_item) {
				this.vc.navigateTo({
					url: '/pages/machine/chargeDetail?machineId=' + _item.machineId + "&communityId=" + _item
						.communityId
				});
			}

		}
	}
</script>

<style lang="scss">
	.heard-location-icon {
		width: 100%;
		height: 300rpx;
	}

	text {
		text-align: center;
	}
	
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
	
	.cu-list.menu-avatar>.cu-item .content-left {
		left: 30upx;
	}
	
	.cu-list+.cu-list {
		margin-top: 20upx;
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
	
	.sub-info {
		background-color: #fff;
		//margin-top: 0.5upx;
		padding: 15upx;
	
		.sub-info-item {
			width: 45%;
			margin: 10upx 15upx 0upx 15upx;
		}
	}
	.apply-title {
		height: 60upx;
		line-height: 50upx;
		border-bottom: 1upx solid #F1F1F1;
	}
	
	.apply-content {
		.item {
			width: 50%;
			margin-top: 20upx;
		}
	}
	
	.radius-sm {
		border-radius: 16upx;
	}
</style>