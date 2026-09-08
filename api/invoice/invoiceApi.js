import {
	request,
	requestNoAuth
} from '../../lib/java110/java110Request.js';
import
url
from '../url.js';

/**
 * 手机端查询发票抬头(App 专用，后端按登录用户手机号查询)
 * @param {Object} _objData 数据（communityId/page/row）
 */
export function listAppInvoiceHeader(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppInvoiceHeader,
			method: "GET",
			data: _objData, //动态数据
			success: res => {
				let _json = res.data;
				if (_json.code == 0) {
					resolve(_json);
					return;
				}
				reject(_json.msg);
			},
			fail: e => {
				reject(e);
			}
		});
	})
}

/**
 * 手机端查询未开票缴费明细(App 专用)
 * @param {Object} _objData 数据
 */
export function listAppUnInvoiceFeeDetail(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppUnInvoiceFeeDetail,
			method: "GET",
			data: _objData, //动态数据
			success: function(res) {
				let _json = res.data;
				if (_json.code == 0) {
					resolve(_json);
					return;
				}
				reject(_json.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

/**
 * 手机端查询已开票记录(App 专用)
 * @param {Object} _objData 数据
 */
export function listAppInvoiceApply(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.queryAppInvoiceApply,
			method: "GET",
			data: _objData, //动态数据
			success: function(res) {
				let _json = res.data;
				if (_json.code == 0) {
					resolve(_json);
					return;
				}
				reject(_json.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

/**
 * 查询开票记录
 * @param {Object} _objData 数据
 */
export function getInvoiceApply(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.listInvoiceApply,
			method: "GET",
			data: _objData, //动态数据
			success: function(res) {
				let _json = res.data;
				if (_json.code == 0) {
					resolve(_json);
					return;
				}
				reject(_json.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}

export function deleteInvoiceApply(_data) {
	return new Promise((resolve, reject) => {
		request({
			url: url.deleteInvoiceApply,
			method: "POST",
			data: _data,
			//动态数据
			success: function(res) {
				resolve(res.data);
			},
			fail: function(e) {
				reject("服务器异常了");
			}
		});
	})
}

export function getInvoiceEvent(_objData) {
	return new Promise((resolve, reject) => {
		request({
			url: url.listInvoiceEvent,
			method: "GET",
			data: _objData, //动态数据
			success: function(res) {
				let _json = res.data;
				if (_json.code == 0) {
					resolve(_json);
					return;
				}
				reject(_json.msg);
			},
			fail: function(e) {
				reject(e);
			}
		});
	})
}


export function saveInvoiceApply(_data) {
	return new Promise((resolve, reject) => {
		request({
			url: url.saveInvoiceApply,
			method: "POST",
			data: _data,
			//动态数据
			success: function(res) {
				resolve(res.data);
			},
			fail: function(e) {
				reject("服务器异常了");
			}
		});
	})
}
