<template>
	<view>
		<view class="block__title">{{ $t('complaint.houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('complaint.houseInfo') }}</view>
			<picker  :value="index" :range="roomCloums" @change="_changeRoom">
				<view class="picker">
					{{roomName || $t('complaint.pleaseSelect')}}
				</view>
			</picker>
		</view>
		<view class="block__title">{{ $t('complaint.title') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('complaint.complaintType') }}</view>
			<picker :value="complaintIndex" :range="typeCds" :range-key="'typeName'" @change="_changeComplaint">
				<view class="picker">
					{{typeName || $t('complaint.pleaseSelect')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('complaint.complainant') }}</view>
			<input id="complaintName" v-model="complaintName"  :placeholder="$t('complaint.pleaseInputComplainant')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('complaint.phone') }}</view>
			<input id="tel" v-model="tel"  :placeholder="$t('complaint.pleaseInputPhone')"></input>
		</view>
		<view class="cu-form-group margin-top">
			<textarea id="context" v-model="context" :placeholder="$t('complaint.pleaseInputContent')"></textarea>
		</view>

		<view class="block__title">{{ $t('complaint.photoInfo') }}</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData"></uploadImageAsync>
		
		<view class="button_up_blank"></view>
		<view class="flex flex-direction">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_submitComplaint()">{{ $t('complaint.submit') }}</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import * as TanslateImage from '../../lib/java110/utils/translate-image.js';
	
	import {checkPhoneNumber} from '../../lib/java110/utils/StringUtil.js';
	import context from '../../lib/java110/Java110Context.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {complaint,getComplaintType} from '@/api/community/complaintApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js';
	import { getRooms } from '@/api/room/roomApi.js';
	const constant = context.constant;
	const factory = context.factory;

	export default {
		data() {
			return {
				imgList: [],
				imageIndex: 0,
				index: null,
				complaintIndex: 0,
				roomCloums: [],
				roomIdArr: [],
				roomName: "",
				roomId: '',
				roomShow: false,
				typeCds: [],
				typeName: '',
				typeCd: '',
				typeShow: false,
				photoList: [],
				tel: '',
				context: '',
				complaintName: '',
				userId: '',
				storeId: '',
				photos: [],
				communityId: "",
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: '',
					canEdit: true
				}
			};
		},
		computed: {
			roomNameDisplay() {
				return this.roomName || this.$t('complaint.pleaseSelect');
			},
			typeNameDisplay() {
				return this.typeName || this.$t('complaint.pleaseSelect');
			}
		},
		components: {
			uploadImageAsync
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			getRooms({
				communityId:getCommunityId()
			}).then(_data=>{
				let arr = _data.rooms;
				let roomCloums = [];
				let roomIdArr = [];
				arr.map(item => {
					roomCloums.push(item.floorNum + "-" + item.unitNum + "-" + item.roomNum);
					roomIdArr.push(item.roomId);
				});
				that.roomCloums = roomCloums;
				that.roomIdArr = roomIdArr;
			});
			this._loadComplaintType();
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
			_changeComplaint:function(e){
				this.typeName = this.typeCds[e.detail.value].typeName;
				this.typeCd = this.typeCds[e.detail.value].typeCd;
			},
			_changeRoom: function(e) {
				this.roomName = this.roomCloums[e.detail.value];
				this.roomId = this.roomIdArr[e.detail.value];
			},
			_submitComplaint: function(e) {
				let that = this;
				complaint({
					"typeCd": this.typeCd,
					"complaintName": this.complaintName,
					"tel": this.tel,
					"roomId": this.roomId,
					"photos": this.photos,
					"context": this.context,
					"userId": this.userId,
					"communityId": getCommunityId()
				}).then(_data =>{
					uni.navigateTo({
						url:"/pages/successPage/successPage?msg=" + that.$t('complaint.submitSuccess') + "&objType=4004"
					})
				},err=>{
					uni.showToast({
						icon:'none',
						title:err
					})
				});
			},
			_loadComplaintType:function(){
				let _that = this;
				getComplaintType({
					page:1,
					row:100,
					communityId:getCommunityId()
				}).then(_data=>{
					_that.typeCds = _data.data;
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
	  color: rgba(69,90,100,.6);
	  padding: 40rpx 30rpx 20rpx;
	}
	
	.button_up_blank{
	  height: 40rpx;
	}
	
	.uploader-container{
	  margin: 0 10px;
	}
	
	.aku_photo_view{
	  background-color: #FFF;
	  padding: 40rpx 0 40rpx 40rpx;
	}
	
	.aku_photo_view text{
	  font-size: 30rpx;
	  color: #8a8a8a
	}
</style>
