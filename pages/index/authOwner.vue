<template>
	<view>
		<view class="block__title">{{ $t('authOwner.houseInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('authOwner.community') }}</view>
			<picker bindchange="PickerChange" :value="communityIndex" :range="communitys" :range-key="'name'"
				@change="communityChange">
				<view class="picker">
					{{communitys[communityIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group arrow" v-if="communityId" @tap="chooseRoom">
			<view class="title">{{ $t('authOwner.house') }}</view>
			<input readonly v-model="roomName" class="text-right" :placeholder="$t('authOwner.selectHouse')"  icon="arrow"></input>
			<text class='cuIcon-right'></text>
		</view>
		<view class="block__title">{{ $t('authOwner.personInfo') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('authOwner.personName') }}</view>
			<input v-model="ownerName" :placeholder="$t('authOwner.inputName')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('authOwner.phoneNumber') }}</view>
			<input v-model="link" disabled="disabled" :placeholder="$t('authOwner.inputPhone')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('authOwner.personType') }}</view>
			<picker :value="typeCdIndex" :range="typeCds" range-key="name" @change="_changeTypeCd">
				<view class="picker">
					{{typeCds[typeCdIndex].name}}
				</view>
			</picker>
		</view>
		
		<view class="flex flex-direction margin-top margin-bottom">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="_doAuthOwner()">{{ $t('authOwner.submit') }}</button>
		</view>

	</view>
</template>

<script>
	import {getCommunitys} from '../../api/community/communityApi.js';
	import {getUserTel} from '../../api/user/userApi.js';
	import {authOwner} from '../../api/owner/ownerApi.js';
	export default {
		data() {
			return {
				communityIndex: 0,
				communityId:'',
				roomId:'',
				roomName:'',
				link:'',
				ownerName:'',
				communitys: [{
					communityId: '',
					name: this.$t('authOwner.selectCommunity')
				}],
				"typeCds": [
					{
						value: '1001',
						name: this.$t('authOwner.owner')
					},
					{
						value: '1002',
						name: this.$t('authOwner.familyMember')
					}
				],
				"typeCdIndex": 0,
				"ownerTypeCd": "1001",
			}
		},
		onLoad(options) {
			this._loadCommunitys();
			this.link = getUserTel();
		},
		onShow() {
			let _selectRoom = uni.getStorageSync('selectRoom');
			if(_selectRoom){
				this.roomName = _selectRoom.roomName;
				this.roomId = _selectRoom.roomId;
				uni.removeStorageSync('selectRoom');
			}
		},
		methods: {
			communityChange: function(e) {
				this.communityIndex = e.target.value //取其下标
				let selected = this.communitys[this.communityIndex] //获取选中的数组
				this.communityId = selected.communityId; //选中的id
			},
			_loadCommunitys:function(){
				let _that =this;
				getCommunitys({
					page:1,
					row:500
				}).then(_communitys=>{
					_communitys.forEach(_c=>{
						_that.communitys.push(_c);
					})
					
				})
			},
			chooseRoom:function(){
				uni.navigateTo({
					url:'/pages/family/selectRoom?communityId='+this.communityId
				})
			},
			_changeTypeCd: function(e){
				this.typeCdIndex = e.detail.value;
				this.ownerTypeCd = this.typeCds[this.typeCdIndex].value;
			},
			_doAuthOwner:function(){
				authOwner({
					communityId:this.communityId,
					roomName:this.roomName,
					roomId:this.roomId,
					link:this.link,
					ownerName:this.ownerName,
					ownerTypeCd:this.ownerTypeCd,
				}).then(_data=>{
					//todo 跳转到认证历史页面
					uni.navigateTo({
						url:'/pages/index/authOwnerLog'
					})
				})
			}
		}
	}
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