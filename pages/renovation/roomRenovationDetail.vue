<template>
	<view>
		<view class="block__title">{{ $t('ownerInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('name') }}</view>
			{{userName}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('contact') }}</view>
			{{userTel}}
		</view>
	
		<view class="block__title">{{ $t('houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('building') }}</view>
			{{roomDetail.floorNum}}{{ $t('floor') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('unit') }}</view>
			{{roomDetail.unitNum}}{{ $t('unit') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('roomNo') }}</view>
			{{roomDetail.roomNum}}{{ $t('room') }}
		</view>
	
		<view class="cu-form-group">
			<view class="title">{{ $t('floor') }}</view>
			{{roomDetail.layer}}{{ $t('layer') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('apartment') }}</view>
			{{roomDetail.apartment}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('builtUpArea') }}</view>
			{{roomDetail.builtUpArea}}{{ $t('sqm') }}
		</view>
		<view class="block__title">{{ $t('renovationApply') }}</view>
		<view class="cu-form-group arrow">
			<view class="title">{{ $t('startDate') }}</view>
			<picker mode="date" :value="startTime" start="2020-09-01" end="2050-09-01" @change="dateStartChange">
				<view class="picker">
					{{startTime}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">{{ $t('endDate') }}</view>
			<picker mode="date" :value="endTime" start="2020-09-01" end="2050-09-01" @change="dateEndChange">
				<view class="picker">
					{{endTime}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('renovationCompany') }}</view>
			<input type="text" v-model="renovationCompany" :placeholder="$t('inputCompany')">
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('renovationPerson') }}</view>
			<input type="text" v-model="personMain" :placeholder="$t('inputPerson')">
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('personTel') }}</view>
			<input type="text" v-model="personMainTel" :placeholder="$t('inputTel')">
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('renovationDetail') }}</view>
			<input type="text" v-model="remark" :placeholder="$t('inputDetail')">
		</view>
		<view class="btn-box">
			<button type="default" class="btn-sub" @click="subApply()">{{ $t('submitApply') }}</button>
		</view>
	
		<view class="button_up_blank"></view>
	
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	// const constant = context.constant;
	// const factory = context.factory;
	import {compareDate} from '../../lib/java110/utils/DateUtil.js'
	import {checkPhoneNumber} from '../../lib/java110/utils/StringUtil.js'
	import {saveRoomRenovation} from '../../api/roomRenovation/roomRenovationApi.js';
	import {getUserId,getUserName,getUserTel} from '../../api/user/userApi.js';
	import {getCommunityId} from '../../api/community/communityApi.js'
	export default {
		data() {
			return {
				ownerInfo: {},
				ownerFlag: false,
				roomDetail: {},
				startTime: '',
				endTime: '',
				remark: '',
				isPostpone: 'N',
				renovationCompany: '',
				personMain: '',
				personMainTel: '',
				// admin: {},
				property: {},
				userName:'',
				userTel:''
			};
		},


		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			_that.roomDetail = JSON.parse(options.room);
			_that.loadOwenrInfo();
			this.userName = getUserName();
			this.userTel = getUserTel()
		},


		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			loadOwenrInfo: function() {
				let _that = this;
				
				context.getOwner(function(_ownerInfo) {
					if (_ownerInfo) {
						_that.ownerFlag = true;
						//_that.ownerInfo = _ownerInfo;
						_that._loadProperty();
					} else {
						_that.ownerFlag = false;
					}
				});
			},
			_loadProperty: function() {
				let _that = this;
				context.getProperty()
					.then(function(_property) {
						_that.property = _property;
					});
			},
			
			// 修改开始时间
			dateStartChange: function(e) {
				this.startTime = e.detail.value;
			},
			
			// 修改结束时间
			dateEndChange: function(e) {
				this.endTime = e.detail.value;
			},
			
			// 提交申请
			subApply: function(){
				let msg = '';
				if(this.startTime == this.$t('selectFirst') || this.endTime == this.$t('selectFirst')){
					msg = this.$t('pleaseSelectTime');
				}else if(!compareDate(this.endTime, this.startTime)){
					msg = this.$t('timeRangeError');
				}else if(this.renovationCompany == ''){
					msg = this.$t('pleaseFillCompany');
				}else if(this.personMain == ''){
					msg = this.$t('pleaseFillPerson');
				}else if(this.personMainTel == '' || !checkPhoneNumber(this.personMainTel)){
					msg = this.$t('telError');
				}else if(this.remark == ''){
					msg = this.$t('pleaseFillDetail');
				}
				
				if(msg != ''){
					uni.showToast({
						title: msg,
						icon: 'none'
					})
					return;
				}
				
				let params = {
					startTime: this.startTime,
					endTime: this.endTime,
					roomName: this.roomDetail.floorNum + '-' + this.roomDetail.unitNum + '-' + this.roomDetail.roomNum,
					roomId: this.roomDetail.roomId,
					communityId: getCommunityId(),
					personName: this.userName,
					personTel: this.userTel,
					remark: this.remark,
					rId: '',
					userId: '',
					isPostpone: this.isPostpone,
					renovationCompany: this.renovationCompany,
					personMain: this.personMain,
					personMainTel: this.personMainTel,
					storeId: this.property.storeId,
				}
				saveRoomRenovation(params).then(function(_res){
					uni.showToast({
						title: this.$t('applySuccess')
					});
					setTimeout(function(){
						uni.navigateBack({})
					}, 1000);
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
		padding: 40rpx 30rpx 20rpx;
	}
	
	.button_up_blank {
		height: 40rpx;
	}
	
	.block__bottom {
		height: 180rpx;
	}
	
	.btn-box{
		padding: 30rpx 0;
	}
	.btn-sub{
		width: 80%;
		margin: 0 auto;
		background-color: #1F8DEE!important;
		color: #fff!important;
	}
</style>
