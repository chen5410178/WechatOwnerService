<template>
	<view class="cu-modal" :class="showModal ? 'show' : ''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content">{{ $t('callProperty') }}
					<text v-if="property.communityQrCode">{{ $t('addWechatFriend') }}</text>
				</view>
				<view class="action" @click="close">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding-xl">
				<view v-if="property.communityQrCode">
					<image class="call-qrcode" :src="property.communityQrCode"></image>
				</view>
				<view>{{ $t('confirmCall') }},{{property.communityName}}{{ $t('propertyTel') }}<br />{{property.sCommunityTel}}</view>
			</view>
			<view class="cu-bar bg-white justify-end">
				<view class="action margin-0 flex-sub solid-left" @click="close">{{ $t('cancel') }}</view>
				<view class="action margin-0 flex-sub text-green solid-left" @click="doCall">{{ $t('dial') }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommunityName,
		getCommunityTel,
		getCommunityQrCode
	} from '@/api/community/communityApi.js';
	import {
		hasLogin
	} from '@/api/user/sessionApi.js';

	export default {
		name: 'call-property',
		data() {
			return {
				showModal: false,
				property: {}
			};
		},
		methods: {
			open() {
				if (!hasLogin()) {
					this.vc.navigateTo({ url: '/pages/login/showlogin' });
					return;
				}
				this.property.sCommunityTel = getCommunityTel();
				this.property.communityName = getCommunityName();
				this.property.communityQrCode = getCommunityQrCode();
				this.showModal = true;
			},
			close() {
				this.showModal = false;
			},
			doCall() {
				let _that = this;
				uni.makePhoneCall({
					phoneNumber: this.property.sCommunityTel,
					success: () => console.log(_that.$t('callSuccess')),
					fail: () => console.log(_that.$t('callFailed'))
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.call-qrcode {
		width: 480rpx;
		height: 480rpx;
	}
</style>
