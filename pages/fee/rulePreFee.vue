<template>
	<view>
		<scroll-view scroll-y>
			<view class="block__title">{{ $t('rulePreFee.houseInfo') }}</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.communityName') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{communityName}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.room') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{payerObjName}}</text>
					</view>
				</view>
				<view class="cu-item" v-if="buildUpArea">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.builtUpArea') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{buildUpArea + $t('rulePreFee.sqm')}}</text>
					</view>
				</view>
			</view>
			<view class="block__title">{{ $t('rulePreFee.feeInfo') }}</view>
			<view class="cu-list menu fee-last">
				<view class="cu-item arrow" v-if="rules && rules.length > 0">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.prePayFee') }}</text>
					</view>
					<view class="action">
						<picker :value="selectedRuleIndex" :range="ruleNames" @change="onRuleChange">
							<view class="picker">
								{{selectedRuleName || $t('rulePreFee.selectPrePayFee')}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item arrow" v-if="selectedRule">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.month') }}</text>
					</view>
					<view class="action">
						<picker :value="selectedMonthIndex" :range="monthList" @change="onMonthChange">
							<view class="picker">
								{{selectedMonthName || $t('rulePreFee.selectMonth')}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="selectedRule && selectedMonth > 0">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.monthPrice') }}</text>
					</view>
					<view class="action">
						<text class="text-grey text-sm">{{selectedRule.monthAmount}}{{ $t('rulePreFee.monthUnit') }}</text>
					</view>
				</view>
				<view class="cu-item" v-if="selectedRule && selectedMonth > 0">
					<view class="content">
						<text class="text-grey">{{ $t('rulePreFee.amount') }}</text>
					</view>
					<view class="action">
						<text class="text-red text-lg">￥{{receivableAmount}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bg-white border flex justify-end" style="position: fixed;width: 100%;bottom: 0;" v-if="selectedRule && selectedMonth > 0">
			<view class="action text-orange margin-right line-height">
				{{ $t('rulePreFee.total') }}：{{receivableAmount}}{{ $t('rulePreFee.yuanUnit') }}
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red shadow-blur lgplus sharp" @click="onPayFee()">{{ $t('payNow') }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/fee/rulePreFee.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	
	import {
		listPrePayFeeRule
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
				rules: [],
				ruleNames: [],
				selectedRuleIndex: 0,
				selectedRule: null,
				selectedRuleName: '',
				monthList: [],
				selectedMonthIndex: 0,
				selectedMonth: 0,
				selectedMonthName: '',
				receivableAmount: '0.00'
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
			
			// 初始化月份列表（1-24月）
			this._initMonthList();
			
			// 加载房屋信息
			this.loadRoomInfo();
		},
		methods: {
			/**
			 * 初始化月份列表
			 */
			_initMonthList: function() {
				this.monthList = [];
				for (let i = 1; i <= 24; i++) {
					this.monthList.push(i + this.$t('month'));
				}
			},
			
			/**
			 * 加载房屋信息
			 */
			loadRoomInfo: function() {
				if (!this.roomId) {
					uni.showToast({
						icon: 'none',
						title: this.$t('invalidRoomId')
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
					// 加载预付费规则
					_that.loadPrePayFeeRules();
				}).catch(error => {
					console.error('加载房屋信息失败:', error);
					// 即使房屋信息加载失败，也尝试加载预付费规则
					this.loadPrePayFeeRules();
				});
			},
			
			/**
			 * 加载预付费规则
			 */
			loadPrePayFeeRules: function() {
				if (!this.roomId || !this.communityId) {
					uni.showToast({
						icon: 'none',
						title: this.$t('incompleteHouseInfo')
					});
					return;
				}
				
				let _that = this;
				uni.showLoading({
					title: this.$t('common.loading')
				});
				
				listPrePayFeeRule({
					communityId: this.communityId,
					payerObjId: this.roomId,
					payerObjType: '3333'
				}).then(data => {
					uni.hideLoading();
					if (data && data.data) {
						_that.payerObjName = data.data.payerObjName || _that.payerObjName;
						_that.buildUpArea = data.data.buildUpArea || data.data.roomArea || '';
						_that.rules = data.data.rules || [];
						
						// 初始化规则名称列表
						_that.ruleNames = _that.rules.map(rule => rule.feeName);
						
						if (_that.rules.length > 0) {
							// 默认选择第一个规则
							_that.selectedRuleIndex = 0;
							_that.selectedRule = _that.rules[0];
							_that.selectedRuleName = _that.ruleNames[0];
						} else {
							uni.showToast({
								icon: 'none',
								title: this.$t('noPrePayRule')
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
			 * 选择预付费用
			 */
			onRuleChange: function(e) {
				let index = e.detail.value;
				this.selectedRuleIndex = index;
				this.selectedRule = this.rules[index];
				this.selectedRuleName = this.ruleNames[index];
				// 重置月份选择
				this.selectedMonthIndex = 0;
				this.selectedMonth = 0;
				this.selectedMonthName = '';
				this.receivableAmount = '0.00';
			},
			
			/**
			 * 选择月份
			 */
			onMonthChange: function(e) {
				let index = e.detail.value;
				this.selectedMonthIndex = index;
				this.selectedMonth = index + 1; // 月份从1开始
				this.selectedMonthName = this.monthList[index];
				// 计算金额
				this._computeAmount();
			},
			
			/**
			 * 计算金额
			 */
			_computeAmount: function() {
				if (this.selectedRule && this.selectedMonth > 0) {
					let amount = parseFloat(this.selectedRule.monthAmount) * this.selectedMonth;
					this.receivableAmount = amount.toFixed(2);
				} else {
					this.receivableAmount = '0.00';
				}
			},
			
			/**
			 * 缴费
			 */
			onPayFee: function() {
				if (!this.selectedRule) {
					uni.showToast({
						icon: 'none',
						title: this.$t('pleaseSelectPrePayFee')
					});
					return;
				}
				
				if (this.selectedMonth <= 0) {
					uni.showToast({
						icon: 'none',
						title: this.$t('pleaseSelectMonth')
					});
					return;
				}
				
				let _receivedAmount = this.receivableAmount;
				let _objData = {
					business: "rulePayFee",
					communityId: this.communityId,
					roomId: this.roomId,
					ruleId: this.selectedRule.ruleId,
					configId: this.selectedRule.configId,
					cycles: this.selectedMonth,
					receivedAmount: _receivedAmount,
					feeName: this.selectedRule.feeName,
					monthAmount: this.selectedRule.monthAmount,
					payerObjId: this.roomId,
					payerObjType: 3333
				};
				
				uni.setStorageSync('doing_cashier', _objData);
				uni.navigateTo({
					url: '/pages/fee/cashier?money=' + _receivedAmount + "&business=rulePayFee&communityId=" + this.communityId + "&cashierUserId=" + getUserId()
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
