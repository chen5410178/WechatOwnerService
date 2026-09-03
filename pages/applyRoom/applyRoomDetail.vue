<template>
<view>
		<view class="block__title">{{ $t('applyRoomDetail.ownerInfo') }}</view>
		<!-- <view class="cu-form-group">
			<view class="title">业主ID</view>
			{{ownerInfo.memberId}}
		</view> -->
<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.name') }}</view>
			{{userName}}
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">身份证</view>
			{{ownerInfo.idCard}}
		</view> -->
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.contact') }}</view>
			{{userTel}}
		</view>
	
		<view class="block__title">{{ $t('applyRoomDetail.houseInfo') }}</view>
		<!-- <view class="cu-form-group">
			<view class="title">房屋ID</view>
			{{roomDetail.roomId}}
		</view> -->
<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.building') }}</view>
			{{roomDetail.floorNum}}{{ $t('applyRoomDetail.buildingUnit') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.unit') }}</view>
			{{roomDetail.unitNum}}{{ $t('applyRoomDetail.unitUnit') }}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.roomNo') }}</view>
			{{roomDetail.roomNum}}{{ $t('applyRoomDetail.roomRoom') }}
		</view>
	
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.layer') }}</view>
			{{roomDetail.layer}}{{ $t('applyRoomDetail.floorLayer') }}
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">房间数</view>
			{{roomDetail.section}}个
		</view> -->
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.apartment') }}</view>
			{{roomDetail.apartment}}
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.unitPrice') }}</view>
			{{roomDetail.unitPrice}}{{ $t('applyRoomDetail.yuanPerSqm') }}
		</view>
		
		<view class="block__title">{{ $t('applyRoomDetail.vacantRoomApply') }}</view>
		<view class="cu-form-group arrow">
			<view class="title">{{ $t('applyRoomDetail.discountType') }}</view>
			<picker mode="selector" :range="applyTypes" range-key="typeName"  @change="applyTypeChange">
				<view class="picker">
					{{applyTypeShow?applyTypeShow: $t('applyRoomDetail.selectFirst')}}
				</view>
			</picker>
		</view>
		<view class="block__title">{{ $t('applyRoomDetail.feeProject') }}</view>
		<view class="fee-toolbar">
			<view class="fee-tool" @click="handleSelectAll">{{ $t('applyRoomDetail.selectAll') }}</view>
			<view class="fee-tool" @click="handleClearAll">{{ $t('applyRoomDetail.clearAll') }}</view>
		</view>
		<checkbox-group class="block" @change="feeCheckChange">
			<view class="cu-list menu left-line">
				<view class="cu-item" v-for="(fee, idx) in feeTypeCds" :key="fee.feeId" :data-item="fee">
					<view class="padding-tb-sm flex justify-start">
						<view style="line-height: 1.6rem; display: flex; align-items: center;">
							<checkbox :value="fee.feeId" :checked="fee.checked"></checkbox>
						</view>
						<view class="margin-left-sm" @click="toggleFeeCheck(fee)">
							<view>
								<view class="text-cut" style="width:260px">{{fee.feeName}}</view>
							</view>
							<view class="text-gray text-sm" v-if="fee.startTime && fee.endTime">
								<text>{{fee.startTime}} ~ {{fee.endTime}}</text>
							</view>
						</view>
					</view>
					<view class="action">
						<text class="text-red text-sm" v-if="fee.oweAmount">￥{{fee.oweAmount}}</text>
					</view>
				</view>
			</view>
		</checkbox-group>
		<view v-if="feeTypeCds.length === 0" class="fee-empty">{{ $t('applyRoomDetail.noFee') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('applyRoomDetail.applyDescription') }}</view>
			<input type="text" v-model="createRemark">
		</view>
		<view class="block__title">{{ $t('applyRoomDetail.imageMaterial') }}</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="$t('applyRoomDetail.imageUpload')" @sendImagesData="sendImagesData"></uploadImageAsync>
		
		<view class="btn-box">
<button type="default" class="btn-sub" @click="subApply()">{{ $t('applyRoomDetail.submitApplication') }}</button>
		</view>
	
		<view class="button_up_blank"></view>
	
	</view>
</template>

<script>
	// pages/my/myHouseDetail.js
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';
	import context from '../../lib/java110/Java110Context.js'
	const factory = context.factory;
	import {formatDate} from '../../lib/java110/utils/DateUtil.js'
	import {queryApplyRoomDiscountType,saveApplyRoomDiscount,listRoomFee} from '../../api/applyRoom/applyRoomApi.js'
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {getUserId,getUserName,getUserTel} from '../../api/user/userApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js'
	export default {
		data() {
			return {
				ownerInfo: {},
				// 用户信息
				ownerFlag: false,
				// 是否有业主信息 标记 如果有为 true  没有为false
				roomDetail: {},
				startTime: formatDate(new Date()).replaceAll('/', '-'),
				endTime: '2050-01-01 23:59:59',
				createRemark: '',
				applyType: '',
				applyTypeShow: '',
				applyTypes: [],
				feeTypeCds: [],
				selectedFees: [],
				photos: [],
				communityId: '',
				userName:'',
				userTel:'',
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: this.$t('applyRoomDetail.imageUpload'),
					canEdit: true
				}
			};
		},

		components: {
			uploadImageAsync
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			_that.roomDetail = JSON.parse(options.room);
			_that.communityId = _that.roomDetail.communityId;
			_that.loadApplyRoomDiscountType();
			_that.loadOwenrInfo();
			_that.loadRoomFee();
			this.userName = getUserName();
			this.userTel = getUserTel();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			sendImagesData: function(e){
				this.photos = [];
				if(e.length > 0){
					e.forEach((img) => {
						this.photos.push(img.fileId);
					})
				}
			},
			loadRoomFee: function(){
				let params = {
					page: 1,
					row: 50,
					communityId: this.roomDetail.communityId,
					payerObjId: this.roomDetail.roomId,
					state: '2008001'
				};
				listRoomFee(params).then((data) => {
					let fees = data.fees || [];
					fees.forEach(f => f.checked = false);
					this.feeTypeCds = fees;
					this.selectedFees = [];
				})
			},
			
			loadApplyRoomDiscountType: function(){
				let params = {
					communityId: getCommunityId(),
					page: 1,
					row: 50
				}
				queryApplyRoomDiscountType(params).then((types) => {
					this.applyTypes = types;
				})
			},
			
			loadOwenrInfo: function() {
				let _that = this;

				context.getOwner(function(_ownerInfo) {
					console.log(_ownerInfo);

					if (_ownerInfo) {
						_that.ownerFlag = true;
						_that.ownerInfo = _ownerInfo;
					} else {
						_that.ownerFlag = false;
					}
				});
			},
			
			/**
			 * 类型修改
			 * @param {Object} e
			 */
			applyTypeChange: function(e){
				if(this.applyTypes.length > 0){
					this.applyType = this.applyTypes[e.detail.value].applyType;
					this.applyTypeShow = this.applyTypes[e.detail.value].typeName;
				}
			},
			
			/**
			 * 费用项多选
			 * @param {Object} e
			 */
			feeCheckChange: function(e){
				const checkedSet = new Set(e.detail.value);
				this.feeTypeCds.forEach(f => f.checked = checkedSet.has(f.feeId));
				this.refreshSelectedFees();
			},
			
			toggleFeeCheck: function(fee){
				fee.checked = !fee.checked;
				this.refreshSelectedFees();
				this.$forceUpdate();
			},
			
			handleSelectAll: function(){
				this.feeTypeCds.forEach(f => f.checked = true);
				this.refreshSelectedFees();
			},
			
			handleClearAll: function(){
				this.feeTypeCds.forEach(f => f.checked = false);
				this.refreshSelectedFees();
			},
			
			refreshSelectedFees: function(){
				this.selectedFees = this.feeTypeCds.filter(f => f.checked);
			},
			
			/**
			 * 提交申请
			 */
			subApply: function(){
				let msg = '';
				if(this.applyType == ''){
					msg = this.$t('applyRoomDetail.pleaseSelectDiscountType');
				}else if(this.selectedFees.length === 0){
					msg = this.$t('applyRoomDetail.pleaseSelectFeeProject');
				}else if(this.createRemark == ''){
					msg = this.$t('applyRoomDetail.pleaseFillApplyDescription');
				}
				
				if(msg != ''){
					uni.showToast({
						title: msg,
						icon: 'none'
					});
					return;
				}
				
				let params = {
					startTime: this.startTime,
					endTime: this.endTime,
					roomName: this.roomDetail.floorNum + '-' + this.roomDetail.unitNum + '-' + this.roomDetail.roomNum,
					roomId: this.roomDetail.roomId,
					communityId: getCommunityId(),
					createUserName: this.userName,
					createUserTel: this.userTel,
					createRemark: this.createRemark,
					ardId: '',
					applyType: this.applyType,
					feeIds: this.selectedFees.map(f => f.feeId),
					feeNames: this.selectedFees.map(f => f.feeName),
					photos: this.photos
				}
				saveApplyRoomDiscount(params).then(() => {
					uni.showToast({
						title: this.$t('applyRoomDetail.applySuccess')
					});
					setTimeout(() => {
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
	
	.fee-toolbar{
		display: flex;
		justify-content: flex-end;
		padding: 0 30rpx 16rpx;
	}
	.fee-tool{
		font-size: 26rpx;
		color: #1F8DEE;
		padding: 6rpx 20rpx;
		margin-left: 16rpx;
		border: 1rpx solid #1F8DEE;
		border-radius: 8rpx;
	}
	.fee-empty{
		text-align: center;
		color: rgba(69, 90, 100, .5);
		font-size: 26rpx;
		padding: 20rpx 0 10rpx;
	}
</style>
