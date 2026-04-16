<template>
	<view>
		<view class="block__title">{{ $t('machineInfo') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineName') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.machineName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineCode') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.machineCode}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineLevel') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.levelName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineState') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.stateName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineBrand') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.brand}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('machineModel') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.model}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('locationDetail') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.locationDetail}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('firstEnableTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.firstEnableTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('warrantyEndTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.warrantyDeadline}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('usefulLife') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.usefulLife}}</text>
				</view>
			</view>
			<!-- <view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">采购价格</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.purchasePrice}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">资产净值</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.netWorth}}</text>
				</view>
			</view> -->
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('useUser') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.useUserName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('chargeUser') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.chargeUseName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('remark') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{equipmentAccountDetail.remark}}</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu" @click="_toMaintainance()">
			<view class="cu-item arrow">
				<view class="content padding-tb-sm">
					<view>
						<view class="text-cut" style="width:220px">{{ $t('maintenanceRecord') }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu" @click="_toInspection()">
			<view class="cu-item arrow">
				<view class="content padding-tb-sm">
					<view>
						<view class="text-cut" style="width:220px">{{ $t('inspectionRecord') }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/viewBindOwner/viewBindOwner.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	
	import {getMachines} from '@/api/machine/machineApi.js'

	export default {
		data() {
			return {
				machineId:'',
				communityId:'',
				equipmentAccountDetail: {}
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.machineId = options.machineId;
			this.communityId = options.communityId;
			this._loadMachine();
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			_loadMachine: function() {
				let _that = this;
				getMachines({
					page:1,
					row:1,
					machineId:this.machineId,
					communityId:this.communityId
				}).then(_data=>{
					if(_data.data.length < 1){
						return ;
					}
					_that.equipmentAccountDetail = _data.data[0];
				})
			},
			_toMaintainance:function(){
				uni.navigateTo({
					url:'/pages/machine/machineMaintainance?machineId='+this.machineId+"&communityId="+this.communityId
				})
			},
			_toInspection:function(){
				uni.navigateTo({
					url:'/pages/machine/machineInspection?machineId='+this.machineId+"&communityId="+this.communityId
				})
			}
		}
	};
</script>
<style>
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 60rpx 30rpx 20rpx;
	}


	.button_up_blank {
		height: 40rpx;
	}

	text {
		text-align: center;
	}
</style>
