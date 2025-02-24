<template>
	<view>
		<view class="home_swiper margin-top-sm" v-if="goodsList && goodsList.length>0">
			<view class="home_swiper-c">
				<view class="line"></view>
				<text class="text">小区推荐</text>
				<view class="line"></view>
			</view>
			<view class="goods-list margin-top-xs">
				<view class="list" v-for="(item,index) in goodsList" @click="_advertJump(item)" :key="index">
					<view class="pictrue">
						<image :src="item.logo" mode="heightFix"></image>
					</view>
					<view class="title-tag">
						<view class="tag">
							{{item.prodName}}
						</view>
						<view class="user-price">
							<text class="min">￥</text>
							<text class="max">{{item.price}}</text>
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommunityRecommend
	} from '@/api/index/indexApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js'
	export default {
		name: "communityRecommend",
		data() {
			return {
				goodsList: [],
			};
		},
		props: {
			objType: {
				type: String,
				default: '3003',
			},
		},
		created() {
			this._loadCommunityRecommends();
		},
		methods: {
			_loadCommunityRecommends: function() {
				let _that = this;

				//查询 广告
				getCommunityRecommend({
						communityId: getCommunityId(),
						page: 1,
						row: 100
					})
					.then(function(_json) {
						_that.goodsList = _json.data;
					});
			},
			_advertJump: function(_recommend) {
				if(_recommend.url == 'NULL'){
					uni.showToast({
						icon:'none',
						title:'暂无推荐，请到商城系统配置小区推荐',
						duration:5000
					});
					return;
				}
				this.vc.navigateToMall({
					url: _recommend.url
				})
			},
		}
	}
</script>

<style lang="scss">
	.home_swiper-c {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		margin:30upx auto;

		.line {
			flex: 1;
			height: 1px;
			background-color: #ccc;
			margin: 0 10px;
		}

		.text {
			font-weight: bold;
			color: #666;
		}
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 30rpx;

		.list {
			width: 48%;
			//height: 540rpx;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			overflow: hidden;

			.pictrue {
				display: flex;
				justify-content: center;
				width: 100%;

				image {
					height: 350rpx;
				}
			}

			.title-tag {
				display: flex;
				justify-content: space-between;
				padding: 20rpx;

				.tag {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					white-space: normal;
					font-size: 26rpx;
					line-height: 40rpx;

					text {
						font-size: 24rpx;
						color: #FFFFFF;
						padding: 4rpx 16rpx;
						//background: linear-gradient(to right,$base,$change-clor);
						border-radius: 6rpx;
						margin-right: 10rpx;
					}
				}

				.user-price {

					text {
						color: #FF0000;
					}
				}
			}

			.price-info {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: right;
				padding: 0 20rpx;
				height: 80rpx;



				.vip-price {
					display: flex;
					align-items: center;

					image {
						width: 26rpx;
						height: 26rpx;
						margin-right: 10rpx;
					}

					text {
						color: #fcb735;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>