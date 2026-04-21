<template>
	<view>
		<view class="face-top" v-if="hasFace == 'N'">
			<view>
				<image src="/static/images/noface.png"></image>
			</view>
			<view class="face-desc">
				<text>{{ $t('faceRecognition.notCertified') }}</text>
			</view>
		</view>
		<view class="face-top" v-else>
			<view>
				<image src="/static/images/hasface.png"></image>
			</view>
			<view class="face-desc">
				<text>{{ $t('faceRecognition.certified') }}</text>
			</view>
		</view>
		
		<view class="face-tel">
			<view v-if="property.communityQrCode"><image class="call-qrcode" :src="property.communityQrCode"></image></view>
			<view class="bg-white face-tel-text">{{ $t('faceRecognition.confirmCall') }},{{property.communityName}}{{$t('faceRecognition.propertyTel')}}<br />{{property.sCommunityTel}}</view>
		</view>
		
	</view>
</template>

<script>
	import {
		getProperty
	} from '../../api/property/propertyApi.js';
	import {
		hasOwner,
		loadLoginOwner
	} from '../../api/owner/ownerApi.js';
	import{
		getCommunityId
	} from '../../api/community/communityApi.js'
	export default {
		data() {
			return {
					property: {},
					hasFace:'N',
					faceSpecCd:'1234567'
			}
		},
		onLoad() {
			hasOwner();
			let _that = this;
			uni.getStorage({
				key: 'ownerInfo',
				success: function(res) {
					_that.property = res.data;
				}
			});
			this._loadCurrentOwner();
		},
		methods: {
			_loadCurrentOwner:function(){
				let _that = this;
				loadLoginOwner({
					communityId:getCommunityId()
				}).then(_owner=>{
					let _attrs = _owner.ownerAttrDtos;
					_attrs.forEach(item=>{
						if(item.specCd == _that.faceSpecCd){
							_that.hasFace = item.value;
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.face-top{
		padding:10upx;
		image{
			height: 380upx;
			width: 100%;
		}
		.face-desc{
			font-size: 32upx;
			text-align: center;
			color: orangered;
			line-height: 90upx;
		}
	}
	.face-tel{
		padding-left:10upx;
		padding-right:10upx;
		text-align: center;
		image{
			height: 500upx;
			width: 500upx;
			
		}
		.face-tel-text{
			margin-top:20upx;
			padding-top: 40upx;
			padding-bottom: 40upx;
			font-size: 32upx;
		}
	}
</style>
