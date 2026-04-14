/**
 * 文件工厂类
 * 
 * add by wuxw 2019-12-28
 * 
 * 
 */
class FileFactory {
  constructor() {} // 获取书籍已下载路径


  getDownloadPath(key) {
    return uni.getStorageSync(key);
  } // 调用 uni.saveFile 将下载的文件保存在本地


  saveDownloadPath(key, filePath) {
    return new Promise((resolve, reject) => {
      uni.saveFile({
        tempFilePath: filePath,
        success: function (res) {
          // 保存成功 在Storage中标记 下次不再下载
          let savedFilePath = res.savedFilePath;
          uni.setStorageSync(key, savedFilePath);
          resolve(savedFilePath);
        },
        fail: function () {
          reject(false);
        }
      });
    });
  }

}

module.exports = FileFactory;