<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==0?'text-green cur':''" @tap="tabSelect(0)">
					{{ $t('myRepair.pending') }}
				</view>
				<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
					{{ $t('myRepair.processing') }}
				</view>
				<view class="cu-item flex-sub" :class="active==2?'text-green cur':''" @tap="tabSelect(2)">
					{{ $t('myRepair.completed') }}
				</view>
			</view>
		</scroll-view>
		<!---->
		<view class="ppfl_c">
			<view v-if="repairs && repairs.length>0">
				<view v-for="(item,index) in repairs" :key="index"
					class="bg-white margin-top margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.repairId}}({{item.stateName}})</view>
						<view class="text-gray">{{item.tel}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">{{ $t('myRepair.repairTypeName') }}</view>
						<view class="text-gray">{{item.repairTypeName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.repairPerson') }}</view>
						<view class="text-gray">{{item.repairName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.location') }}</view>
						<view class="text-gray">{{item.repairObjName}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.submitTime') }}</view>
						<view class="text-gray">{{item.createTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.submitHours') }}</view>
						<view class="text-gray">{{item.submitHours }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.appointmentTime') }}</view>
						<view class="text-gray">{{item.appointmentTime }}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">{{ $t('myRepair.repairContent') }}</view>
						<view class="text-gray">{{item.context}}</view>
					</view>
					<view class="solid-top flex justify-end margin-top padding-top-sm ">
						<button class="cu-btn sm line-gray" @click="repairDetail(item)">{{ $t('myRepair.detail') }}</button>
						<button class="cu-btn sm line-gray margin-left" v-if="item.timeoutFlag == 'Y'"
							@click="_doUrgeRepair(item)">{{ $t('myRepair.urgeRepair') }}</button>
						<button class="cu-btn sm bg-red margin-left" v-if="item.state == '1000'"
							@click="deleteRepair(item)">{{ $t('myRepair.delete') }}</button>
						<button v-if="item.state == '1400'" class="cu-btn sm bg-green  margin-left"
							@click="_toPay(item)">{{ $t('myRepair.pay') }}</button>
						<button v-if="item.state == '1700'" class="cu-btn sm bg-green margin-left"
							@click="_appraiseRepair(item)">{{ $t('myRepair.evaluate') }}</button>
						<button v-if="item.state == '1700' || item.state == '1400'"
							class="cu-btn sm  bg-red margin-left" 							@click="_backRepair(item)">{{ $t('myRepair.returnRepair') }}</button>
					</view>
				</view>
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>

		<view class="cu-modal" :class="deleteRepairModal==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ $t('myRepair.tips') || '温馨提示' }}</view>
					<view class="action" @tap="_cancleDeleteRepair()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{ $t('myRepair.confirmDelete') }}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleDeleteRepair()">{{ $t('myRepair.cancel') }}</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="_doDeleteRepair()">{{ $t('myRepair.delete') }}</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="backRepairModal==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ $t('myRepair.returnReason') }}</view>
					<view class="action" @tap="_cancleBackRepair()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<textarea v-model="context" maxlength="50" :placeholder="$t('myRepair.inputReturnReason')"></textarea>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleBackRepair()">{{ $t('myRepair.cancel') }}</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="_doBackRepair()">{{ $t('myRepair.confirm') }}</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	import context from '../../lib/java110/Java110Context.js';
	import {
		listRepairStaffs
	} from '@/api/repair/repairApi.js';
	import {
		getUserId
	} from '../../api/user/userApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		queryUserRepair,
		urgeRepair
	} from '@/api/repair/repairApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';
	const factory = context.factory;;
	const constant = context.constant;
	export default {
		data() {
			return {
				active: 0,
				userId: '',
				roomId: '',
				communityId: '',
				repairs: [],
				deleteRepairModal: false,
				backRepairModal: false,
				curRepair: {},
				preStaffId: '',
				preStaffName: '',
				context: '',
			}
		},
		components: {
			noDataPage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			if (!hasLogin()) {
				uni.showToast({
					icon: 'none',
						title: this.$t('myRepair.notLogin')
				})
				return;
			}
			this.communityId = getCommunityId();
			this._loadRepair(this.active);
		},
		methods: {
			/**
			 * 加载我的报修
			 */
			_loadRepair: function(_active) {
				let that = this;

				let _states = '';
				if (_active == 0) {
					_states = '1000';
				} else if (_active == 1) {
					_states = '1100,1200,1300';
				} else {
					_states = '1400,1500,1700,1800,1900,2000'
				}
				that.repairs = [];

				queryUserRepair({
					"communityId": that.communityId,
					"page": 1,
					"row": 10,
					"userId": that.userId,
					"repairStates": _states
				}).then(_json => {
					that.repairs = _json.data;

				});
			},
			onChange: function(e) {
				console.log(e);

				this._loadRepair(e.detail.index);
			},
			tabSelect: function(_active) {
				this.active = _active;
				this._loadRepair(_active);
			},
			repairDetail: function(_repair) {
				context.navigateTo({
					url: '/pages/repair/repairDetail?repairId=' + _repair.repairId
				});
			},
			_doUrgeRepair:function(_repair){
				urgeRepair({
					repairId:_repair.repairId,
					communityId:getCommunityId()
				}).then(_data=>{
					uni.showToast({
						icon:'none',
						title: this.$t('myRepair.urgeSuccess'),
						duration:5000
					});
					return;
				})
			},
			deleteRepair: function(_repair) {
				this.curRepair = _repair;
				this.deleteRepairModal = true;
			},
			_cancleDeleteRepair: function() {
				this.deleteRepairModal = false;
			},
			_doDeleteRepair: function() {
				let that = this;
				context.request({
					url: constant.url.deleteOwnerRepair,
					header: context.getHeaders(),
					method: "POST",
					data: this.curRepair,
					//动态数据
					success: function(res) {
						console.log(res); //成功情况下跳转
						if (res.data.code != 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 2000
							});
							return;
						}
						uni.showToast({
							icon: 'none',
							title: this.$t('myRepair.processSuccess'),
							duration: 2000
						});
						that._cancleDeleteRepair();
						that._loadRepair(0);
					},
					fail: function(e) {
						console.log(e);
						uni.showToast({
							title: this.$t('myRepair.serverError'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_backRepair: function(_repair) {
				//查询 上一任处理人 
				let _communityInfo = context.getCurrentCommunity();
				let _that = this;
				let dataObj = {
					page: 1,
					row: 1,
					communityId: _communityInfo.communityId,
					repairId: _repair.repairId,
					staffId: this.userId,
					//state: '10001'
				};
				listRepairStaffs(dataObj).then(_json => {
					if (_json.code == 0) {
						let _data = _json.data;

						if (_data.length < 1) {
							uni.showToast({
								title: this.$t('myRepair.cannotReturn')
							});
							return;
						}
						_that.preStaffId = _data[0].preStaffId;
						_that.preStaffName = _data[0].preStaffName;
						_that.curRepair = _repair;
						_that.backRepairModal = true;
					}
				});
			},
			_cancleBackRepair: function() {
				this.backRepairModal = false;
			},
			_doBackRepair: function() {
				let that = this;
				if (this.context == '') {
					uni.showToast({
						title: this.$t('myRepair.returnContentEmpty'),
						icon: 'none'
					});
					return;
				}
				let _communityInfo = context.getCurrentCommunity();
				let _data = {
					staffId: this.userId,
					staffName: this.preStaffName,
					context: this.context,
					action: 'BACK',
					repairId: this.curRepair.repairId,
					communityId: _communityInfo.communityId
				};
				context.request({
					url: constant.url.repairDispatch,
					header: context.getHeaders(),
					method: "POST",
					data: _data,
					//动态数据
					success: function(res) {
						console.log(res); //成功情况下跳转
						if (res.data.code != 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 2000
							});
							return;
						}
						uni.showToast({
							icon: 'none',
							title: this.$t('myRepair.processSuccess'),
							duration: 2000
						});
						that._cancleBackRepair();
						that._loadRepair(0);
					},
					fail: function(e) {
						console.log(e);
						uni.showToast({
							title: this.$t('myRepair.serverError'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_appraiseRepair: function(_repair) {
				context.navigateTo({
					url: '/pages/repair/appraiseRepair?repairId=' + _repair.repairId
				});
			},
			_toPay: function(_item) {
				console.log(_item);
				context.navigateTo({
					url: '/pages/fee/repairPay?repairId=' + _item.repairId +
						"&communityId=" + _item.communityId +
						"&userId=" + this.userId +
						"&repairObjId=" + _item.repairObjId +
						"&appointmentTime=" + _item.appointmentTime +
						"&repairTypeName=" + _item.repairTypeName +
						"&repairObjName=" + _item.repairObjName +
						"&repairName=" + _item.repairName +
						"&context=" + _item.context
				})
			}
		}
	}
</script>

<style>
	.solid-bottom::after {
		border-bottom: 2upx solid rgba(0, 0, 0, 0.1);
	}
</style>