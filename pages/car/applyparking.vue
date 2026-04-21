<template>
	<view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.carNum') || '车牌号' }}</view>
			<input v-model="carNum" :placeholder="$t('applyparking.pleaseInputCarNum')" style="text-align:right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.brand') }}</view>
			<input v-model="carBrand" :placeholder="$t('applyparking.inputBrand')" style="text-align:right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyparking.color') }}</view>
			<input v-model="carColor" :placeholder="$t('applyparking.inputColor')" style="text-align:right"></input>
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
	import {getCurCommunity} from '../../api/community/communityApi.js'
	
	import {getProperty} from '../../api/property/propertyApi.js';

	export default {
		data() {
			return {
				carNum:'',
				carBrand:'',
				carColor:'',
				remark:'',
				psId: '',
				startDate: this.$t('applyparking.pleaseSelectDate'),
				endDate: this.$t('applyparking.pleaseSelectDate'),
				ownerId:'',
				storeId:'',
				userId:'',
				applyPersonName:'',
				applyPersonLink:'',
				applyPersonId:'',
				parkingSpaces: [],
				parkingSpaceIds: [],
				parkingSpacesName: '',
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
				_this.listParkingSpace();
			});
		},
		methods: {
			listParkingSpace: function() {
				context.request({
					url: constant.url.queryParkingSpaces,
					header: context.getHeaders(),
					method: "GET",
					data: {
						"page": this.page,
						"row": this.row,
						"communityId": this.communityId,
						"state": 'F'
					},
					success: (res) => {
						let arr = res.data.parkingSpaces;
						arr.map(item => {
							this.parkingSpaces.push(item.areaNum + " " + this.$t('applyparking.parkingSpace') + "  " + item.num + this.$t('applyparking.parkingSpaceNum'));
							this.parkingSpaceIds.push(item.psId);
						})
					},
					fail: (res) => {
						uni.showToast({
							title: this.$t('serverError'),
							icon: 'none',
							duration: 2000
						})
					}
				});
			},
			choosePickerSpace: function(e) {
				let checkInIndex = e.target.value;
				this.psId = this.parkingSpaceIds[checkInIndex];
				this.parkingSpacesName = this.parkingSpaces[checkInIndex];
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
					"carBrand": this.carBrand,
					"carColor": this.carColor,
					"remark": this.remark,
					"carType":this.carTypeCode,
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
				}
				if(msg != ""){
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					return;
				}
				context.request({
					url: constant.url.saveOwnerCar,
					header: context.getHeaders(),
					method: "POST",
					data: obj,
					success: function(res) {
						let _json = res.data;
						if (_json.code == 0) {
							uni.redirectTo({
								url: '/pages/car/parkingInfo',
							});
							return;
						}
						uni.showToast({
							title: this.$t('serverError'),
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						uni.showToast({
							title: this.$t('serverError'),
							icon: 'none',
							duration: 2000
						});
					}
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
