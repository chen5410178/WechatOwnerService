<template>
	<view>

		<view>
 <view class="padding">{{ $t('changeOwnerCommunity.communityInfo') }}</view>
			<view class="cu-list menu " v-if="communitys.length>0">
				<view class="cu-item" v-for="(item,sub) in communitys" :key="sub" @tap="_doChangeCommunity(item)">
					<view class="content padding-tb-sm">
						<view>
							<text class="lg  cuIcon-homefill text-blue margin-right-xs"></text> {{item.communityName}}
						</view>
						<view class="text-gray text-sm">
							<text class="lg text-gray cuIcon-location margin-right-xs"></text> {{item.name}}
						</view>
					</view>
				</view>
			</view>
			<block v-else>
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-notification text-grey"></text>
							<text class="text-grey">{{ $t('changeOwnerCommunity.noCommunityInfo') }}</text>
						</view>
						<view class="action">
						</view>
					</view>
				</view>
			</block>
		</view>

		<auth-owner-dialog ref="authOwnerDialogRef"></auth-owner-dialog>

	</view>
</template>

<script>
	import {
		getOwnerCommunitys
	} from '../../api/community/communityApi.js'
	import {
		getCurOwner,
		hasAuthOwner
	} from '../../api/owner/ownerApi.js'
	import mapping from '../../constant/MappingConstant.js';
	import {
		getUserTel
	} from '@/api/user/userApi.js'
	import authOwnerDialog from '@/components/owner/auth-owner-dialog.vue';

	export default {
		components: {
			authOwnerDialog
		},
		data() {
			return {
				communityName: '',
				communitys: []
			}
		},
		onLoad() {
			let _that = this;
			hasAuthOwner(_that).then(_owner => {
				_that._loadCommunitys();
			})

		},
		methods: {
			_loadCommunitys: function() {
				let _that = this;
				getOwnerCommunitys({
						link: getUserTel()
					})
					.then(_communitys => {
						_that.communitys = _communitys;
					});
			},
			_doChangeCommunity: function(_community) {
				uni.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, _community);
				uni.setStorageSync("ownerInfo", {
					memberId: _community.memberId,
					ownerName: _community.name,
					ownerId: _community.ownerId,
					ownerTel: _community.link,
					communityId: _community.communityId,
					ownerTypeCd:_community.ownerTypeCd,
					link: _community.link
				})
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>