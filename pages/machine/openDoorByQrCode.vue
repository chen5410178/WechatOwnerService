<template>
	<view>
		<view class="padding-xl margin-top">
			<canvas style="width: 520upx;height: 520upx;  margin: 0 auto;" canvas-id="openDoorQrcode"></canvas>
		</view>

		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-green margin-tb-sm lg" @tap="_closeModal()">{{ $t('openDoorByQrCode.close') }}</button>
		</view>
	</view>
</template>

<script>
	const qrCode = require('@/lib/weapp-qrcode.js')
	import {
		listOwnerMachines,
		getQrCode
	} from '../../api/applicationKey/applicationKeyApi.js'
	import {
		getCurOwner
	} from '../../api/owner/ownerApi.js';
	import {getCommunityId} from '@/api/community/communityApi.js'

	export default {
		data() {
			return {
				communityName: '',
				communityId: '',
				memberId: '',
				qrCode: ''
			}
		},
		onLoad(options) {
			this.vc.onLoad(options);
			this.loadOwnerMachines();
		},
		methods: {
			loadOwnerMachines: function() {
				let _that = this;

				let _data = {
					communityId: getCommunityId(),
					page: 1,
					row: 300
				};

				listOwnerMachines(_data)
					.then((_machines) => {
						_that._generatorQrCode(_machines);
					})
			},
			_generatorQrCode: function(_machines) {
				let _that = this;
				if (_machines == null || _machines.length < 1) {
					uni.showToast({
						title: this.$t('openDoorByQrCode.noPermissionToOpenDoor'),
						icon: 'none',
						duration: 2000
					});
					return;
				}
				//生成二维码
				getQrCode({
					communityId: getCommunityId(),
					userRole: 'owner',
					machineCode: _machines[0].machineCode,
				}).then((res) => {
					let data = res.data;
					let msg = '';
					if (data.code != 0) {
						uni.showToast({
							title: data.msg,
							icon: 'none',
							duration: 2000
						});
						return;
					}
					_that.qrCode = data.data
					new qrCode('openDoorQrcode', {
						text: _that.qrCode ? _that.qrCode : this.$t('openDoorByQrCode.noDoorDeviceBound'),
						width: 250,
						height: 250,
						colorDark: "#333333",
						colorLight: "#FFFFFF",
						correctLevel: qrCode.CorrectLevel.L
					})
				}, (err) => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				})
			},
			_closeModal: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>