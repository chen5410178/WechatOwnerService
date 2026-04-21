<template>
	<view>
		<view class="block__title">{{ $t('repair.houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('repair.location') }}</view>
			<picker bindchange="PickerChange" :value="repairScopeIndex" :range="repairScopes" :range-key="'name'" @change="repairScopeChange">
				<view class="picker">
					{{repairScopes[repairScopeIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group" v-if="repairObjType == '004'">
			<view class="title">{{ $t('repair.houseInfo') }}</view>
			<picker bindchange="PickerChange" :value="index" :range="roomCloums" @change="roomChange">
				<view class="picker">
					{{roomName?roomName:$t('repair.pleaseSelect')}}
				</view>
			</picker>
		</view>

		<view class="block__title">{{ $t('repair.repairInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('repair.repairType') }}</view>
			<picker id="complaintType" bindchange="PickerChange" 
			:value="repairTypeIndex" 
			:range-key="'repairTypeName'" 
			:range="repairTypes" 
			v-if = "repairTypes.length>0"
			 @change="repairTypeChange">
				<view class="picker">
					{{repairTypes.length==0 ? $t('repair.pleaseSelect') : repairTypes[repairTypeIndex].repairTypeName}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group" v-if="priceScope !=''">
			<view class="title">{{ $t('repair.chargeStandard') }}</view>
			<input disabled="disable" v-model="priceScope" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('repair.repairPerson') }}</view>
			<input v-model="bindRepairName" :placeholder="$t('repair.pleaseInputRepairPerson')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('repair.phone') }}</view>
			<input v-model="bindTel" :placeholder="$t('repair.pleaseInputPhone')" class="text-right"></input>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">{{ $t('repair.appointmentDate') }}</view>
			<picker mode="date" :value="bindDate" :start="todayDate" end="2050-09-01" @change="dateChange">
				<view class="picker">
					{{bindDate}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">{{ $t('repair.appointmentTime') }}</view>
			<picker mode="time" :value="bindTime" :start="todayDateTime" end="22:00" @change="timeChange">
				<view class="picker">
					{{bindTime}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top">
			<textarea v-model="context" :placeholder="$t('repair.pleaseInputContent')"></textarea>
		</view>

		<view class="block__title">{{ $t('repair.relatedImages') }}</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum" :canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData"></uploadImageAsync>
		

		<view class="button_up_blank"></view>

		<view class="flex flex-direction">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="submitRepair()">{{ $t('repair.submit') }}</button>
		</view>

	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import {checkPhoneNumber,checkStrLength} from '../../lib/java110/utils/StringUtil.js'
	import context from '../../lib/java110/Java110Context.js'
	const constant = context.constant;
	const factory = context.factory;
	import {formatDate,formatHourAndMin} from '@/lib/java110/utils/DateUtil.js';
	
	import {getCommunityId,getCommunityName} from '@/api/community/communityApi.js';
	
	import {getOwnerId,getOwnerName,getOwnerTel} from '@/api/owner/ownerApi.js';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	
	import {listRepairSettings} from '../../api/repair/repairApi.js'
	import {getRooms} from '@/api/room/roomApi.js'

	export default {
		data() {
			return {
				minDate: new Date().getTime(),
				bindDate: '',
				bindTime: '',
				roomCloums: [],
				roomIdArr: [],
				roomName: "",
				roomId: '',
				roomShow: false,
				typeName: '',
				repairType: '',
				typeShow: false,
				timeShow: false,
				imgList: [],
				bindTel: '',
				context: '',
				bindRepairName: '',
				userId: '',
				userName: '',
				storeId: '',
				photos: [],
				communityId: "",
				communityName: "",
				complaintIndex: 0,
				index: 0,
				repairScopes: [{
						id: '004',
						name: this.$t('repair.privateArea')
					},
					{
						id: '001',
						name: this.$t('repair.publicArea')
					}
				],
				repairTypes: [],
				repairTypeIndex: 0,
				repairScopeIndex: 0,
				repairObjType: '004',
				repairObjId: '',
				repairObjName: '',
				priceScope: '',
				todayDate:'',
				todayDateTime:'',
				uploadImage: {
					maxPhotoNum: 4,
					imgTitle: this.$t('repair.relatedImages'),
					canEdit: true
				}
			};
		},
		computed: {
			roomNamePlaceholder() {
				return this.roomName || this.$t('repair.pleaseSelect');
			},
			bindDateDisplay() {
				return this.bindDate || this.$t('repair.pleaseSelect');
			},
			bindTimeDisplay() {
				return this.bindTime || this.$t('repair.pleaseSelect');
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
			this.communityId = getCommunityId();
			this.communityName = getCommunityName();
			this.userName = getOwnerName();
			this.bindTel = getOwnerTel();
			this.bindRepairName = this.userName;
			getRooms({
				communityId:getCommunityId()
			}).then(_data => {
				let arr = _data.rooms;
				let roomCloums = [];
				let roomIdArr = [];
				arr.map(item => {
					roomCloums.push(item.floorNum + this.$t('repair.floorUnit') + item.unitNum + this.$t('repair.unit') + item.roomNum + this.$t('repair.room'));
					roomIdArr.push(item.roomId);
				})
				that.roomCloums = roomCloums;
				that.roomIdArr = roomIdArr;
			});

			//加载报修类型
			this._loadRepairTypes();
			this.todayDate = formatDate(new Date());
			this.todayDateTime = formatHourAndMin(new Date())
		},

		methods: {
			sendImagesData: function(e){
				this.photos = [];
				if(e.length > 0){
					e.forEach((img) => {
						this.photos.push(img.fileId);
					})
				}
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`;
				} else if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},

			submitRepair: function(e) {
				let that = this;
				let obj = {
					"repairName": this.bindRepairName,
					"repairType": this.repairType,
					"appointmentTime": this.bindDate + " " + this.bindTime + ":00",
					"tel": this.bindTel,
					"roomId": this.roomId,
					"photos": this.photos,
					"context": this.context,
					"userId": this.userId,
					"userName": this.userName,
					"communityId": this.communityId,
					"bindDate": this.bindDate,
					"bindTime": this.bindTime,
					"repairObjType": this.repairObjType,
					"repairChannel": 'Z'
				}

				if (this.repairObjType == '001') {
					obj.repairObjId = this.communityId;
					obj.repairObjName = this.communityName;
				}  else {
					obj.repairObjId = this.roomId;
					obj.repairObjName = this.roomName;
				}
				// 预约时间校验
				let oppoTime = Date.parse(new Date(obj.appointmentTime.replace(/-/g, '/'))),
				now = Date.parse(new Date());
				let msg = "";
				if (obj.repairType == "") {
					msg = this.$t('repair.pleaseSelectRepairType');
				} else if (obj.repairName == "") {
					msg = this.$t('repair.pleaseInputRepairPerson');
				} else if (checkStrLength(obj.repairName) > 30) {
					msg = this.$t('repair.nameTooLong');
				} else if (obj.tel == "") {
					msg = this.$t('repair.pleaseInputPhone');
				}  else if (obj.bindDate == this.$t('repair.pleaseSelect')) {
					msg = this.$t('repair.pleaseSelectDate');
				} else if (obj.bindTime == this.$t('repair.pleaseSelect')) {
					msg = this.$t('repair.pleaseSelectTime');
				} else if (now - oppoTime > 1800 * 1000){
					msg = this.$t('repair.appointmentTimeError');
				} else if (obj.context == "") {
					msg = this.$t('repair.pleaseInputContent');
				} else if (obj.repairObjId == '') {
					msg = this.$t('repair.pleaseSelectLocation');
				}

				if (msg != "") {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				} else {
					context.request({
						url: constant.url.saveOwnerRepair, //  http://hc.demo.winqi.cn:8012/appApi/ownerRepair.saveOwnerRepair 
						header: context.getHeaders(),
						method: "POST",
						data: obj, //动态数据
						success: function(res) {
							let _json = res.data;
							if (_json.code == 0) {
								uni.navigateTo({
									url:"/pages/successPage/successPage?msg=" + that.$t('repair.submitSuccess') + "&objType=4004"
								})
								return;
							}
							uni.showToast({
								title: _json.msg,
								icon: 'none',
								duration: 2000
							})
						},
						fail: function(e) {
							uni.showToast({
								title: that.$t('repair.serverError'),
								icon: 'none',
								duration: 2000
							})
						}
					});

				}
			},
			afterRead: function(event) {
				const {
					file
				} = event.detail;

				let _that = this;

				const {
					photoList = []
				} = this;
				photoList.push(file);
				this.photoList = photoList;

				factory.base64.urlTobase64(file.path).then(function(_baseInfo) {
					_that.photos.push(_baseInfo);
				});
			},
			roomChange: function(e) {
				this.roomId = this.roomIdArr[e.detail.value];
				this.roomName = this.roomCloums[e.detail.value];
			},
			repairScopeChange: function(e) {
				this.repairScopeIndex = e.target.value //取其下标
				let selected = this.repairScopes[this.repairScopeIndex] //获取选中的数组
				this.repairObjType = selected.id //选中的id
				this._loadRepairTypes();
			},
			repairChange: function(e) {
				this.typeName = this.columns[e.detail.value];
				this.typeId = this.repairIdAttr[e.detail.value];
			},
			repairTypeChange: function(e) {
				this.repairTypeIndex = e.target.value //取其下标
				let selected = this.repairTypes[this.repairTypeIndex] //获取选中的数组
				if(selected == undefined){
					return;
				}
				this.repairType = selected.repairType //选中的id
				let _payFeeFlag = selected.payFeeFlag;

				if (_payFeeFlag == 'T') {
					this.priceScope = selected.priceScope;
				} else {
					this.priceScope = '';
				}

			},
			dateChange: function(e) {
				this.bindDate = e.detail.value;
				if(this.bindDate == formatDate(new Date()).replaceAll('/', '-')){
					this.todayDateTime = formatHourAndMin(new Date());
				}else{
					this.todayDateTime = '8:30';
				}
			},
			timeChange: function(e) {
				this.bindTime = e.detail.value;
			},
			_loadRepairTypes: function() {
				let _that = this;
				// 公共区域标识
				let publicArea = _that.repairObjType == '004' ? 'F' : 'T';
				// 默认选择第一个
				_that.repairTypeIndex = 0;
				let dataObj = {
					page: 1,
					row: 50,
					communityId: getCommunityId(),
					publicArea: publicArea
				};
				listRepairSettings(dataObj).then(_json=>{
					if (_json.code == 0 && _json.data.length > 0) {
						_that.repairTypes = _json.data;
					
						let selected = _that.repairTypes[_that.repairTypeIndex] //获取选中的数组
						_that.repairType = selected.repairType //选中的id
						let _payFeeFlag = selected.payFeeFlag;
					
						if (_payFeeFlag == 'T') {
							_that.priceScope = selected.priceScope;
						}else{
							_that.priceScope = '';
						}
					}else{
						uni.showToast({
							icon:"none",
							title: this.$t('repair.notConfigRepair')
						})
					}
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
</style>
