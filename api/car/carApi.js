/**
 * 车辆信息处理 api 接口类
 * 
 * add by 吴学文 QQ 928255095
 */


import {
	request,requestNoAuth
} from '../../lib/java110/java110Request.js'
import
url
from '../url.js'

import
mapping
from '../../constant/MappingConstant.js'

/**
 * 查询业主车辆
 */
export function getCars(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppOwnerCars,
			method: "GET",
			data:_objData,
			success: function(res) {
				if (res.statusCode == 200) {
					let _cars = res.data.data;
					if (!_cars || _cars.length == 0) {
						resolve([]);
						return;
					}
					resolve(_cars);
				} else {
					reject("查询车辆失败");
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};

export function queryAppOwnerCars(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppOwnerCars,
			method: "GET",
			data:_objData,
			success: function(res) {
				if (res.statusCode == 200) {
					//将业主信息和房屋信息一起返回
					let _cars = res.data.data;
					resolve(_cars);
				} else {
					reject("查询车辆失败");
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};
export function queryAppCarMonthCard(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppCarMonthCard,
			method: "GET",
			data:_objData,
			success: function(res) {
				if (res.statusCode == 200) {
					//将业主信息和房屋信息一起返回
					let _cars = res.data.data;
					if (_cars.length == 0) {
						reject("业主没有车辆信息");
						return;
					}
					resolve(_cars);
				} else {
					reject("查询车辆失败");
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};




export function queryWaitPayFeeTempCar(_objData) {
	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.queryWaitPayFeeTempCar,
			method: "GET",
			data:_objData,
			success: function(res) {
				if (res.statusCode == 200) {
					//将业主信息和房屋信息一起返回
					resolve(res.data);
				} else {
					reject("查询车辆失败");
				}
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};


export function editSelfCarNum(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.appEditSelfCarNum,
			method: "POST",
			data:_objData,
			success: function(res) {
				//将业主信息和房屋信息一起返回
				resolve(res.data);
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};


export function saveMemberCar(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.appSaveMemberCar,
			method: "POST",
			data:_objData,
			success: function(res) {
				//将业主信息和房屋信息一起返回
				resolve(res.data);
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};
export function deleteMemberCar(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.appDeleteMemberCar,
			method: "POST",
			data:_objData,
			success: function(res) {
				//将业主信息和房屋信息一起返回
				resolve(res.data);
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};

/**
 * 保存业主车辆
 */
export function customCarInOut(_objData) {
	return new Promise((resolve, reject) => {
		requestNoAuth({
			url: url.customCarInOut,
			method: "POST",
			data:_objData,
			success: function(res) {
				//将业主信息和房屋信息一起返回
				resolve(res);
			},
			fail: function(res) {
				reject(res);
			}
		});
	});
};

