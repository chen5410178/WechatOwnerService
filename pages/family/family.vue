<template>
	<view>
		<view class="block__title">{{ $t('family.basicInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.name') }}</view>
			<input v-model="name" :placeholder="$t('family.pleaseInputName')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.idCard') }}</view>
			<input v-model="idCard" :placeholder="$t('family.pleaseInputIdCard')" ></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.sex') }}</view>
			<picker bindchange="PickerChange" :value="index" :range="sexArr" @change="sexChange">
				<view class="picker">
					{{sex == '0'? $t('family.male'):$t('family.female')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.personRole') }}</view>
			<picker :value="typeCdIndex" :range="typeCds" range-key="name" @change="_changeTypeCd">
				<view class="picker">
					{{typeCds[typeCdIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.address') }}</view>
			<input type="text" v-model="address" :placeholder="$t('family.optionalAddress')"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('family.phone') }}</view>
			<input v-model="link" :placeholder="$t('family.optionalPhone')"></input>
		</view>
		
		<view class="block__title">{{ $t('family.relatedImages') }}</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData"></uploadImageAsync>
			
		
		<!-- <view class="cu-form-group margin-top">
			<textarea v-model="remark" placeholder="请输入备注"></textarea>
		</view> -->

		<view class="flex flex-direction margin-top margin-bottom">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="submitOwnerMember()">{{ $t('family.submit') }}</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import context from '../../lib/java110/Java110Context.js';
	import {isIDCard,checkPhoneNumber,idCardInfoExt} from '../../lib/java110/utils/StringUtil.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {sendMsgCode} from '../../api/user/userApi.js';
	const constant = context.constant;
	const factory = context.factory;

	export default {
		data() {
			return {
				"sexArr": [],
				"sexShow": false,
				"sex": "0",
				"name": "",
				"link": "",
				"remark": "",
				"ownerId": "",
				"userId": "",
				"typeCds": [],
				"typeCdIndex": 0,
				"personRole":'3',
				"ownerTypeCd": "1002",
				"idCard": "",
				"memberId": "-1",
				"communityId": "",
				"second": 60,
				"btnDisabled":false,
				"btnValue": "",
				"msgCode":'',
				"address": "",
				photos:'',
				uploadImage: {
					maxPhotoNum: 1,
					imgTitle: '',
					canEdit: true
				}
			};
		},
		computed: {
			sexArr() {
				return [this.$t('family.male'), this.$t('family.female')];
			},
			typeCds() {
				return [
					{ value: '3', name: this.$t('family.familyMember') },
					{ value: '2', name: this.$t('family.tenant') },
					{ value: '4', name: this.$t('family.companyStaff') },
					{ value: '99', name: this.$t('family.other') }
				];
			},
			btnValue() {
				return this.$t('family.verificationCode');
			}
		},
		components: {
			uploadImageAsync
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			 context.onLoad(options);
			context.getOwner(function(_owner) {
				_that.ownerId = _owner.ownerId;
				_that.communityId = _owner.communityId;
			});
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},
		methods: {
			sendImagesData: function(e){
				this.photos = e[0].url;
			},
			submitOwnerMember: function(e) {
				let that = this;
				let obj = {
					"sex": this.sex,
					"name": this.name,
					"link": this.link,
					"remark": this.remark,
					"ownerId": this.ownerId,
					"userId": this.userId,
					"ownerTypeCd": this.ownerTypeCd,
					"age": this.age,
					"memberId": this.memberId,
					"communityId": this.communityId,
					"idCard": this.idCard,
					"personRole":this.personRole,
					"personType":'P',
					"address": this.address,
					"ownerPhotoUrl": this.photos
				}
				
				let msg = "";
				if (obj.ownerId == "") {
					msg = this.$t('family.pleaseInputOwner');
				} else if (obj.name == "") {
					msg = this.$t('family.pleaseInputName');
				} 
				if (msg != "") {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				} else {
					uni.showLoading({
						title: that.$t('family.submitting'),
					});
					context.request({
						url: constant.url.saveOwner,
						header: context.getHeaders(),
						method: "POST",
						data: obj,
						success: function(res) {
							if (res.data.code == 0) {
								uni.hideLoading();
								uni.navigateBack();
								return;
							}

							uni.hideLoading();
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
						},
						fail: function(e) {
							uni.hideLoading();
							uni.showToast({
								title: that.$t('common.serverError'),
								icon: 'none',
								duration: 2000
							})
						}
					});
				}
			},
			_changeTypeCd: function(e){
				this.typeCdIndex = e.detail.value;
				this.personRole = this.typeCds[this.typeCdIndex].value;
			},
			idCardChange: function(){
				let idCard = this.idCard;
				if(!isIDCard(idCard)){
					uni.showToast({
						title: this.$t('family.idCardError'),
						icon: 'none',
					});
					return;
				}
				this.sex = idCardInfoExt(idCard, 2);
				this.age = idCardInfoExt(idCard, 3);
			},
			sexChange: function(e) {
				this.sex = e.detail.value;
			},
			_sendMsgCode: function() {
				sendMsgCode(this.link,this);
			},
			
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
</style>
