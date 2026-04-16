<template>
	<view>
		<!-- <view class="block__title">小区信息</view>
		<view class="cu-form-group">
			<view class="title">小区名称</view>
			<input :value="communityName" @input="bindInput" data-name="communityName" required readonly label="小区名称"
			 ></input>
		</view> -->
		<view class="block__title">{{ $t('reportInfoBack') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('name') }}</view>
			<input :value="name" @input="bindInput" data-name="name" required label="姓名" clearable :placeholder="$t('inputName')"
			 name="name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('idCard') }}</view>
			<input :value="idCard" @input="bindInput" data-name="idCard" required label="身份证" clearable :placeholder="$t('inputIdCard')"
			 name="idCard"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('phone') }}</view>
			<view>
			<input :value="tel" @input="bindInput" data-name="tel" required label="手机号" clearable :placeholder="$t('inputPhone')" name="tel"></input>
		</view>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('source') }}</view>
			<picker @change="bindSourceChange" :value="indexSource" :range="arraySourceType" range-key="name">
			        <view >{{arraySourceType[indexSource].name}}</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('cityName') }}</view>
			<input :value="sourceCityName" @input="bindInput" data-name="sourceCityName" required label="城市名称" clearable :placeholder="$t('inputCityName')" name="sourceCityName"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('returnDate') }}</view>
			<picker mode="date" :value="bindDate" start="2020-00-01" end="2030-09-01" @change="dateChange">
				<view class="picker">
					{{bindDate}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('returnTime') }}</view>
			<picker mode="time" :value="bindTime" start="00:00" end="23:59" @change="timeChange">
				<view class="picker">
					{{bindTime}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('remark') }}</view>
			<textarea v-model="remark" :placeholder="$t('inputRemark')"></textarea>
		</view>
		<view class="button_up_blank">
			<button class="cu-btn bg-green lg margin-top" @tap="reportBack">{{ $t('submitData') }}</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import {
		saveReportInfoBackCity,
		querySettingTitle
	} from '../../api/reportInfo/reportInfoApi.js'
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import {getCurCommunity} from '../../api/community/communityApi.js'

	export default {
		data() {
		 const currentDate = this.getDate({
					format: true
				})
			return {
				areaCode: '',
				communityName: '',
				communityId: '',
				name: '',
				idCard: '',
				tel: '',
				backTime:"",
				bindDate: currentDate,
				bindTime: '12:01',
				areaShow: false,
				arraySourceType: [{'code':"1001",'name': this.$t('domestic')},{'code':"2002",'name': this.$t('abroad')}],
				indexSource: 0,
				sourceCityName:"",
				remark:"",
				source:"",
				areaName:null
			};
		},
		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			 if(!options.communityId){
			 	getCurCommunity().then((_community)=>{
					_that.communityId = _community.communityId;
				});
			 }else{
				 this.communityId = options.communityId;
			 }
			_that.source = _that.arraySourceType[_that.indexSource].code;
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			bindSourceChange: function(e) {
				this.indexSource = e.target.value;
				this.source = this.arraySourceType[this.indexSource].code;
			},
			bindInput: function(e) {
				let _that = this;
				let dataset = e.currentTarget.dataset;
				let value = e.detail.value;
				let name = dataset.name;
				_that[name] = value; //  
			},
			reportBack: function(e) {
				let obj = {
					"areaCode": this.areaCode,
					"communityId": this.communityId,
					"communityName": this.communityName,
					"name": this.name,
					"idCard": this.idCard,
					"tel": this.tel,
					"sourceCityName": this.sourceCityName,
					"sourceCity": "-1",
					"source": this.source,
					"bindDate": this.bindDate,
					"bindTime": this.bindTime,
					"remark":this.remark,
					"backTime":this.bindDate + " " + this.bindTime + ":00",
				};
				let msg = "";
				if(obj.communityId == "") {
					msg = this.$t('pleaseScanAgain');
				} else if(obj.name == "") {
					msg = this.$t('pleaseFillName');
				} else if (obj.idCard == "" || obj.idCard.length != 18) {
					msg = this.$t('pleaseFillIdCard');
				} else if (obj.tel == "" || obj.tel.length != 11) {
					msg = this.$t('pleaseFillPhone');
				}else if (obj.sourceCityName == "") {
					msg = this.$t('pleaseFillCity');
				}else if (obj.bindDate == this.$t('selectFirst')) {
					msg = this.$t('pleaseSelectDate');
				} else if (obj.bindTime == this.$t('selectFirst')) {
					msg = this.$t('pleaseSelectTime');
				}
				if (msg != "") {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
				} else {
					uni.showLoading({
						title: this.$t('submitting')
					});
					saveReportInfoBackCity(obj)
						.then(_data => {
							uni.showToast({
								icon: 'none',
								title: this.$t('submitSuccess')
							});
							this.communityId = "";
						}, err => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						})
				}
			},
			onChange: function(e) {
				console.log(e);
			},
			onCancel: function(e) {
				this.areaShow = false;
				// this.setData({
				//   areaShow = false
				// });
			},
			dateChange: function(e) {
				this.bindDate = e.detail.value;
			},
			timeChange: function(e) {
				this.bindTime = e.detail.value;
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	};
</script>
<style>
	@import "./reportInfoBack.css";
</style>
