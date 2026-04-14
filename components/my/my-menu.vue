<template>
	<view>
		<view class="asset-card">
			<view class="asset-item" @click="toAssetPage('house')">
				<view class="asset-num">{{houseCount}}</view>
				<view class="asset-name">房屋</view>
			</view>
			<view class="asset-divider"></view>
			<view class="asset-item" @click="toAssetPage('car')">
				<view class="asset-num">{{carCount}}</view>
				<view class="asset-name">车辆</view>
			</view>
			<view class="asset-divider"></view>
			<view class="asset-item" @click="toAssetPage('coupon')">
				<view class="asset-num">{{couponCount}}</view>
				<view class="asset-name">优惠券</view>
			</view>
		</view>

		<view class="serve_box">
			<view class="serve_title">我的服务</view>
			<view class="serve_list">
				<view class="list">
					<view class="item" v-for="(item,index) in serve_list" :key="index" @tap="to_serve(item)">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order_box">
			<view class="order_title">我的订单</view>
			<view class="order_list">
				<view class="list">
					<view class="item" v-for="(item,index) in order_list" :key="index" @tap="toMallOrders()">
						<image :src="item.src"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="logout-box">
			<view class="logout-btn" @click="logout">退出登录</view>
		</view>

		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>
	</view>
</template>

<script>
	import context from '@/lib/java110/Java110Context.js';
	const factory = context.factory;
	const constant = context.constant;
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js';
	import {
		getRooms
	} from '@/api/owner/ownerApi.js';
	import {
		getCars
	} from '@/api/car/carApi.js';
	import {
		getCouponUsers
	} from '@/api/fee/feeApi.js';
	import {
		getMemberId,
		getOwnerTel
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'
	export default {
		name: "myMenu",
		data() {
			return {
				houseCount: '0',
				carCount: '0',
				couponCount: '0',
				order_list: [{
						name: '待付款',
						src: this.imgUrl + '/h5/images/serve/order1.png',
						href: ''
					},
					{
						name: '待发货',
						src: this.imgUrl + '/h5/images/serve/order2.png',
						href: ''
					},
					{
						name: '待收货',
						src: this.imgUrl + '/h5/images/serve/order3.png',
						href: ''
					},
					{
						name: '已完成',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: ''
					}
				],
				serve_list: [
					{
						name: '缴费记录',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/fee/payFeeDetail',
						ownerAuth: true
					},
					{
						name: '报修记录',
						src: this.imgUrl + '/h5/images/serve/12.png',
						href: '/pages/repair/myRepair',
						ownerAuth: true
					},
					{
						name: '投诉记录',
						src: this.imgUrl + '/h5/images/serve/11.png',
						href: '/pages/complaint/complaintList',
						ownerAuth: true
					},
					{
						name: '订单记录',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '',
						ownerAuth: false
					},
					{
						name: '门禁日志',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/machine/machineTranslateLog',
						ownerAuth: true
					},
					{
						name: '空置房',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/applyRoom/myApplyRoomList',
						ownerAuth: true
					},
					{
						name: '装修记录',
						src: this.imgUrl + '/h5/images/serve/10.png',
						href: '/pages/renovation/myRoomRenovationList',
						ownerAuth: true
					},
					{
						name: '预约记录',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/reserve/reserveMyOrder',
						ownerAuth: false
					},
					{
						name: '放行记录',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/itemRelease/myItemReleaseList',
						ownerAuth: true
					},
					{
						name: '开票历史',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/invoice/invoiceApply',
						ownerAuth: true
					},
				]
			};
		},
		created() {
			this._loadAssetCounts();
		},
		components: {
			authOwnerDialog
		},
		methods: {
			_loadAssetCounts: function() {
				let _that = this;
				let _communityId = getCommunityId();
				let _memberId = getMemberId();
				let _ownerTel = getOwnerTel();
				
				// 查询房屋数量
				getRooms({
					memberId: _memberId,
					communityId: _communityId
				}).then(_rooms => {
					_that.houseCount = _rooms.rooms ? _rooms.rooms.length : '0';
				}).catch(() => {
					_that.houseCount = '0';
				});
				
				// 查询车辆数量
				getCars({
					memberId: _memberId,
					communityId: _communityId
				}).then(_cars => {
					_that.carCount = _cars.length || '0';
				}).catch(() => {
					_that.carCount = '0';
				});
				
				// 查询优惠券数量
				if (_ownerTel) {
					getCouponUsers({
						page: 1,
						row: 100,
						tel: _ownerTel,
						communityId: _communityId,
						state: '1001'
					}, null).then(_result => {
						let _count = 0;
						_result.data.forEach(item => {
							if (item.isExpire == 'Y') {
								_count += parseInt(item.stock);
							}
						});
						_that.couponCount = _count || '0';
					}).catch(() => {
						_that.couponCount = '0';
					});
				}
			},
			toAssetPage: function(type) {
				switch(type) {
					case 'house':
						this.vc.navigateTo({ url: '/pages/my/myHouse' });
						break;
					case 'car':
						this.vc.navigateTo({ url: '/pages/car/ownerCars' });
						break;
					case 'coupon':
						this.vc.navigateTo({ url: '/pages/coupon/myCoupons' });
						break;
				}
			},
			to_serve(v) {
				if (!v.ownerAuth) {
					this.vc.navigateTo({
						url: v.href
					});
					return;
				}
				hasAuthOwner(this).then(_owner => {
					this.vc.navigateTo({
						url: v.href
					});
				})
			},
			ckeckUserInfo: function() {
				return context.checkLoginStatus();
			},
			toMallOrders() {
				if (!this.ckeckUserInfo()) {
					this.vc.navigateTo({
						url: '../login/showlogin'
					}, () => {
						this.refreshPageLoginInfo();
					});
					return;
				}
				this.vc.navigateToMall({
					url: '/pages/myOrder/myOrderAll'
				})
			},
			logout: function() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.asset-card {
		background: #fff;
		border-radius: 12px;
		margin: 20upx;
		padding: 30upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		box-shadow: 0 4px 15px rgba(255, 107, 107, 0.15);

		.asset-item {
			text-align: center;
			flex: 1;
		}

		.asset-num {
			font-size: 36upx;
			font-weight: 600;
			color: #E60012;
		}

		.asset-name {
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}

		.asset-divider {
			width: 2upx;
			height: 40upx;
			background: #eee;
		}
	}

	.order_box {
		margin-top: 20upx;

		.order_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.order_list {
			padding: 20upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 20upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}

	.serve_box {
		margin-top: 20upx;

		.serve_title {
			line-height: 42upx;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 20upx;
		}

		.serve_list {
			padding: 40upx 20upx 0;
			background: #fff;
		}

		.item {
			width: 20%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}

	.logout-box {
		margin: 40upx 20upx;
		text-align: center;
	}

	.logout-btn {
		display: inline-block;
		padding: 20upx 0;
		color: #E60012;
		font-size: 30upx;
	}
</style>