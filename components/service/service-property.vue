<template>
	<view>
		<view class="real_list">
			<view class="title">物业服务</view>
			<view class="list">
				<view class="item" v-for="(item,index) in real_list" :key="index" @tap="to(item)">
					<image :src="item.src"></image>
					<view class="text">{{item.name}}</view>
				</view>
			</view>
		</view>
		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>

	</view>
</template>

<script>
	import {
		hasAuthOwner
	} from '@/api/owner/ownerApi.js';
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue'

	export default {
		name: "serviceProperty",
		data() {
			return {
				real_list: [],
			};
		},
		created() {
			this._loadMenu();
		},
		components: {
			authOwnerDialog
		},
		methods: {
			to: function(v) {
				if (!v.href) {
					uni.showToast({
						icon: 'none',
						title: '此功能暂不开放'
					});
					return;
				}
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
			_loadMenu: function() {
				this.real_list = [
					// 费用管理模块
					{
						name: '房屋费',
						src: this.imgUrl + '/h5/images/serve/1.png',
						href: '/pages/fee/roomFeeListNew',
						ownerAuth:true
					},
					{
						name: '车位费',
						src: this.imgUrl + '/h5/images/serve/my6.png',
						href: '/pages/fee/payParkingFeeList',
						ownerAuth:true
					},
					{
						name: '合同费',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/fee/contractFeeList',
						ownerAuth:true
					},
					{
						name: '发票',
						src: this.imgUrl + '/h5/images/serve/my5.png',
						href: '/pages/invoice/invoice',
						ownerAuth:true
					},
					// 居住通行模块
					{
						name: '家庭成员',
						src: this.imgUrl + '/h5/images/serve/2.png',
						href: '/pages/family/familyList',
						ownerAuth:true
					},
					{
						name: '访客通行',
						src: this.imgUrl + '/h5/images/serve/3.png',
						href: '/pages/visit/visitList',
						ownerAuth:true
					},
					{
						name: '空置房',
						src: this.imgUrl + '/h5/images/serve/my9.png',
						href: '/pages/applyRoom/myRoomList',
						ownerAuth:true
					},
					{
						name: '装修备案',
						src: this.imgUrl + '/h5/images/serve/10.png',
						href: '/pages/renovation/roomRenovation',
						ownerAuth:true
					},
					// 其他服务
					{
						name: '投诉咨询',
						src: this.imgUrl + '/h5/images/serve/4.png',
						href: '/pages/complaint/complaint',
						ownerAuth:true
					},
					{
						name: '报事维修',
						src: this.imgUrl + '/h5/images/serve/6.png',
						href: '/pages/repair/repair',
						ownerAuth:true
					},
					{
						name: '社区公告',
						src: this.imgUrl + '/h5/images/serve/7.png',
						href: '/pages/notice/index',
						ownerAuth:false
					},
					{
						name: '车位申请',
						src: this.imgUrl + '/h5/images/serve/my6.png',
						href: '/pages/car/applyparking',
						ownerAuth:true
					},
					{
						name: '投票问卷',
						src: this.imgUrl + '/h5/images/serve/my2.png',
						href: '/pages/questionAnswer/questionAnswer',
						ownerAuth:true
					},
					{
						name: '物品放行',
						src: this.imgUrl + '/h5/images/serve/order4.png',
						href: '/pages/itemRelease/itemRelease',
						ownerAuth:true
					},
					{
						name: '车辆月卡',
						src: this.imgUrl + '/h5/images/serve/my3.png',
						href: '/pages/fee/buyeCarMonthCard',
						ownerAuth:false
					},
					{
						name: '小区公示',
						src: this.imgUrl + '/h5/images/serve/my1.png',
						href: '/pages/common/communityPublicity',
						ownerAuth:false
					},
					{
						name: '充电桩',
						src: this.imgUrl + '/h5/images/serve/my1.png',
						href: '/pages/machine/chargeMachines',
						ownerAuth:false
					},
					{
						name: '监控',
						src: this.imgUrl + '/h5/images/camera.png',
						href: '/pages/machine/monitorCamera',
						ownerAuth:false
					}
				];
			}
		}
	}
</script>

<style lang="less">
	.real_list,
	.live_list {
		background: #fff;
		padding: 0 40upx;
		margin-top: 20upx;

		.title {
			line-height: 32upx;
			background: #fff;
			font-size: 30upx;
			font-weight: 600;
			color: #333;
			padding: 40upx 0;
			margin-top: 10px;
		}

		.item {
			width: 25%;
			display: inline-block;
			text-align: center;
			margin-bottom: 40upx;
		}

		image {
			height: 44upx;
			width: 44upx;
			margin-bottom: 10upx;
		}

		.text {
			color: #333;
			font-size: 28upx;
		}
	}
</style>