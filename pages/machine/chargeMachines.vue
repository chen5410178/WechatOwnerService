<template>
	<view>
		<scroll-view scroll-x class="bg-white nav ">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==0?'text-blue cur':''" @tap="tabSelect(0)">
					充电桩
				</view>
				<view class="cu-item flex-sub" :class="active==1?'text-blue cur':''" @tap="tabSelect(1)">
					订单
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
						<text>充电桩:</text>
						<text>{{item.machineName}}>{{item.machineCode}}</text>
					</view>
					<view class="item">
						<text>插座:</text>
						<text>{{item.portCode}}</text>
					</view>
					<view class="item">
						<text>充电小时:</text>
						<text>{{item.chargeHours}}</text>
					</view>
					<view class="item">
						<text>小时电价:</text>
						<text>{{item.durationPrice}}</text>
					</view>
					<view class="item">
						<text>充电量:</text>
						<text>{{item.energy}}</text>
					</view>
					<view class="item">
						<text>扣款金额:</text>
						<text>{{item.amount}}</text>
					</view>
					<view class="item">
						<text>开始时间:</text>
						<text>{{item.startTime}}</text>
					</view>
					<view class="item">
						<text>结束时间:</text>
						<text>{{item.endTime}}</text>
					</view>
					<view class="item">
						<text>状态:</text>
						<text>{{item.stateName}}</text>
					</view>
					<view class="item">
						<text>备注:</text>
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

<style>
	.heard-location-icon {
		width: 100%;
		height: 300rpx;
	}

	text {
		text-align: center;
	}
</style>