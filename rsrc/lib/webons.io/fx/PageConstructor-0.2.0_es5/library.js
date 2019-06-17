'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
*  formatrix 0.4.2 (http://formatrix.org)
*  >> PageConstructor 0.2.0
*
*  Copyright (c) webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*/ ///***************************************************************************>
(function () {

	var $ = new Namespace(Namespace.bundle('[lib]webons.io/fx/PageConstructor') + '~?/library');
	//************************************************************************>
	$.use({
		page: Namespace.bundle('[lib]webons.io/fx/PageConstructor') + '~?/'
	});
	//************************************************************************>
	$.prv = {
		$: { instance: null,
			//------------------------------------------------------------>
			config: {

				// - - - - - - - - - - - - - - - - - - - - - - - - - - -> api
				api: {
					ui: {},
					layer: {

						// full-screen-mode (hide body scrollbar + keep scroll-position)
						fsMode: true,
						// z-index start
						zIndex: 10000,
						// root layer (window) sticky active area
						get rootStickieSpaceHeight() {
							return document.body.offsetHeight - document.getElementById('header').offsetHeight;
						}
					}
				},
				// - - - - - - - - - - - - - - - - - - - - - - - - - - ->
				element: {
					header: {
						selector: '#header',
						shrinkOn: true
					},
					select: {
						selector: 'ul.select'
					}
				}
			},
			//------------------------------------------------------------>
			tools: {
				// element-id
				eid: 1
			},
			//------------------------------------------------------------>
			api: {
				ui: {
					collapse: []
				},
				layer: {
					fsModeStatus: false,

					pos: ['root'],
					obj: {}
				}
			}
		},
		//==================================================================>
		provided: {

			// layer
			get layer() {
				return $.prv.$.api.layer.obj;
			},

			ui: {
				// collapse // TODO: nested
				collapse: function collapse($this) {
					var wrap = $this.classList.contains('.' + $.page.$.prefix + 'collapse') ? $this : $this.closest('.' + $.page.$.prefix + 'collapse'),
					    data = wrap.querySelector('.' + $.page.$.prefix + 'collapse-data'),
					    ctrl = wrap.querySelector('.' + $.page.$.prefix + 'collapse-ctrl');

					wrap.id = $.tools.eid(wrap.id);
					wrap.classList.toggle($.page.$.prefix + 'active');
					ctrl ? ctrl.classList.toggle($.page.$.prefix + 'opened') : null;

					if (wrap.classList.contains($.page.$.prefix + 'active')) {
						console.log(wrap.id + ": open");
						data.style.maxHeight = data.scrollHeight + 'px';
						// TODO: remove events if status:false

						$.prv.$.api.ui.collapse[wrap.id] = {
							evt: $.page.$.events.addCallback('window::resize', function () {
								data.style.maxHeight = data.scrollHeight + 'px';
							})
						};
					} else {
						data.style.maxHeight = 0;
						$.prv.$.api.ui.collapse[wrap.id].evt.remove();

						// TODO: scroll in views

						var scrollbar = $.tools.getScrollParent(wrap);
						scrollbar.scrollTop = scrollbar.scrollTop + parseInt(wrap.getBoundingClientRect().top) - $.tools.nodes($.prv.$.config.element.header.selector)[0].clientHeight - parseInt(window.getComputedStyle(wrap).getPropertyValue('margin-top'));

						console.log(wrap.id + ": close");
					}
				}
			}
		},
		//==================================================================>
		src: {
			api: {
				root: {
					_eventUpdate: function _eventUpdate() {
						//console.log("> root.event:update");

						$.page.$.events.dispatch('window::scroll');
						$.page.$.events.dispatch('fx.layer::update', $.api.layer.current.$.ele, $.api.layer.current);

						// give a bit time and run
						window.setTimeout(function () {
							$.page.$.events.dispatch('window::scroll');
							$.page.$.events.dispatch('fx.layer::update', $.api.layer.current.$.ele, $.api.layer.current);
						}, 600);
					},
					_eventScroll: function _eventScroll() {
						//console.log("> root.event:scroll");
						if ((window.pageYOffset || document.documentElement.scrollTop || 0) > ($.prv.$.config.element.header.shrinkOn ? $.prv.$.config.element.header.shrinkOn : $.prv.$.config.element.header.clientHeight)) {
							if ($.prv.$.config.element.header.hide) {
								document.body.classList.remove($.page.$.prefix + 'header-hide');
							}
							if ($.prv.$.config.element.header.shrinkOn) {
								document.body.classList.add($.page.$.prefix + 'header-shrink');
							}
						} else {
							if ($.prv.$.config.element.header.hide) {
								document.body.classList.add($.page.$.prefix + 'header-hide');
							}
							if ($.prv.$.config.element.header.shrinkOn) {
								document.body.classList.remove($.page.$.prefix + 'header-shrink');
							}
						}
					}
				},
				layer: {
					_eventUpdate: function _eventUpdate(layer) {
						//console.log("> layer.event:update");

						// register current layer scrollbar
						$.page.$.events.register('fx.layer::scroll', $.api.layer.current.$.scrollbar, 'scroll', $.api.layer.current);

						// stickies
						var stickies_ps = this.querySelectorAll('[data-fx-layer=' + layer.$.uid + ']');
						layer.$.stickies = [];

						for (var i = 0; i < stickies_ps.length; i++) {
							if (stickies_ps[i].offsetHeight < (layer.$.settings.stickies_space ? layer.$.settings.stickies_space : document.body.offsetHeight)) {
								layer.$.stickies.push(stickies_ps[i]);
							} else {
								stickies_ps[i].style.top = 0;
								stickies_ps[i].classList.remove($.page.$.prefix + 'sticky-space');
							}

							// sidebar container > content container
							if (stickies_ps[i].parentNode.clientWidth != stickies_ps[i].parentNode.parentNode.clientWidth && stickies_ps[i].parentNode.offsetHeight <= stickies_ps[i].parentNode.parentNode.offsetHeight) {
								stickies_ps[i].classList.add($.page.$.prefix + 'sticky-active');
								stickies_ps[i].parentNode.classList.add($.page.$.prefix + 'sticky-active');
							} else {
								stickies_ps[i].classList.remove($.page.$.prefix + 'sticky-active');
								stickies_ps[i].parentNode.classList.remove($.page.$.prefix + 'sticky-active');
							}
						}
						// dispatch current layer scrollbar
						window.setTimeout(function () {
							$.page.$.events.dispatch('fx.layer::scroll', $.api.layer.current.$.scrollbar, 'scroll', $.api.layer.current);
						}, 600);
					},
					_eventScroll: function _eventScroll(evt, layer) {
						//console.log("> layer.event:scroll");

						layer.$.scroll.cPos = layer.$.scrollbar.scrollTop || layer.$.scroll.lPos || 0;

						/* SLOT */layer.$.slots.onScroll ? layer.$.slots.onScroll.call(layer) : null;

						if (layer.$.scroll.timer !== null) {
							layer.$.ele.classList.add($.page.$.prefix + "scroll");
							if (layer.$.scroll.lPos > layer.$.scroll.cPos) {
								layer.$.ele.classList.add($.page.$.prefix + "scroll-up");
								layer.$.ele.classList.remove($.page.$.prefix + "scroll-down");
								layer.$.scroll.dir = false;
							} else if (layer.$.scroll.lPos < layer.$.scroll.cPos) {
								layer.$.ele.classList.add($.page.$.prefix + "scroll-down");
								layer.$.ele.classList.remove($.page.$.prefix + "scroll-up");
								layer.$.scroll.dir = true;
							}
							layer.$.scroll.lPos = layer.$.scroll.cPos;
							clearTimeout(layer.$.scroll.timer);
						}

						var _loop = function _loop() {

							var sticky = layer.$.stickies[i];

							if (window.getComputedStyle(layer.$.stickies[i], '').getPropertyValue('position') != 'static') {
								var sticky_func = function sticky_func() {
									var parent_rect = sticky.parentNode.getBoundingClientRect(),
									    top = void 0,
									    max = void 0;

									if (parent_rect.top > 0) {
										top = 0;sticky.classList.remove($.page.$.prefix + 'sticky-space');
									} else {
										sticky.classList.add($.page.$.prefix + 'sticky-space');
										top = layer.$.scroll.cPos - (layer.$.scroll.cPos + parent_rect.top);
										max = sticky.parentNode.offsetHeight - sticky.offsetHeight;
										// TODO:: check max
										if (top > max) {
											top = max;
										}
									}
									sticky.style.top = top + 'px';
								};
								// TODO:: max ?
								window.setTimeout(sticky_func, 300);
								window.setTimeout(sticky_func, 600);
							}
						};

						for (var i = 0; i < layer.$.stickies.length; i++) {
							_loop();
						}

						layer.$.scroll.timer = window.setTimeout(function () {
							layer.$.ele.classList.remove($.page.$.prefix + 'scroll');
						}, 150);
					},
					toggleFullscreen: function toggleFullscreen(cb, fsMode) {

						var win = $.prv.$.api.layer.obj.root.$;

						// store scroll position
						if ($.prv.$.api.layer.fsModeStatus) {
							win.scroll.lPos = window.pageYOffset;
						}
						// disable binded css-transions
						win.ele.classList.remove($.page.$.prefix + "dom-is-loaded");
						// toggle fullscreen

						win.ele.classList.toggle(fsMode ? $.page.$.prefix + "screen-" + (fsMode === true ? 'full' : fsMode) : null);

						// callback!
						cb.call(this);

						// scroll position
						if ($.prv.$.api.layer.fsModeStatus) {
							win.ele.style.top = "-" + win.scroll.lPos + "px";
						} else {
							win.ele.style.top = "auto";
							win.ele.scrollTop = win.scroll.lPos;
						}

						setTimeout($.fx.dom.ready(function () {
							win.ele.classList.add($.page.$.prefix + "dom-is-loaded");
						}), 150);
					}
				}
			}
		},
		//==================================================================>
		select_update: function select_update(ele) {
			var _this = this;

			var trigger = void 0,
			    event = void 0,
			    sync = document.querySelector(this.dataset.sync);

			if (ele) {
				event = ele;
				event.stopPropagation();
				ele = ele.target;

				while (!ele.hasAttribute("value")) {
					ele = ele.parentElement || ele.parentNode;
				}
				trigger = !this.classList.toggle('active');
			} else {
				if (sync) {
					ele = this.querySelector('li[value="' + sync.value + '"]');
				}
				if (!ele) {
					ele = this.querySelector('li[value="' + this.value + '"]');
				}
				if (!ele) {
					ele = this.querySelector('li');
				}
				trigger = true;event = null;
			}

			if (trigger) {

				if (ele.value != this.value) {
					this.querySelectorAll('.selected').forEach(function (yet) {
						yet.classList.remove('selected');
					});
				}
				ele.classList.add('selected');
				this.value = ele.value;
				sync ? sync.value = ele.value : null;

				if (event && this.dataset.onchange) {
					(function (callback, event) {
						eval(callback);
					})(this.dataset.onchange, event);
				}
			}

			var $this = this;

			window.addEventListener('click', function () {
				$this.classList.remove('active');
				_this.removeEventListener('click', _this);
			}, false);
		}
	};
	//************************************************************************>
	$.pub({
		//==================================================================>
		$: {
			get provided() {
				return $.prv.provided;
			}
		},
		//==================================================================>
		init: function init() {

			var $root = $.page.api.layer.register(document.documentElement, {
				uid: 'root',
				singleton: true,

				get stickies_space() {
					return $.prv.$.config.api.layer.rootStickieSpaceHeight;
				},

				slots: {
					init: function init() {
						this.open();
					}
				}
			});

			$.fx.dom.ready(function () {
				document.documentElement.classList.add($.page.$.prefix + 'dom-is-loaded');

				if ($.prv.$.config.element.select) {
					$.setup.select();
				}
			});

			$.page.$.events.register('fx.layer::update');
			$.page.$.events.register('fx.layer::scroll', window, 'scroll', $.prv.$.api.layer.obj.root);
			$.page.$.events.addCallback('fx.layer::update', $.prv.src.api.layer._eventUpdate);
			$.page.$.events.addCallback('fx.layer::scroll', $.prv.src.api.layer._eventScroll);

			$.prv.src.api.root._eventUpdate();
			$.page.$.events.addCallback('window::resize', $.prv.src.api.root._eventUpdate);
			$.page.$.events.addCallback('window::scroll', $.prv.src.api.root._eventScroll);
		},

		//==================================================================>
		setup: {
			// TODO: multiselect val.split(',') ?
			select: function select() {

				var slc = $.prv.$.config.element.select;

				document.querySelectorAll(slc.selector).forEach(function (match) {
					$.page.$.events.register('fx.element:' + slc.selector, match, 'click');
					$.prv.select_update.call(match, null);
				});
				$.page.$.events.addCallback('fx.element:' + slc.selector, $.prv.select_update);
			}
		},
		//==================================================================>
		tools: {
			eid: function eid(id) {
				return id ? id : $.page.$.prefix + 'id_' + $.prv.$.tools.eid++;
			},
			loadCSS: function loadCSS(uri) {

				var link = document.createElement("link");
				link.href = fx.cmd.resolve(uri);
				link.type = "text/css";
				link.rel = "stylesheet";
				link.media = "screen,print";

				document.getElementsByTagName("head")[0].appendChild(link);
			},
			isNumber: function isNumber(n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			},
			getScrollParent: function getScrollParent(node) {
				var isElement = node instanceof HTMLElement;
				var overflowY = isElement && window.getComputedStyle(node).overflowY;
				var isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

				if (!node) {
					return null;
				} else if (isScrollable && node.scrollHeight >= node.clientHeight) {
					return node;
				}

				return this.getScrollParent(node.parentNode) || document.body;
			},

			nodes: function nodes(q) {

				var nodes = [];

				switch ($.fx.isTypeOf(q, null, true)) {
					// #id / queries
					case 'String':
						{
							if (/^\#[a-zA-Z0-9]*$/.test(q)) {
								nodes[0] = document.getElementById(q.substr(1));
							} else {
								nodes = document.querySelectorAll(q);
							} // TODO: s.split(",") ?
							break;
						}
					case 'Array':
						{
							nodes = q;
							break;
						}
					// dom objects
					case 'DomObject':
						{
							if (!q.length) {
								nodes[0] = q;
							} else {
								nodes = q;
							}
							break;
						}
					case 'Window':
						{
							nodes[0] = q;
							break;
						}
				}
				return nodes;
			}
		},
		//==================================================================>
		api: {
			extend: function extend($records) {
				var $pointer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

				if ($pointer) {
					$pointer = '.' + $pointer;
				}
				$pointer = $pointer.match(/^ext\.|\.ext\./) ? $pointer : $pointer + ".ext";
				$.fx.pointer.register($.fx.pointer.current($.$.id)['called'] + $pointer, $records);
			},

			ui: {
				collapse: {},
				select: {
					add: function add(ele) {

						$.prv.select_update.call(ele, null);
						return $.page.$.events.register('fx.element:' + $.prv.$.config.element.select.selector, ele, 'click');
					}
				}
			},
			layer: {
				blueprint: function () {
					// - - - - - - - - - - - - - - - - - - - - -> [layer] constructor
					function blueprint($id) {
						var $settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

						_classCallCheck(this, blueprint);

						var ele = document.getElementById($id),
						    $this = this;

						$settings.fsMode = $settings.fsMode == undefined ? $.prv.$.config.api.layer.fsMode : $settings.fsMode;

						this.$ = {

							get uid() {
								return $id;
							},
							get ele() {
								return ele; /*document.getElementById($id);*/
							},
							get pos() {
								return $.prv.$.api.layer.pos.indexOf($id);
							},
							get pos_len() {
								return $.prv.$.api.layer.pos.length;
							},
							get settings() {

								return $settings;
							},
							get scrollbar() {
								return $settings.scrollbar ? ele.querySelector("#" + $id + " " + $settings.scrollbar) : ele;
							},
							reg: {},
							status: null,
							slots: $settings.slots ? $settings.slots : {},
							scroll: {
								// current position
								cPos: null,
								// last position
								lPos: null,
								// scroll-direction: true:down/false:up
								dir: null,
								// scroll timer
								timer: null
							},
							stickies: []
						};
						this.updateLayer = function () {
							return $.page.$.events.dispatch('fx.layer::update', $this.$.ele, $this);
						};
					}
					// - - - - - - - - - - - - - - - - - - - - -> [layer] open / focus


					_createClass(blueprint, [{
						key: 'open',
						value: function open() {
							var _this2 = this;

							var $cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
							var result = null;

							/* ! */this.$.status = true;

							// open
							if (this.$.pos < 0) {
								//console.log('open: '+this.$.uid);

								/* SLOT */this.$.slots.openBefore ? this.$.slots.openBefore.call(this) : null;

								var tmp = function tmp() {
									$.prv.$.api.layer.pos.push(_this2.$.uid);

									$.fx.isTypeOf($cb, Function) ? $cb() : null;

									_this2.$.ele.classList.add($.page.$.prefix + 'layer-visible');
									_this2.$.ele.classList.remove($.page.$.prefix + 'layer-hidden');
									_this2.$.ele.style.zIndex = $.prv.$.config.api.layer.zIndex + _this2.$.pos_len + 1;

									/* SLOT */_this2.$.slots.openAfter ? _this2.$.slots.openAfter.call(_this2) : null;
								};

								if (this.$.settings.fsMode && !$.prv.$.api.layer.fsModeStatus) {
									// all layer below may not be controlled (closed)!
									// TODO: check: fsModeStatus if fsMode is string
									$.prv.$.api.layer.fsModeStatus = this.$.pos_len + 1;
									result = $.prv.src.api.layer.toggleFullscreen(tmp, this.$.settings.fsMode);
								} else {
									result = tmp();
								}

								// focus
							} else {
								//console.log('focus: '+this.$.uid);

								/* SLOT */this.$.slots.focusBefore ? this.$.slots.focusBefore.call(this) : null;

								var i = this.$.pos;

								$.prv.$.api.layer.pos.splice(this.$.pos, 1);
								$.prv.$.api.layer.pos.push(this.$.uid);

								for (i; i < $.prv.$.api.layer.pos.length; i++) {
									$.prv.$.api.layer.obj[$.prv.$.api.layer.pos[i]].$.ele.style.zIndex = $.prv.$.config.api.layer.zIndex + i + 1;
								}

								/* SLOT */this.$.slots.focusAfter ? this.$.slots.focusAfter.call(this) : null;
							}

							// set this.active and remove last.active
							window.setTimeout(function () {

								_this2.$.ele.classList.add($.page.$.prefix + 'layer-active');
								// check if is root
								if ($.prv.$.api.layer.pos.length > 1) {
									$.prv.$.api.layer.obj[$.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length - 2]].$.ele.classList.remove($.page.$.prefix + 'layer-active');
								}
							}, this.$.settings.timeout_open || 0);

							$.page.$.events.dispatch('fx.layer::update', this.$.ele, this);

							return result;
						}
						// - - - - - - - - - - - - - - - - - - - - -> [layer] close

					}, {
						key: 'close',
						value: function close() {
							var _this3 = this;

							var $cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
							var result = null;
							//console.log('close: '+this.$.uid);

							/* SLOT */this.$.slots.closeBefore ? this.$.slots.closeBefore.call(this) : null;

							// TODO: check: let last=$.prv.$.api.layer.obj[$.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length-1]];
							var last = $.prv.$.api.layer.obj[$.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length - 2]];

							var tmp = function tmp() {

								_this3.$.pos > 0 ? $.prv.$.api.layer.pos.splice(_this3.$.pos, 1) : null;

								$.fx.isTypeOf($cb, Function) ? $cb() : null;

								//last=$.prv.$.api.layer.obj[$.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length-1]];
								_this3.$.ele.classList.remove($.page.$.prefix + 'layer-active');
								_this3.$.ele.classList.remove($.page.$.prefix + 'layer-visible');

								window.setTimeout(function () {
									/* ! */_this3.$.status = null;
									_this3.$.ele.classList.add($.page.$.prefix + 'layer-hidden');
								}, _this3.$.settings.timeout_close || 0);

								if (_this3.$.ele.id != last.$.ele.id) {
									last.$.ele.classList.add($.page.$.prefix + 'layer-active');
								}
								/* SLOT */_this3.$.slots.closeAfter ? _this3.$.slots.closeAfter.call(_this3) : null;
							};
							// fullscreen-mode
							if ($.prv.$.api.layer.fsModeStatus && this.$.pos_len > 1 && this.$.pos_len == $.prv.$.api.layer.fsModeStatus) {
								$.prv.$.api.layer.fsModeStatus = false;
								result = $.prv.src.api.layer.toggleFullscreen(tmp, this.$.settings.fsMode);
							} else {
								result = tmp();
							}

							$.page.$.events.dispatch('fx.layer::update', last.$.ele, last);

							return result;
						}
						// - - - - - - - - - - - - - - - - - - - - -> [layer] toggle

					}, {
						key: 'toggle',
						value: function toggle() {
							if (this.$.pos < 0) {
								this.open();
							} else {
								if (this.$.uid == $.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length - 1]) {
									this.close();
								} else {
									this.open();
								}
							}
						}
						// - - - - - - - - - - - - - - - - - - - - ->

					}]);

					return blueprint;
				}(),
				register: function register($nodes) {
					var $settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
					var $class = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


					$nodes = $.tools.nodes($nodes);

					$class = $class ? $class : $.api.layer.blueprint;

					var layer = [],
					    obj = void 0,
					    ini = void 0,
					    res = void 0;

					for (var i = 0; i < $nodes.length; i++) {

						if (!$nodes[i].id) {
							$nodes[i].id = $settings.uid && $nodes.length == 1 ? $settings.uid : $.tools.eid();
						}

						obj = $.prv.$.api.layer.obj[$nodes[i].id] = new $class($nodes[i].id, $settings);
						obj.$.reg.init = $settings.slots && $settings.slots.init ? $settings.slots.init.call(obj) : null;
						if ($settings.singleton || $nodes.length == 1) {
							layer = obj;
						} else {
							layer.push(obj);
						}
					}
					return layer;
				},
				getById: function getById($id) {
					return $.prv.$.api.layer.obj[$id];
				},

				get current() {
					return $.prv.$.api.layer.obj[$.prv.$.api.layer.pos[$.prv.$.api.layer.pos.length - 1]];
				},
				getScrollDir: function getScrollDir($id) {
					return $id ? this.getById($id).$.scroll.dir : this.current.$.scroll.dir;
				}
			}
			//==================================================================>
		} });
	//************************************************************************>
})();
