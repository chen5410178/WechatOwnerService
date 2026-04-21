<template>
	<view>
		<view>
			<view class="block__title">{{ $t('chargeDetail.chargePile') }}</view>
			<view class="cu-form-group">
				<view class="title">{{ $t('chargeDetail.name') }}</view>
				{{machine.machineName}}
			</view>
			<view class="cu-form-group">
				<view class="title">{{ $t('chargeDetail.deviceNo') }}</view>
				{{machine.machineCode}}
			</view>
			<view class="cu-form-group" >
				<view class="title">{{ $t('chargeDetail.factory') }}</view>
				{{machine.factoryName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">{{ $t('chargeDetail.chargeRule') }}</view>
				{{machine.ruleName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">{{ $t('chargeDetail.chargeType') }}</view>
				{{machine.chargeTypeName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">{{ $t('chargeDetail.status') }}</view>
				{{machine.stateName}}
			</view>
			<view class="cu-form-group" v-if="machine.monitorId && machine.monitorId != '-1'">
				<view class="title">{{ $t('chargeDetail.monitor') }}</view>
				<view><button @click="_toPlayChargeVideo()" class="cu-btn  line-blue round q-input">{{ $t('chargeDetail.watch') }}</button></view>
			</view>
			<scroll-view scroll-x class="bg-white nav margin-top">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
						{{ $t('chargeDetail.socket') }}
					</view>
					<view class="cu-item flex-sub" :class="active==0?'text-green cur':''" @tap="tabSelect(0)">
						{{ $t('chargeDetail.order') }}
					</view>
				</view>
			</scroll-view>
			<view v-show="active == 0" class="margin-top-xs">
				<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-for="(item,index) in orders"
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
							<text>{{ $t('chargeDetail.chargePile') }}:</text>
							<text>{{item.machineName}}>{{item.machineCode}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.socket') }}:</text>
							<text>{{item.portCode}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.chargeHours') }}:</text>
							<text>{{item.chargeHours}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.hourlyPrice') }}:</text>
							<text>{{item.durationPrice}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.energy') }}:</text>
							<text>{{item.energy}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.deductAmount') }}:</text>
							<text>{{item.amount}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.startTime') }}:</text>
							<text>{{item.startTime}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.endTime') }}:</text>
							<text>{{item.endTime}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.status') }}:</text>
							<text>{{item.stateName}}</text>
						</view>
<view class="item">
							<text>{{ $t('chargeDetail.remark') }}:</text>
							<text>{{item.remark}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-show="active == 1" class="margin-top-xs">
				<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-for="(item,index) in ports"
					:key="index">
					<view class="apply-title flex justify-between">
						<view>
							<text class="text-bold">{{item.portName}}</text>
						</view>
						<view class="flex justify-start">
							{{item.portId}}
						</view>
					</view>
					<view class="apply-content flex justify-start flex-wrap">
						<view class="item">
							<text>{{ $t('chargeDetail.deviceNo') }}:</text>
							<text>{{item.portCode}}</text>
						</view>
						<view class="item">
							<text>{{ $t('chargeDetail.status') }}:</text>
							<text>{{item.stateName}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getChargeMachines,getChargeMachinePort,getChargeMachineOrder} from '../../api/machine/machineApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js';
	
	export default {
		data() {
			return {
				machineId: '',
				machine: {},
				active:1,
				orders:[],
				ports:[],
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this._loadMachines();
		},
		methods: {
			/**
			 * 查询房屋信息
			 */
			_loadMachines: function() {
				let _that = this;
				getChargeMachines({
					page:1,
					row:100,
					communityId:getCommunityId(),
					machineId:this.machineId
				}).then(_data=>{
					_that.machine = _data.data[0];
					_that.tabSelect(1);
				})
			},
			tabSelect:function(_active){
				this.active = _active;
				if(this.active == 0){
					this._loadChargeMachineOrder();
					return;
				}
				if(this.active == 1){
					//listChargeMachinePortBmoImpl
					this._loadChargeMachinePort();
					return;
				}
			},
			_toPlayChargeVideo:function(){
				let _machine = this.machine;
				uni.navigateTo({
					url:'/pages/machine/playVideo?communityId='+_machine.communityId+"&machineId="+_machine.monitorId+"&machineName="+_machine.monitorName+"&videoType=charge"
				})
			},
			_loadChargeMachinePort:function(){
				let _that =this;
				getChargeMachinePort({
					page: 1,
					row: 100,
					machineId: this.machineId,
					communityId: getCommunityId()
				}).then(_data => {
					_that.ports = _data.data;
				})
			},
			_loadChargeMachineOrder:function(){
				let _that =this;
				getChargeMachineOrder({
					page: 1,
					row: 100,
					machineId: this.machineId,
					communityId: getCommunityId()
				}).then(_data => {
					_that.orders = _data.data;
				})
			},
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
