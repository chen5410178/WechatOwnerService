<template>
	<view>
		<scroll-view scroll-y>
			<view class="block__title">{{ $t('houseInfo') }}</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('communityName') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{communityName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('room') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{payerObjName}}</text>
					</view>
				</view>
				<view class="cu-item" v-if="buildUpArea">
					<view class="content">
						<text class="text-grey">{{ $t('builtUpArea') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{buildUpArea + $t('sqm')}}</text>
					</view>
				</view>
			</view>
			<view class="block__title">{{ $t('feeInfo') }}</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item arrow" v-if="feeTypes && feeTypes.length > 0">
					<view class="content">
						<text class="text-grey">{{ $t('feeType') }}</text>
					</view>
					<view class="action">
						<picker :value="selectedFeeTypeIndex" :range="feeTypeNames" @change="onFeeTypeChange">
							<view class="picker">
								{{selectedFeeTypeName || $t('selectFeeType')}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="selectedFeeType">
					<view class="content">
						<text class="text-grey">{{ $t('rechargeAmount') }}</text>
					</view>
					<view class="action">
						<input v-model="amount" :placeholder="$t('inputRechargeAmount')" type="digit" class="text-right" @input="onAmountInput"></input>
					</view>
				</view>
				<view class="cu-item" v-if="selectedFeeType && amount">
					<view class="content">
						<text class="text-grey">{{ $t('amount') }}</text>
					</view>
					<view class="action">
						<text class="text-red text-lg">￥{{amount}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bg-white border flex justify-end" style="position: fixed;width: 100%;bottom: 0;" v-if="selectedFeeType && amount">
			<view class="action text-orange margin-right line-height">
				{{ $t('total') }}：{{amount}}{{ $t('yuanUnit') }}
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('payNow') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/fee/meterRulePreFee.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	
	import {
		queryPhoneMeterPayFeeRule
	} from '@/api/fee/feeApi.js';
	
	import {
		getUserId
	} from '../../api/user/userApi.js';
	
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	
	import {
		autoLogin
	} from '../../api/user/sessionApi.js';
	
	import {
		getRooms
	} from '../../api/room/roomApi.js';

	export default {
		data() {
			return {
				communityId: '',
				communityName: '',
				roomId: '',
				payerObjName: '',
				buildUpArea: '',
				feeTypes: [],
				feeTypeNames: [],
				selectedFeeTypeIndex: 0,
				selectedFeeType: null,
				selectedFeeTypeName: '',
				amount: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			context.onLoad(options);
			autoLogin(options);
			
			// 从参数中获取 roomId
			if (options.roomId) {
				this.roomId = options.roomId;
			}
			
			let _communityInfo = context.getCurrentCommunity();
			this.communityId = _communityInfo.communityId || getCommunityId();
			this.communityName = _communityInfo.communityName || '';
			
			// 加载房屋信息
			this.loadRoomInfo();
		},
		methods: {
			/**
			 * 加载房屋信息
			 */
			loadRoomInfo: function() {
				if (!this.roomId) {
					uni.showToast({
						icon: 'none',
						title: this.$t('roomIdRequired')
					});
					return;
				}
				
				let _that = this;
				getRooms({
					communityId: this.communityId
				}).then(data => {
					let rooms = data.rooms || [];
					// 根据 roomId 查找对应的房屋
					let room = rooms.find(r => r.roomId === _that.roomId);
					if (room) {
						_that.payerObjName = room.floorNum + '-' + room.unitNum + '-' + room.roomNum;
						_that.buildUpArea = room.builtUpArea || '';
					}
					// 加载水电预付费规则
					_that.loadMeterPayFeeRules();
				}).catch(error => {
					console.error('加载房屋信息失败:', error);
					// 即使房屋信息加载失败，也尝试加载费用类型
					this.loadMeterPayFeeRules();
				});
			},
			
			/**
			 * 加载水电预付费规则
			 */
			loadMeterPayFeeRules: function() {
				if (!this.communityId) {
					uni.showToast({
						icon: 'none',
						title: this.$t('communityIdRequired')
					});
					return;
				}
				
				let _that = this;
				uni.showLoading({
					title: this.$t('loading')
				});
				
				queryPhoneMeterPayFeeRule({
					communityId: this.communityId
				}).then(data => {
					uni.hideLoading();
					if (data && data.data) {
						_that.feeTypes = data.data || [];
						
						// 初始化费用类型名称列表
						_that.feeTypeNames = _that.feeTypes.map(feeType => feeType.ftName);
						
						if (_that.feeTypes.length > 0) {
							// 默认选择第一个费用类型
							_that.selectedFeeTypeIndex = 0;
							_that.selectedFeeType = _that.feeTypes[0];
							_that.selectedFeeTypeName = _that.feeTypeNames[0];
						} else {
							uni.showToast({
								icon: 'none',
								title: this.$t('noFeeType')
							});
						}
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: error || this.$t('loadFailed')
					});
				});
			},
			
			/**
			 * 选择费用类型
			 */
			onFeeTypeChange: function(e) {
				let index = e.detail.value;
				this.selectedFeeTypeIndex = index;
				this.selectedFeeType = this.feeTypes[index];
				this.selectedFeeTypeName = this.feeTypeNames[index];
				// 重置金额
				this.amount = '';
			},
			
			/**
			 * 输入金额
			 */
			onAmountInput: function(e) {
				this.amount = e.detail.value;
			},
			
			/**
			 * 缴费
			 */
			onPayFee: function() {
				if (!this.selectedFeeType) {
					uni.showToast({
						icon: 'none',
						title: '请选择费用类型'
					});
					return;
				}
				
				if (!this.amount || parseFloat(this.amount) <= 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入充值金额'
					});
					return;
				}
				
				let _receivedAmount = this.amount;
				let _objData = {
					business: "meterRulePreFee",
					communityId: this.communityId,
					roomId: this.roomId,
					ftId: this.selectedFeeType.ftId,
					ftName: this.selectedFeeType.ftName,
					receivedAmount: _receivedAmount,
					feeName: this.selectedFeeType.ftName,
					payerObjId: this.roomId,
					payerObjType: 3333
				};
				
				uni.setStorageSync('doing_cashier', _objData);
				uni.navigateTo({
					url: '/pages/fee/cashier?money=' + _receivedAmount + "&business=meterRulePreFee&communityId=" + this.communityId + "&cashierUserId=" + getUserId()
				});
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
		padding: 40rpx 30rpx 20rpx;
	}

	.fee-last {
		margin-bottom: 200upx;
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
