<template>
	<view>

		<view class="block__title">{{ $t('ownerInfo') }}</view>

		<view class="cu-form-group">
			<view class="title">{{ $t('name') }}</view>
			<input  v-model="name" required label="姓名" clearable :placeholder="$t('fillName')" name="name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('age') }}</view>
			<input  v-model="age" type="number" label="年龄" :placeholder="$t('fillAge')" required clearable name="age"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('gender') }}</view>
			<picker @change="PickerChange" :value="sex" :range="sexList">
				<view class="picker">
					{{index>-1?sexList[index]:$t('selectGender')}}
				</view>
			</picker>
		</view>

		<view class="block__title">{{ $t('identity') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('identity') }}</view>
			<picker :value="typeCdName" @change="PickerIdentChange" :range="typeCdList">
				<view class="picker" @change="onChange" @cancel="onCancel" @confirm="onConfirm">
					{{indexIdent>-1?typeCdList[indexIdent]:$t('selectIdentity')}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('idCard') }}</view>
			<input v-model="idCard" required label="身份证" clearable :placeholder="$t('pleaseInputIdCard')"
			 name="idCard"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('expiry') }}</view>
			<picker :value="expiry" @change="PickerExpiryChange" :range="expiryList">
				<view class="picker">
					{{indexExpiry>-1?expiryList[indexExpiry]:$t('selectExpiry')}}
				</view>
			</picker>
		</view>

		<view class="cu-form-group">
			<view class="title">{{ $t('phone') }}</view>
			<input v-model="tel" type="number" required label="手机号" clearable :placeholder="$t('pleaseInputPhone')" name="tel"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('verifyCode') }}</view>
			<input v-model="msgCode" :placeholder="$t('pleaseInputVerifyCode')" name="input"></input>
			<button class='cu-btn bg-green shadow' type="number" :disabled="btnDisabled" @click="sendMsgCode()">{{btnValue}}</button>
		</view>

		<view class="block__title">{{ $t('idCardPhoto') }}</view>
		<view class="cu-bar bg-white ">
			<view class="action">
				{{ $t('uploadIdCardPhoto') }}
			</view>
			<view class="action">
				{{imgList.length}}/2
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-2 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" :data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap="removePhoto(index)" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage()" v-if="imgList.length<2">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view class="button_up_blank"></view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green lg" @click="saveApplicationKey()">{{ $t('submitApplication') }}</button>
		</view>
		<view class="button_up_blank"></view>
	</view>
</template>

<script>
	
	import {
		getCurOwner
	} from '../../api/owner/ownerApi.js'
	
	import {getProperty}  from '../../api/property/propertyApi.js'
	
	import {formatTime,addMonth,addYear} from '../../lib/java110/utils/DateUtil.js'
	
	import {sendMessageCode} from '../../api/common/commonApi.js'
	
	import {applyApplicationKey} from '../../api/applicationKey/applicationKeyApi.js'
	
	import base64 from '../../factory/Base64Factory.js'
	

	export default {
		data() {
			return {
				index: -1,
				indexIdent: -1,
				indexExpiry: -1,
				locations: [],
				communityId: '',
				showTypeCd: false,
				typeCdList: ['owner', 'familyMember', 'tenant'],
				typeCdName: '',
				sexList: ['male', 'female'],
				showSex: false,
				showExpiry: false,
				expiryList: [],
				photoList: [],
				name: '',
				age: null,
				sex: 'male',
				typeCd: "10004",
				idCard: '',
				startTime: null,
				endTime: null,
				tel: '',
				photos: [],
				msgCode: '',
				imgList: [],
				expiry: "",
				second: 60,
				btnValue: '',
				btnDisabled: false,
				propertyId: ''
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			this.vc.onLoad(options);
			getCurOwner()
			.then((_owner) =>{
				_that.name = _owner.appUserName;
				_that.idCard = _owner.idCard;
				_that.tel = _owner.link;
			});
			this.locations = JSON.parse(options.locations);
			this.communityId = options.communityId;
			this.typeCdList = [_that.$t('owner'), _that.$t('familyMember'), _that.$t('tenant')];
			this.typeCdName = _that.$t('owner');
			this.sexList = [_that.$t('male'), _that.$t('female')];
			this.expiryList = [_that.$t('oneMonth'), _that.$t('halfYear'), _that.$t('oneYear')];
			this.btnValue = _that.$t('sendVerifyCode');

			getProperty()
			.then(function(_property) {
				_that.propertyId = _property.storeId;
			})
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let _startTime = formatTime(new Date());
			this.startTime = _startTime;
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
				console.log('选择性别', e);
				this.showSex = false;
				this.sex = e.detail.value;
			},
			PickerIdentChange(e) {
				this.indexIdent = e.detail.value
			},
			PickerExpiryChange(e) {
				this.indexExpiry = e.detail.value
				let _endTime = null;
				if (e.detail.value == 0) {
					_endTime = formatTime(addMonth(new Date(), 1));
				} else if (e.detail.value == 1) {
					_endTime = formatTime(addMonth(new Date(), 6));
				} else {
					_endTime = formatTime(addYear(new Date(), 1));
				}

				this.showExpiry = false;
				this.expiry = e.detail.value;
				this.endTime = _endTime;
			},

			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			removePhoto: function(_index) {
				let _imgList = [];
				this.imgList.forEach(function(item, index) {
					if (index != _index) {
						_imgList.push(item);
					}
				});
				let _photos = [];
				this.photos.forEach(function(item, index) {
					if (index != _index) {
						_photos.push(item);
					}
				});
				this.photos = _photos;
				this.imgList = _imgList;
			},
			deleteImage: function(e) {
				console.log(e);
				let imageArr = this.$data.imgList;
				imageArr.splice(e, 1);
			},
			ChooseImage: function(e) {
				let that = this;
				uni.chooseImage({
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						console.log(res);
						that.$data.imgList.push(res.tempFilePaths[0]);
						let _base64Photo = '';
						base64.urlTobase64(res.tempFilePaths[0]).then(function(_res) {
							_base64Photo = _res;
							console.log('base64', _base64Photo);
							that.photos.push(_base64Photo);
						});
					}
				});
			},
			sendMsgCode: function() {
				var _that = this;

				let obj = {
					tel: this.tel
				};
				if (obj.tel == '') {
					uni.showToast({
						title: _that.$t('fillPhone'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				sendMessageCode(obj,_that);
			},
			

			/**
			 * 选择身份
			 */
			chooseTypeCd: function() {
				this.showTypeCd = true;
			},
			onConfirm: function(e) {
				console.log("onConfirm", e);
				let _typeCd = "";

				if (e.detail.index == 0) {
					_typeCd = "10004";
				} else if (e.detail.index == 1) {
					_typeCd = "10005";
				} else {
					_typeCd = "10006";
				}

				this.showTypeCd = false;
				this.typeCd = _typeCd;
				this.typeCdName = e.detail.value;
			},
			onChange: function(e) {
				console.log(e);
			},
			onCancel: function(e) {
				this.showTypeCd = false;
			},
			chooseSex: function() {
				this.showSex = true;
			},
			onSexConfirm: function(e) {
				console.log("onConfirm", e);
				this.showSex = false;
				this.sex = e.detail.value;
			},
			onSexChange: function(e) {
				console.log(e);
			},
			onSexCancel: function(e) {
				this.showSex = false;
			},
			chooseExpiry: function() {
				this.showExpiry = true;
			},
			onExpiryConfirm: function(e) {
				console.log("onConfirm", e);
				let _endTime = null;

				if (e.detail.value == 0) {
					_endTime = formatTime(addMonth(new Date(), 1));
				} else if (e.detail.value == 1) {
					_endTime = formatTime(addMonth(new Date(), 6));
				} else {
					_endTime = formatTime(addYear(new Date(), 1));
				}

				this.showExpiry = false;
				this.expiry = e.detail.value;
				this.endTime = _endTime;
			},
			onExpiryChange: function(e) {
				console.log(e);
			},
			onExpiryCancel: function(e) {
				this.showExpiry = false;
			},


			saveApplicationKey: function() {
				let _that = this;
				//保存钥匙信息
				let _objData = {
					name: this.name,
					age: this.age,
					sex: this.sex,
					typeCd: this.typeCd,
					idCard: this.idCard,
					startTime: this.startTime,
					endTime: this.endTime,
					tel: this.tel,
					photos: [],
					msgCode: this.msgCode,
					communityId: this.communityId,
					machineIds: [],
					typeFlag: '1100102',
					storeId: this.propertyId
				};
				let _photos = this.photos;
				_photos.forEach(function(_item) {
					_objData.photos.push({
						"photo": _item
					});
				});

				let msg = '';

				if (_objData.name == '') {
					msg = _that.$t('fillName');
				}

				if (_objData.age == null) {
					msg = _that.$t('fillAge');
				}

				if (_objData.sex != 0 && _objData.sex != 1) {
					msg = _that.$t('selectGenderTip');
				}

				if (_objData.typeCd == '') {
					msg = _that.$t('selectIdentityTip');
				}

				if (_objData.idCard == '') {
					msg = _that.$t('fillIdCard');
				}

				if (_objData.startTime == null) {
					msg = _that.$t('selectExpiryTip');
				}

				if (_objData.endTime == null) {
					msg = _that.$t('selectExpiryTip');
				}

				if (_objData.tel == '') {
					msg = _that.$t('fillPhone');
				}

				if (_objData.photos == null || _objData.photos.length < 2) {
					msg = _that.$t('uploadIdCardPhotos');
				}

				if (_objData.msgCode == '') {
					msg = _that.$t('fillVerifyCode');
				}

				if (this.locations == null || this.locations.length < 1) {
					msg = _that.$t('noMachineAvailable');
				}

				if (msg != '') {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					return;
				}

				this.locations.forEach(function(_item) {
					_objData.machineIds.push({
						"machineId": _item.machineId
					});
				});
				applyApplicationKey(_objData)
				.then((res)=>{
					uni.redirectTo({
						url: "/pages/applicationKey/applicationKeyProgress"
					});
					return;
				})
				.then((res)=>{
					uni.showToast({
						icon:'none',
						title:res
					});
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
	  padding: 60rpx 30rpx 20rpx;
	}
	
	.button_up_blank{
	  height: 40rpx;
	}
	
	.aku_photo_view{
	  background-color: #FFF;
	  height: 250rpx;
	  padding: 40rpx 0 40rpx 40rpx;
	}
	
	.aku_photo_view text{
	  font-size: 30rpx;
	  color: #8a8a8a
	}
</style>
