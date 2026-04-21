<template>
	<view>
		<view class="block__title">{{ $t('viewAdmin.opsTeam') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-home text-green"></text>
					<text class="text-grey">{{ $t('viewAdmin.communityName') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{communityName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-service text-green"></text>
					<text class="text-grey">{{ $t('viewAdmin.opsName') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{admin.storeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-info text-green"></text>
					<text class="text-grey">{{ $t('viewAdmin.opsCode') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{admin.storeId}}</text>
				</view>
				
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-location text-green"></text>
					<text class="text-grey">{{ $t('viewAdmin.companyAddress') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{admin.address}}</text>
				</view>
				
			</view>
			<view class="cu-item arrow" @click="_callPhone()">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">{{ $t('viewAdmin.contactPhone') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{admin.tel}}</text>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="callAdminModal==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ $t('viewAdmin.callPhone') }}</view>
					<view class="action" @tap="_cancleCall()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{ $t('viewAdmin.confirmCall') }}{{admin.name}}-{{admin.tel}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleCall()">{{ $t('viewAdmin.cancel') }}</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="_doCall()">{{ $t('viewAdmin.dial') }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	import {getCommunityName} from '@/api/community/communityApi.js'
	const constant = context.constant;
	export default {
		data() {
			return {
				admin:{},
				communityId:'',
				communityName:'',
				callAdminModal:false
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let _that = this;
			context.onLoad(options);
			context.getOwner(function (_ownerInfo) {
			  if (_ownerInfo) {
			    let _active = _ownerInfo.state == '10000' ? 1 : 2;
		
			      _that.communityId= _ownerInfo.communityId;
			      _that.communityName= getCommunityName();
				  _that._loadAdmin();
			  }
			});
			
		},
		methods: {
			_loadAdmin:function(){
				let _that = this;
				let _objData = {
					page: 1,
					row: 1,
					communityId: this.communityId,
					memberTypeCd: '390001200000'
				};
				context.request({
					url: constant.url.listStore,
					header: context.getHeaders(),
					method: "GET",
					data: _objData,
					//动态数据
					success: function(res) {
						console.log("请求返回信息：", res);
				
						if (res.statusCode == 200) {
							_that.admin = res.data.stores[0];
							return;
						}
						uni.showToast({
							title: "服务器异常了",
							icon: 'none',
							duration: 2000
						});
					},
					fail: function(e) {
						uni.showToast({
							title: this.$t('common.serverError'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_callPhone:function(){
				this.callAdminModal = true;
			},
			_doCall: function() {
				let _that = this;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: _that.admin.tel,
			
					// 成功回调
					success: (res) => {
						_that.callAdminModal = false;
					},
			
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
			
				});
			},
			_cancleCall: function() {
				this.callAdminModal = false;
			}
		}
	}
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

</style>