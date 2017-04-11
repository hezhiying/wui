const fnMenu = {
	/**
	 * 获取当前hash格式化为标准URL
	 * @returns {string}
	 */
	getCurrentHashUrl: function () {
		return this.formatHashUrl(location.hash);
	},

	/**
	 * 格式化URL并返回
	 * @returns {string}
	 */
	formatHashUrl: function (url) {
		let hashUrl = typeof url == 'undefined' ? "" : url;
		hashUrl     = hashUrl.replace(/(^#*)/g, '');
		if (hashUrl.indexOf("/") !== 0) {
			hashUrl = "/" + hashUrl;
		}
		return hashUrl;
	},

	//判断是否有子菜单
	hasChild: function (objChild) {
		return typeof objChild == 'object' && objChild.length > 0;
	},

	//格式化菜单URL
	showMenuUrl: function (url, target) {
		if (url) {
			if (target == '_blank' || target == '_self' || /^https?:\/\/.+/i.test(url)) {
				return url;
			} else if (target == 'ajax') {
				return this.formatHashUrl(url);
			} else {
				return url;
			}
		} else {
			return 'javascript:void(0);';
		}
	},

	//格式化菜单ICON内容
	showMenuIcon: function (icon) {
		if (icon && icon.substring(0, 1) != '<') {
			return '<i class="' + icon + '"></i>';
		} else if (icon) {
			return icon;
		} else {
			return '';
		}
	}
};
// 判断参数是否是其中之一
function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true;
		}
	}
	return false;
}

export {fnMenu, oneOf};