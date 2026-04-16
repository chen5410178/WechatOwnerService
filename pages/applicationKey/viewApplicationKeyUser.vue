<template>
	<view>
		<view class="bg-white">
			<view class="cu-steps">
				<view class="cu-item" :class="index>active?'':'text-green'" v-for="(item,index) in steps" :key="index">
					<text :class="'cuIcon-' + item.cuIcon"></text> {{item.name}}
				</view>
			</view>
		</view>
		<view class="block__title">{{ $t('ownerInfo') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('applyCode') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{applicationKeyId}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-order text-green"></text>
					<text class="text-grey">{{ $t('keyStatus') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{stateName}}</text>
				</view>
			</view>

			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-profile text-green"></text>
					<text class="text-grey">{{ $t('name') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{name}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-wefill text-green"></text>
					<text class="text-grey">{{ $t('age') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{age}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-friend text-green"></text>
					<text class="text-grey">{{ $t('gender') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{sex}}</text>
				</view>
			</view>
		</view>

		<view class="block__title">{{ $t('identityInfo') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-vipcard text-green"></text>
					<text class="text-grey">{{ $t('identity') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{typeCdName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-card text-green"></text>
					<text class="text-grey">{{ $t('idCard') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{idCard}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">{{ $t('startDate') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{startTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">{{ $t('endDate') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{endTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">{{ $t('phone') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{tel}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/viewApplicationKeyUser/viewApplicationKeyUser.js
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;

	export default {
		data() {
			return {
				steps: [],
				active: 0,
				applicationKeyId: '',
				name: '',
				age: 0,
				sex: '',
				typeCdName: '',
				idCard: '',
				startTime: null,
				endTime: null,
				tel: '',
				stateName: '',
				communityId: ''
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			this.steps = [{
				cuIcon: 'usefullfill',
				name: _that.$t('apply'),
				desc: ''
			}, {
				cuIcon: 'radioboxfill',
				name: _that.$t('reviewing'),
				desc: ''
			}, {
				cuIcon: 'roundcheckfill',
				name: _that.$t('completed'),
				desc: ''
			}];
			this.applicationKeyId = options.applicationKeyId;
			this.communityId = options.communityId;
			this.showApplicationKey();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

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
			showApplicationKey: function() {
				let _that = this;

				let _objData = {
					page: 1,
					row: 1,
					applicationKeyId: this.applicationKeyId,
					communityId: this.communityId
				};
				context.request({
					url: constant.url.listApplicationKeys,
					header: context.getHeaders(),
					method: "GET",
					data: _objData,
					//动态数据
					success: function(res) {
						console.log(res);

						if (res.statusCode == 200) {
							//成功情况下跳转
							let _applicationKeys = res.data.applicationKeys;

							if (_applicationKeys.length == 0) {
								uni.showToast({
									title: this.$t('noKeyFound'),
									icon: 'none',
									duration: 2000
								});
								return;
							}

							console.log('钥匙信息：', _applicationKeys);
							let _applicationKey = _applicationKeys[0];
							let _active = '0';
							let _sex = "女";
							let _typeCd = "";

							if (_applicationKey.state == '10001') {
								_active = '2';
							} else if (_applicationKey.state == '10003') {
								_active = '2';
							} else {
								_active = '1';
							}

							if (_applicationKey.sex == '0') {
								_sex = _that.$t('male');
							}

							if (_applicationKey.typeCd == "10004") {
								_typeCd = _that.$t('owner');
							} else if (_applicationKey.typeCd == "10005") {
								_typeCd = _that.$t('familyMember');
							} else {
								_typeCd = _that.$t('tenant');
							}

							_that.applicationKeyId = _applicationKey.applicationKeyId;
							_that.name = _applicationKey.name;
							_that.age = _applicationKey.age;
							_that.sex = _sex;
							_that.typeCdName = _typeCd;
							_that.idCard = _applicationKey.idCard;
							_that.startTime = _applicationKey.startTime;
							_that.endTime = _applicationKey.endTime;
							_that.tel = _applicationKey.tel;
							_that.active = _active;
							_that.stateName = _applicationKey.stateName;
						}
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

	text {
		text-align: center;
	}
</style>
