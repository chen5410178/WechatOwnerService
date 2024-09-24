


/**

* 压缩

* @param {Object} imgSrc 图片url

* @param {Object} callback 回调设置返回值

*/

export function translate(that, imgSrc, callback) {
	// #ifndef H5
	imageToBease64(that, imgSrc, callback)
	// #endif

	// #ifdef H5
	translateH5(imgSrc, callback)
	// #endif
}

export function translateH5(imgSrc, callback) {

    let img = new Image();

    img.src = imgSrc;

    img.onload = function () {

        let that = this;

        let h = that.height;

        // 默认按比例压缩
        let w = that.width;
		
		if(h > 1080 || w > 1080){
			let _rate = 0;
			if(h > w){
				_rate = h/1080;
				h = 1080;
				w = Math.floor(w/_rate);		
			}else{
				_rate = w/1080;
				w = 1080;
				h = Math.floor(h/_rate);		
			}
		}

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        //压缩比例
        let quality = 0.3;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        canvas = null;
        callback(base64);

    }

}


/**
 * 图片转base64
 *
 * @param imageUrl 图片地址
 * @param callback 回调
 */
function imageToBease64(that, imageUrl, callback) {
	wx.getImageInfo({
		src: imageUrl,
		success(imgData) {
			const query = that.createSelectorQuery();
			query.select('#materCanvas').fields({
					node: true,
					size: true
				})
				.exec(res => {
					const canvas = res[0].node;
					const ctx = canvas.getContext('2d');
					const image = canvas.createImage();
					

					image.src = imgData.path;
					image.onload = function() {
						
						let h = imgData.height;
						// 默认按比例压缩
						let w = imgData.width;
						if(h > 1080 || w > 1080){
							let _rate = 0;
							if(h > w){
								_rate = h/1080;
								h = 1080;
								w = Math.floor(w/_rate);		
							}else{
								_rate = w/1080;
								w = 1080;
								h = Math.floor(h/_rate);		
							}
						}
						canvas.width = w;
						canvas.height = h;
						ctx.drawImage(image, 0, 0, w, h); // 绘制图片

						//压缩比例
						let quality = 0.3;
						let base64 = canvas.toDataURL('image/jpeg', quality);
						callback(base64);
					}
				});
		}
	});

}

/**

* base转Blob对象

* @param {Object} base64 base64地址

*/

export function base64ToBlob(base64) {

    var arr = base64.split(','),

        mime = arr[0].match(/:(.*?);/)[1],

        bstr = atob(arr[1]),

        n = bstr.length,

        u8arr = new Uint8Array(n);

    while (n--) {

        u8arr[n] = bstr.charCodeAt(n);

    }

    return new Blob([u8arr], {

        type: mime

    });

}