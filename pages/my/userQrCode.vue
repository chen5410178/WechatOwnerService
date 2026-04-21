<template>
	<view>
		<view class="padding-xl margin-top">
			<canvas style="width: 520upx;height: 520upx;  margin: 0 auto;" canvas-id="userQrcode"></canvas>
		</view>
			
		<view class="padding text-center">
			{{ $t('userQrCode.qrCodeValidTime') }}
		</view>
	</view>
</template>

<script>
	const qrCode = require('@/lib/weapp-qrcode.js')
	import {generatorUserQrCode} from '../../api/user/userApi.js'
	
	export default {
		data() {
			return {
				qrCode:''
			}
		},
		onLoad(options){
			this.vc.onLoad(options);
			this._generatorQrCode();
		},
		methods: {
			_generatorQrCode:function(){
				let _that = this;
				//生成二维码
				generatorUserQrCode(this).then((res)=>{
					let data = res;
					let msg = '';
					if(data.code != 0){
						uni.showToast({
							title: data.msg,
							icon: 'none',
							duration: 2000
						});
						return ;
					}
					_that.qrCode = data.data
					new qrCode('userQrcode', {
						text: _that.qrCode?_that.qrCode:this.$t('userQrCode.generateQrCodeFailed'),
						width: 250,
						height: 250,
						colorDark: "#333333",
						colorLight: "#FFFFFF",
						correctLevel: qrCode.CorrectLevel.L
					})
				},(err)=>{
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				})
			},
			_closeModal:function(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>

</style>
