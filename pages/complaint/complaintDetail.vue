<template>
	<view>
		<view class="padding margin-top">
			<text>{{ $t('complaint.orderInfo') }}</text>
		</view>
		<view class="cu-list menu" >
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-edit text-green"></text>
					<text class="text-grey">{{ $t('complaint.complaintId') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintId}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-ticket text-green"></text>
					<text class="text-grey">{{ $t('complaint.roomCode') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.roomName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-footprint text-green"></text>
					<text class="text-grey">{{ $t('complaint.type') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.typeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-profile text-green"></text>
					<text class="text-grey">{{ $t('complaint.complaintPerson') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.complaintName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">{{ $t('complaint.complaintPhone') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.tel}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">{{ $t('complaint.complaintTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{complaint.createTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-comment text-blue margin-right-xs"></text>{{ $t('complaint.complaintContent') }}</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>{{complaint.context}}</view>
				</view>
			</view>
			
			<view class="cu-item" v-if="complaint.photos && complaint.photos.length > 0">
				<view class="margin-top grid text-center col-3 grid-square" >
					<view class="" v-for="(_item,index) in complaint.photos" :key="index">
						<image mode="scaleToFill" :data-url="_item.url" :src="_item.url" @tap="preview(index)"></image>
					</view>
				</view>
			</view>
		
		</view>
		
		<view class="cu-timeline margin-top">
			<view class="cu-time">{{ $t('complaint.workOrder') }}</view>
			<view class="cu-item " v-for="(item,index) in audits" :key="index">
				<view class="bg-cyan content"  v-if="item.eventType == '1000'">
					<text>{{item.createUserName}}</text> {{item.createTime}} {{ $t('complaint.complaintWork') }}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>{{item.createUserName}}</text> {{item.createTime}} {{ $t('complaint.processWork') }}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>{{ $t('complaint.processOpinion') }}：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>{{item.createUserName}}</text> {{item.createTime}} {{ $t('complaint.evaluate') }}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>{{ $t('complaint.evaluateContent') }}：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>{{item.createUserName}}</text> {{item.createTime}} {{ $t('complaint.reply') }}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>{{ $t('complaint.replyContent') }}：</text> {{item.remark}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	import config from '../../conf/config.js';
	import {getComplaints,getComplaintEvent} from '@/api/community/complaintApi.js';
	export default {
		data() {
			return {
				complaintId:'',
				communityId:'',
				complaint:{},
				audits:[],
				photoUrl: config.commonBaseUrl + '/callComponent/download/getFile/file',
			}
		},
		onLoad(options) {
			let _complaintId = options.complaintId;
			this.complaintId = _complaintId;
			this.communityId = options.communityId;
			this._loadCompaint();
			this._listWorkflowAuditInfo();
		},
		methods: {
			/**
			 * 加载我的报修
			 */
			_loadCompaint: function(_active) {
				let that = this;
				getComplaints({
					complaintId: that.complaintId,
					page: 1,
					row: 1,
					communityId: that.communityId
				}).then(_data=>{
					let _ownerComplaints = _data.data;
					that.complaint = _ownerComplaints[0];
				});
			},
			_listWorkflowAuditInfo: function(_active) {
				let _that =this;
				getComplaintEvent({
					complaintId: _that.complaintId,
					page: 1,
					row: 100,
					communityId: _that.communityId
				}).then(_data=>{
					_that.audits = _data.data;
				})
			},
			preview: function(index) {
				let urls = [];
				this.complaint.photos.forEach((item) => {
					urls.push(item.url);
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
		}
	}
</script>

<style>

</style>
