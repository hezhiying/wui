import {fnMenu} from '../../utils/fn'
import jquery from 'jquery'

export default function(opts = {}) {

	let defaultOpts = {
		el         : '#wula-app',
		homeUrl    : '',
		menuUrl    : '',
		loginUrl   : '',
		dashboard  : 'dashboard',
		lefttopbar : 'lefttopbar',
		righttopbar: 'righttopbar'
	};
	opts = Object.assign(defaultOpts,opts);
	return new Vue({
		el     : opts.el,
		data   : {
			//全局事件
			bus        : new Vue(),
			homeUrl    : opts.homeUrl,
			menuUrl    : opts.menuUrl,
			dashboard  : opts.dashboard,
			lefttopbar : opts.lefttopbar,
			righttopbar: opts.righttopbar

		},
		created: function () {
			var that = this;
			//加载菜单
			if (this.menuUrl) {
				jquery.getJSON(this.menuUrl,null,(data)=>{
					if (data.sidebar && that.$refs[that.dashboard]) {
						that.$refs[that.dashboard].setMenus(data.sidebar);
					}
					if (data.lefttopbar && that.$refs[that.lefttopbar]) {
						that.$refs[that.lefttopbar].setMenus(data.lefttopbar);
					}
					if (data.righttopbar && that.$refs[that.righttopbar]) {
						that.$refs[that.righttopbar].setMenus(data.righttopbar);
					}
				}).fail((...data)=>{console.log('fail',data)});

			}


			if (fnMenu.getCurrentHashUrl() == '/' && this.homeUrl) {
				location.href = '#' + fnMenu.formatHashUrl(this.homeUrl);
			}
		},
	});
};
