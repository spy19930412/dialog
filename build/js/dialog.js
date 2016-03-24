'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 弹窗组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
	templ: {
		pannel: function pannel(title, content, btns) {
			return this.mask('\n\t\t\t\t<div class="pannel pannel-default">\n\t\t\t\t\t<div class="pannel-heading">\n\t\t\t\t\t\t' + title + '\n\t\t\t\t\t\t<span class="close">&times;</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="pannel-body">\n\t\t\t\t\t\t' + content + '\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="pannel-footing">\n\t\t\t\t\t\t' + btns + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t');
		},
		loading: function loading() {
			return this.mask('\n\t\t\t\t\t<div class="loading">\n\t\t\t\t\t</div>\n\t\t\t');
		},
		mask: function mask(main) {
			return '\n\t\t\t\t<div class="mask">\n\t\t\t\t\t' + main + '\n\t\t\t\t</div>\n\t\t\t';
		}
	}
};
var guide = 0,
    dg;

var Dialog = function () {
	function Dialog() {
		_classCallCheck(this, Dialog);

		this.fn = {
			ready: [],
			ok: [],
			cancel: [],
			// 按钮顺序
			order: []
		};
		this.setup.apply(this, arguments);
	}

	_createClass(Dialog, [{
		key: 'alert',
		value: function alert() {
			this.title = '提示框';
			this.btns = [{ text: '确定', style: 'primary' }];
			this.create();
			this.handler();
			this.flex();
			this.position();
			this.show();
		}
	}, {
		key: 'confirm',
		value: function confirm() {
			this.title = '提示框';
			this.btns = [{ text: '确定', style: 'primary' }, { text: '取消', style: 'cancel' }];
			this.create();
			this.handler();
			this.flex();
			this.position();
			this.show();
		}
	}, {
		key: 'load',
		value: function load() {
			var that = this;
			(0, _util.http)({
				url: this.url,
				method: this.method,
				param: this.param,
				success: function success(html) {
					that.create();
					that.render(html);
					that.handler();
					that.flex();
					that.position();
					that.show();
				},
				beforeSend: function beforeSend() {
					this.loading();
				},
				complete: function complete() {
					this.closeLoading();
				},
				error: function error(statusText) {
					this.alert(statusText, 'error');
				}
			});
		}
	}, {
		key: 'loading',
		value: function loading() {
			if (guide == 0) {
				dg = this;
				document.body.appendChild((0, _util.parseHTML)(defaults.templ.loading()));
			}
			guide++;
		}
	}, {
		key: 'closeLoading',
		value: function closeLoading() {
			guide--;
			if (guide == 0) {
				dg.destory();
				dg = null;
			}
		}

		// 设置

	}, {
		key: 'setup',
		value: function setup() {
			this.type = arguments.length <= 0 ? undefined : arguments[0];
			switch (this.type) {
				case 'alert':
				case 'confirm':
					this.msg = arguments.length <= 1 ? undefined : arguments[1];
					this.icon = arguments.length <= 2 ? undefined : arguments[2];
					this[this.type]();
					break;
				case 'load':
					this.url = arguments.length <= 1 ? undefined : arguments[1];
					this.param = arguments.length <= 2 ? undefined : arguments[2];
					this[this.type]();
					break;
				case 'loading':
					this.loading();
					break;
				case 'close loading':
					this.closeLoading();
					break;
			}
		}
	}, {
		key: 'create',
		value: function create() {
			var _this = this;

			var templ = (0, _util.parseHTML)(defaults.templ.pannel(this.title,
			// content
			function () {
				if (_this.msg) {
					return '\n\t\t\t\t\t\t\t<div class="icon icon-' + _this.icon + '"></div>\n\t\t\t\t\t\t\t<div class="pannel-msg">' + _this.msg + '</div>\n\t\t\t\t\t\t';
				} else {
					return '';
				}
			}(),
			// btns
			function () {
				return _this.btns.map(function (item) {
					return '<button type="button" class="btn btn-' + item.style + '">' + item.text + '</button>';
				}).join('');
			}()));

			this.mask = templ.children[0];
			this.pannel = (0, _util.getDOM)('.pannel', this.mask)[0];
			this.heading = (0, _util.getDOM)('.pannel-heading', this.pannel)[0];
			this.body = (0, _util.getDOM)('.pannel-body', this.pannel)[0];
			this.footing = (0, _util.getDOM)('.pannel-footing', this.pannel)[0];
			this.btnClose = (0, _util.getDOM)('.close', this.heading)[0];
			document.body.appendChild(templ);
		}
	}, {
		key: 'render',
		value: function render(html) {
			this.content.appendChild((0, _util.parseHTML)(html));
		}

		// 定位

	}, {
		key: 'position',
		value: function position() {
			this.pannel.style.left = (document.documentElement.clientWidth - this.pannel.offsetWidth) / 2 + 'px';
			this.pannel.style.top = (document.documentElement.clientHeight - this.pannel.offsetHeight) / 2 + 'px';
		}
		// 弹性窗口

	}, {
		key: 'flex',
		value: function flex() {}

		// 显示

	}, {
		key: 'show',
		value: function show() {}
		// 隐藏

	}, {
		key: 'hide',
		value: function hide() {}

		// 销毁

	}, {
		key: 'destory',
		value: function destory() {
			if (this.mask) {
				document.body.removeChild(this.mask);
				this.mask = null;
			}
		}

		// 安装事件

	}, {
		key: 'on',
		value: function on(type, fn) {
			switch (type) {
				case 'ok':
				case 'cancel':
				case 'order':
					this.fn[type].push(fn);
			}
		}
		// 卸载事件

	}, {
		key: 'un',
		value: function un(type, fn) {
			switch (type) {
				case 'ok':
				case 'cancel':
				case 'order':
					if (fn) {
						for (var i = 0, f; f = this.fn[type][i]; i++) {
							if (f === fn) {
								this.fn[type].splice(i, 1);
								i--;
							}
						}
					} else {
						this.fn[type].length = 0;
					}
			}
		}

		// 触发事件

	}, {
		key: 'trigger',
		value: function trigger(fn, obj) {
			for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				args[_key - 2] = arguments[_key];
			}

			if (isFunction(fn)) {
				fn.call.apply(fn, [obj].concat(args));
			} else if (isArray(fn)) {
				fn.forEach(function (f) {
					f.call.apply(f, [obj].concat(args));
				});
			}
		}
	}, {
		key: 'handler',
		value: function handler() {

			/*for (let i = 0, btn; btn = this.btns[i]; i++) {
   	switch (btn.getAttribute('data-duty')) {
   		case 'ok':
   			addEvent(btn, 'click', this.fn.ok);
   			break;
   		case 'cancel':
   			addEvent(btn, 'click', this.fn.cancel);
   			break;
   	}
   	if (this.fn.order[i]) {
   		addEvent(btn, 'click', this.fn.order[i]);
   	}
   }*/
			var that = this;
			// 事件委托
			(0, _util.addEvent)(this.footing, 'button', 'click', function (event) {
				var index = getIndex(this);
				switch (index) {
					// 默认0是确定
					case 0:
						that.trigger(this.fn.ok, this, event);
						break;
					// 默认1是取消
					case 1:
						that.trigger(this.fn.cancel, this, event);
						break;
				}

				that.trigger(this.fn.order[index], this, event);
			});
			(0, _util.addEvent)(this.btnClose, 'click', function () {
				that.destory();
			});
		}
	}]);

	return Dialog;
}();

/*dialog('alert', '确认框', 'warn')
	.on('ok', () => {
		console.log('点了确定按钮');
	});

dialog('confirm', '选择确认框', 'inquiry')
	.on('ok', () => {
		console.log('点了确定按钮');
	})
	.on('cancel', () => {
		console.log('点了取消按钮');
	});

dialog('load', '/page', { id: '001' })
	.on('ready', () => {
		console.log('页面加载完成');
	})
	.on('ok', () => {
		console.log('点了确定按钮');
	})
	.on('order', () => {
		console.log('第一个按钮')
	})
	.on('order', () => {
		console.log('第二个按钮')
	});

// loading
dialog('loading');
// close loading
dialog('close loading');*/

var dialog = exports.dialog = function dialog() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return new (Function.prototype.bind.apply(Dialog, [null].concat(args)))();
};
//# sourceMappingURL=dialog.js.map