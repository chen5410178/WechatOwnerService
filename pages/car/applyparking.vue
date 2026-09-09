<template>
	<view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.carNum') || '车牌号' }}</view>
			<input v-model="carNum" :placeholder="$t('applyparking.pleaseInputCarNum')" style="text-align:right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.parkingLot') }}</view>
			<picker @change="parkingAreaChange" :value="paIdIndex" :range="parkingAreas" :range-key="'num'">
				<view class="picker">
					{{paIdIndex > -1 ? paNum : $t('applyparking.selectParkingLot')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.carType') }}</view>
			<picker bindchange="PickerChange" :value="index" :range="carTypes" @change="chooseCarTypes">
				<view class="picker">
					{{carTypeName ? carTypeName : $t('applyparking.pleaseSelect')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group align-start">
			<view class="title">{{ $t('applyparking.remarkInfo') }}</view>
			<textarea maxlength="-1" v-model="remark" :placeholder="$t('applyparking.inputRemarkInfo')"></textarea>
		</view>
		<view class="button_up_blank"></view>
		<view class="flex flex-direction">
			<button @click="submitApply()" class="cu-btn bg-blue margin-tb-sm lg">{{ $t('applyparking.submit') || '提交' }}</button>
		</view>
		
		<view class="flex flex-direction">
			<button @click="_applyDetail()" class="cu-btn line-blue margin-tb-sm lg">{{ $t('applyparking.viewProgress') }}</button>
		</view>
		
		<view class="temp-remark">
			<view>{{ $t('applyparking.parkingApplyNote') }}</view>
			<view>1、{{ $t('applyparking.parkingApplyNote1') }}</view>
			<view>2、{{ $t('applyparking.parkingApplyNote2') }}</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js'
	const constant = context.constant;
	import {listParkingAreas} from '../../api/community/communityApi.js'
	
	import {getProperty} from '../../api/property/propertyApi.js';
	import {saveOwnerCar} from '../../api/car/carApi.js';

	export default {
		data() {
			return {
				carNum:'',
				remark:'',
				startDate: this.$t('applyparking.pleaseSelectDate'),
				endDate: this.$t('applyparking.pleaseSelectDate'),
				ownerId:'',
				storeId:'',
				userId:'',
				applyPersonName:'',
				applyPersonLink:'',
				applyPersonId:'',
				parkingAreas: [],
				paIdIndex: '-1',
				paNum: '',
				paId: '',
				//车辆类型
				carTypes: [],
				carTypeCodes: ['9901', '9902', '9903'],
				carTypeCode: '',
				carTypeName: '',
				
				page: 1,
				row: 20,
			};
		},
		created() {
			this.carTypes = [
				this.$t('applyparking.carTypes0'),
				this.$t('applyparking.carTypes1'),
				this.$t('applyparking.carTypes2')
			];
		},
		onLoad: function(options) {
			let _this = this;
			context.getOwner(function(_owner) {
				console.log("_owner",_owner);
				_this.communityId = _owner.communityId;
				_this.ownerId = _owner.memberId;
				_this.userId = _owner.ownerId;
				_this.applyPersonName = _owner.ownerName;
				_this.applyPersonLink = _owner.ownerTel;
				_this.applyPersonId = _owner.memberId;
				_this.listParkingAreas();
			});
		},
		methods: {
			listParkingAreas: function() {
				let _that = this;
				listParkingAreas({
					page: 1,
					row: 100,
					communityId: this.communityId
				}).then((res) => {
					_that.parkingAreas = res;
				}).catch(() => {
					uni.showToast({
						title: _that.$t('common.serverError'),
						icon: 'none',
						duration: 2000
					})
				});
			},
			parkingAreaChange: function(e) {
				let index = e.detail.value;
				this.paIdIndex = index;
				this.paNum = this.parkingAreas[index].num;
				this.paId = this.parkingAreas[index].paId;
			},
			//车辆类型
			chooseCarTypes: function(e) {
				let index = e.target.value;
				this.carTypeCode = this.carTypeCodes[index];
				this.carTypeName = this.carTypes[index];
			},
			_applyDetail:function(){
				uni.navigateTo({
					url:'/pages/car/parkingInfo'
				})
			},
			submitApply:function(){
				let obj = {
					"carNum": this.carNum,
					"remark": this.remark,
					"carType":this.carTypeCode,
					"paId": this.paId,
					"communityId":this.communityId,
					"ownerId":this.ownerId,
					"state":"1001",
					"applyPersonName":this.applyPersonName,
					"applyPersonLink":this.applyPersonLink,
					"applyPersonId":this.applyPersonId,
					"userId":this.userId
				};
				console.log(obj);
				let msg = "";
				
				if (obj.carNum == "") {
					msg = this.$t('applyparking.fillCarNumber');
				} else if(obj.carType == ""){
					msg = this.$t('applyparking.selectCarType');
				} else if(obj.paId == ""){
					msg = this.$t('applyparking.selectParkingLot');
				}
				if(msg != ""){
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					return;
				}
				let _that = this;
				saveOwnerCar(obj).then((_json) => {
					if (_json.code == 0) {
						uni.redirectTo({
							url: '/pages/car/parkingInfo',
						});
						return;
					}
					uni.showToast({
						title: _that.$t('common.serverError'),
						icon: 'none',
						duration: 2000
					});
				}).catch(() => {
					uni.showToast({
						title: _that.$t('common.serverError'),
						icon: 'none',
						duration: 2000
					});
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

	.button_up_blank {
		height: 40rpx;
	}
	
	.temp-remark{
		margin-top: 300upx;
		padding:10upx;
		color: #888888;
	}
</style>
