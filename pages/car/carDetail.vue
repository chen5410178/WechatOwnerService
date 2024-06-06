<template>
	<view>
		<view>
			<view class="block__title flex justify-between">
				<view>车辆信息</view>
				<view> <button class="cu-btn line-blue round" @tap="_openModifyCarNum()">修改车牌</button></view>
			</view>
			<view class="cu-form-group">
				<view class="title">车牌号</view>
				{{carNum}}
			</view>
			<view class="cu-form-group">
				<view class="title">车位</view>
				<view v-if="areaNum">{{areaNum}}-{{num}}</view>
				<view v-else>没有车位</view>
			</view>
			<view class="cu-form-group">
				<view class="title">租期</view>
				<view>
					<view>{{startTime}}</view>
					<view>~{{endTime}}</view>
				</view>
			</view>
			<view class="block__title flex justify-between">
				<view>成员车辆</view>
				<button class="cu-btn line-blue round margin-left" @tap="_openAddMemberCar()">添加成员车</button>
			</view>
			<view v-if="memberCars && memberCars.length>0">
				<view v-for="(item,index) in memberCars" :key="index"
					class="bg-white margin-bottom-xs margin-right-xs radius margin-left-xs padding">
					<view class="flex padding-bottom-xs solid-bottom justify-between">
						<view>{{item.carNum}}</view>
						<view class="text-gray">{{item.createTime}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray">品牌</view>
						<view class="text-gray">{{item.carBrand}}</view>
					</view>
					<view class="flex margin-top-xs justify-between">
						<view class="text-gray">颜色</view>
						<view class="text-gray">{{item.carColor}}</view>
					</view>
					<view class="flex margin-top justify-between">
						<view class="text-gray"></view>
						<view class="text-gray">
							<button class="cu-btn line-red round sm" @tap="_doDeleteMemberCar(item)">删除</button>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<no-data-page></no-data-page>
			</view>
		</view>
		<modify-car-num ref="modifyCarNumRef" :loadData="_loadData"></modify-car-num>
		<add-member-car ref="addMemberCarRef"></add-member-car>
	</view>
</template>

<script>
	import {
		getCommunityId
	} from '../../api/community/communityApi.js';
	import {
		hasLogin
	} from '../../api/user/sessionApi.js';
	import {
		queryAppOwnerCars,deleteMemberCar
	} from '../../api/car/carApi.js';
	import noDataPage from '../../components/no-data-page/no-data-page.vue';
	import modifyCarNum from '../../components/car/modify-car-num.vue';
	import addMemberCar from '../../components/car/add-member-car.vue';
	export default {
		data() {
			return {
				carNum: '',
				areaNum: '',
				num: '',
				startTime: '',
				endTime: '',
				carId: '',
				memberCars: [],
			}
		},
		onLoad(options) {
			if (!hasLogin()) {
				this.vc.navigateTo({
					url: '/pages/login/showlogin'
				});
				return;
			}
			this.carId = options.carId;
			this._loadCars();
			this._loadMemberCars();

		},
		components: {
			noDataPage,
			modifyCarNum,
			addMemberCar
		},
		methods: {
			_openModifyCarNum: function() {
				this.$refs.modifyCarNumRef._showModifyCarNum({
					carId: this.carId,
					carNum: this.carNum,
				})
			},
			_openAddMemberCar: function() {
				this.$refs.addMemberCarRef._showSaveMemberCarNum({
					carId: this.carId,
					carNum: this.carNum,
				})

			},
			_loadData: function() {
				this._loadCars();
				this._loadMemberCars();
			},
			/**
			 * 查询房屋信息
			 */
			_loadCars: function() {
				let _that = this;
				queryAppOwnerCars({
					page: 1,
					row: 1,
					carId: this.carId,
					carTypeCd: '1001',
					communityId: getCommunityId(),
				}).then(_data => {
					console.log(_data)
					this.carNum = _data[0].carNum;
					this.areaNum = _data[0].areaNum;
					this.num = _data[0].num;
					this.startTime = _data[0].startTime;
					this.endTime = _data[0].endTime;
					this.carId = _data[0].carId;
				})
			},
			_loadMemberCars: function() {
				let _that = this;
				queryAppOwnerCars({
					page: 1,
					row: 100,
					carId: this.carId,
					carTypeCd: '1002',
					communityId: getCommunityId(),
				}).then(_data => {
					console.log(_data)
					this.memberCars = _data;

				})
			},
			_queryRoom: function() {
				if (!this.roomName) {
					return;
				}
				let _allNum = this.roomName.split("-");
				if (_allNum.length != 3) {
					uni.showToast({
						icon: 'none',
						title: '输入房屋格式错误，如1-1-1'
					})
					return;
				}
				this.floorNum = _allNum[0];
				this.unitNum = _allNum[1];
				this.roomNum = _allNum[2];
				this._loadRoomInfo();
			},
			tabSelect: function(_active) {
				this.active = _active;
				if (this.active == 0) {
					this.$refs.oweFeeRef._loadRoomOweFee({
						roomId: this.roomInfo.roomId,
					});
					return;
				}
				if (this.active == 1) {
					this.$refs.feeDetailRef._loadFeeDetails({
						roomId: this.roomInfo.roomId,
					});
					return;
				}
			},
			_doDeleteMemberCar: function(_car) {
				
				let _that = this;
				deleteMemberCar({
					carMemberId:_car.memberId,
					carNum:_car.carNum,
					communityId:getCommunityId()
				}).then((_data)=>{
				
					if(_data.code != 0){
						uni.showToast({
							icon:'none',
							title:_data.msg
						});
						return;
						
					}
					_that._loadData();
				})
			}
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
</style>