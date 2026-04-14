/**
 * 常量入口类
 * 
 * add by wuxw 2019-12-28
 */
//应用常量类
const urlConstant = require("../api/url.js").default; // 映射 常量类


const mappingConstant = require("./MappingConstant.js");

module.exports = {
  url: urlConstant,
  mapping: mappingConstant
};