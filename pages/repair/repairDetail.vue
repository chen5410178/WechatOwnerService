<template>
	<view>
		<view class="block__title">{{ $t('repair.workOrderDetail') }}</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.repairType') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.repairTypeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.processingTimeStandard') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.doTime}}{{ $t('repair.hours') }}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.repairPerson') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.repairName}}({{repairInfo.tel}})</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.location') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.repairObjName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.appointmentStartTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.appointmentTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.submitTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.createTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.submitDuration') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.submitHours || 0}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.completedTime') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.finishTime || '-'}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.status') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.stateName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey">{{ $t('repair.repairContent') }}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{repairInfo.context}}</text>
				</view>
			</view>
		</view>
		<view class="cu-timeline margin-top">
			<view class="cu-time">{{ $t('repair.workOrderProgress') }}</view>
			<view class="cu-item " v-for="(item,index) in staffs" :key="key">
				<view class="bg-cyan content">
					<text>{{item.startTime}} </text> {{ $t('repair.arrivedWorkstation') }}
				</view>
				<view class="bg-cyan content" v-if="item.endTime != undefined">
					<text>{{item.endTime}} </text> {{ $t('repair.processingComplete') }}
				</view>
				<view class="bg-cyan content" v-if="item.endTime != undefined">
					<text>{{ $t('repair.processingOpinion') }}：</text>  {{item.context}}
					<block v-if="item.state == '12000' && item.payTypeName != undefined">
						({{item.payTypeName}})
					</block>
				</view>
				<!-- 待支付状态 - 详情描述 -->
				<view class="bg-cyan content" v-if="item.state == '10009'">
					<text>{{ $t('repair.processingOpinion') }}：</text> {{item.context}}
					<block v-if="item.payTypeName != undefined">({{item.payTypeName}})</block>
				</view>
				<view class="bg-cyan content" v-if="item.photoVos.length > 0 && item.state==10005">
					<view class="repair-img-item" v-for="(pic, index2) in item.photoVos" :key="key2">
						<image :src="pic.url" @tap="preview(index, index2)" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<viewImage ref="viewImageRef"></viewImage>
	</view>
</template>

<script>
	import context from '../../lib/java110/Java110Context.js';
	const constant = context.constant;
	const factory = context.factory;
	import conf from '../../conf/config.js';
	import {listRepairStaffs,queryUserRepair} from '@/api/repair/repairApi.js';
	import { getCommunityId } from '@/api/community/communityApi.js';
	
	export default {
		data() {
			return {
				viewImage: false,
				viewImageSrc: '',
				staffs:[],
				repairId:'',
				communityId:'',
				imgUrlPre: '',
				photoUrl: conf.commonBaseUrl + '/callComponent/download/getFile/file',
				repairInfo:{}
			}
		},
		components: {
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			context.onLoad(options);
			this.repairId = options.repairId;
			this.communityId = getCommunityId();
			this.imgUrlPre = conf.commonBaseUrl;
			
			//加载报修类型
			this._loadRepair();
			this._loadRepairStaffs();
		},
		methods: {
			_loadRepair: function(_active) {
				let that = this;
			
				queryUserRepair({
					"communityId": that.communityId,
					"page": 1,
					"row": 1,
					"repairId": that.repairId,
				}).then(_json => {
					that.repairInfo = _json.data[0];
			
				});
			},
			_loadRepairStaffs:function(){
				let _that =this;
				let dataObj = {
					page: 1,
					row: 50,
					communityId: getCommunityId(),
					repairId: this.repairId
				};
				
				listRepairStaffs(dataObj).then(_json=>{
					if (_json.code == 0) {
						_that.staffs = _json.data;
						_that.staffs.forEach((item) => {
							if(item.photoVos.length > 0 && item.state==10005){
								item.photoVos.forEach((img) => {
									img.url = this.photoUrl + "?fileId=" + img.url + "&communityId=-1&time=" + new Date();
								})
							}
						})
					}
				});
			},
			preview: function(recordIndex, imgIndex) {
				let urls = [];
				this.staffs[recordIndex].photoVos.forEach((item) => {
					urls.push(item.url);
				})
				uni.previewImage({
					current: imgIndex,
					urls: urls
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
	  color: rgba(69,90,100,.6);
	  padding: 60rpx 30rpx 20rpx;
	}
	
	
	.button_up_blank{
	  height: 40rpx;
	}
	.repair-img-item{
		display: inline-block;
		margin: 0 20upx;
	}
	.repair-img-item image{
		width: 200upx;
		border-radius: 15upx;
	}
</style>

