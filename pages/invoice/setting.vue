<template>
	<view>
		<view class="block__title">{{ $t('setting.invoiceSetting') }}</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.invoiceType') }}</view>
			<picker bindchange="PickerChange" :value="invoiceTypeIndex" :range="invoiceTypes" :range-key="'name'"
				@change="invoiceTypeChange">
				<view class="picker">
					{{invoiceTypeIndex == -1?$t('setting.selectFirst'):invoiceTypes[invoiceTypeIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.invoiceTitle') }}</view>
			<input v-model="invoiceName" :placeholder="$t('setting.inputInvoiceTitle')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.taxNo') }}</view>
			<input v-model="invoiceNum" :placeholder="$t('setting.inputTaxNo')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.address') }}</view>
			<input v-model="invoiceAddress" :placeholder="$t('setting.inputAddress')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.phone') }}</view>
			<input v-model="invoiceLink" :placeholder="$t('setting.inputPhone')" class="text-right"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">{{ $t('setting.bankAccount') }}</view>
			<input v-model="invoiceAccount" :placeholder="$t('setting.inputBankAccount')" class="text-right"></input>
		</view>
		

		<view class="flex flex-direction padding">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="_updateOwnerInvoice()" v-if="oiId">{{ $t('setting.submit') }}</button>
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="_saveOwnerInvoice()" v-else>{{ $t('setting.submit') }}</button>
		</view>
	</view>
</template>

<script>
	import {
		getOwnerId,
		getOwnerName
	} from '@/api/owner/ownerApi.js';
	import {
		getOwnerInvoice,
		saveOwnerInvoice,
		updateOwnerInvoice
	} from '@/api/invoice/invoiceApi.js';
	import {
		getCommunityId
	} from '@/api/community/communityApi.js'
	export default {
		data() {
			return {
				invoiceTypeIndex: -1,
				invoiceTypes: [{
					name: this.$t('setting.personal'),
					value: '1001'
				}, {
					name: this.$t('setting.enterprise'),
					value: '2002'
				}],
				invoiceType: '',
				invoiceName: '',
				invoiceNum: '',
				invoiceAddress: '',
				ownerId: '',
				oiId:'',
				invoiceLink:'',
				invoiceAccount:''
			}
		},
		onLoad(options) {

			let _ownerId = getOwnerId();
			if (!_ownerId) {
				uni.showToast({
					icon: 'none',
					title: this.$t('setting.ownerNotExist'),
				})
				return;
			}
			this.ownerId = _ownerId;

			//todo 查询发票抬头
			this._getOwnerInvoice();

		},
		methods: {
			invoiceTypeChange: function(e) {
				this.invoiceTypeIndex = e.target.value //取其下标
				let selected = this.invoiceTypes[this.invoiceTypeIndex] //获取选中的数组
				this.invoiceType = selected.value; //选中的id
			},
			_getOwnerInvoice: function() {
				let _that = this;
				getOwnerInvoice({
					page: 1,
					row: 1,
					communityId: getCommunityId(),
					ownerId: this.ownerId,
				}).then(_data => {
					if (!_data || _data.length < 1) {
						return;
					}
					_that.invoiceType = _data[0].invoiceType;
					_that.invoiceName = _data[0].invoiceName;
					_that.invoiceNum = _data[0].invoiceNum;
					_that.invoiceAddress = _data[0].invoiceAddress;
					_that.oiId = _data[0].oiId;
					if(_that.invoiceType == '1001'){
						_that.invoiceTypeIndex = 0;
					}else{
						_that.invoiceTypeIndex = 1;
					}
				})
			},
			_saveOwnerInvoice: function() {
				saveOwnerInvoice({
					invoiceType:this.invoiceType,
					invoiceName:this.invoiceName,
					invoiceNum:this.invoiceNum,
					invoiceAddress:this.invoiceAddress,
					invoiceLink:this.invoiceLink,
					invoiceAccount:this.invoiceAccount,
					ownerId:this.ownerId,
					ownerName:getOwnerName(),
					communityId: getCommunityId(),
				}).then(_data =>{
					uni.showToast({
						icon:'none',
						title:_data.msg
					});
					if(_data.code == 0){
						uni.navigateBack();
					}
				})
			},
			_updateOwnerInvoice: function() {
				updateOwnerInvoice({
					invoiceType:this.invoiceType,
					invoiceName:this.invoiceName,
					invoiceNum:this.invoiceNum,
					invoiceAddress:this.invoiceAddress,
					invoiceLink:this.invoiceLink,
					invoiceAccount:this.invoiceAccount,
					ownerId:this.ownerId,
					oiId:this.oiId,
					communityId: getCommunityId(),
				}).then(_data =>{
					uni.showToast({
						icon:'none',
						title:_data.msg
					});
					if(_data.code == 0){
						uni.navigateBack();
					}
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