'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
*  formatrix 0.4.3 (http://formatrix.org)
*  >> PageConstructor 0.2.0
*
*  Copyright (c) 2016-2019 Germo Moeller / webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*/ ///***************************************************************************>
(function () {

	var $ = new Namespace(Namespace.vbind('lib://webons.io/fx/PageConstructor/') + 'events');
	//************************************************************************>
	$.prv = {
		$: {
			// last register-id assigned
			lid: 0,

			// register
			reg: {}
		},
		//==================================================================>

		events: function () {
			function events($rid, $eid) {
				_classCallCheck(this, events);

				var $lid = 0;

				this.$ = {
					// register id
					get rid() {
						return $rid;
					},
					// event id
					get eid() {
						return $eid;
					},

					// last callback-id assigned
					get lid() {
						$lid = $lid + 1;return $lid;
					}
				};
				this.name = name;
				this.callbacks = {};
			}

			_createClass(events, [{
				key: 'setCallback',
				value: function setCallback(callback, position) {

					var $this = this,
					    cid = this.$.lid;

					if (position == null) {
						this.callbacks[cid] = callback;
					} else {/*
             // TODO: reposition
             	let order=[];
             for(let i=0;i<this.callbacks.length;i++){
             // exponentiate the counter with 10 if position small
             if((position >= (i*10)) && (position <= (i+1)*10)){
             // push new callback
             order["x"+cid]=callback; position=null;
             this.pos=this.callbacks.length;
             }
             // push existing callbacks
             order["x"+cid]=callback;
             order.push(this.callbacks[i]);
             }
             // push new callback (if position to high)
             if(position){order.push(callback);}
             // set new order
             this.callbacks=order;
             */}
					return {
						remove: function remove() {
							delete $this.callbacks[cid];
						}
					};
				}
			}]);

			return events;
		}()
	};
	//************************************************************************>
	$.pub({
		generator: function () {
			function generator() {
				var $settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				_classCallCheck(this, generator);

				if ($.prv.$.reg[0] && $.prv.$.reg[0].settings.singleton) {
					return false;
				} else {
					var $id = $.prv.$.lid;
					$.prv.$.lid++;

					$.prv.$.reg[$id] = {

						events: {},
						settings: $settings
					};

					this.$ = {
						get id() {
							return $id;
						},
						get settings() {
							return $settings;
						}
					};
				}
			}
			//------------------------------------------------------------>


			_createClass(generator, [{
				key: 'register',
				value: function register(eid) {
					var _this = this;

					var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
					var auto = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


					if (!$.prv.$.reg[this.$.id].events[eid]) {
						$.prv.$.reg[this.$.id].events[eid] = new $.prv.events(this.$.id, eid);
					}

					var args = Array.prototype.slice.call(arguments);
					args = args.slice(3);
					// auto dispatch
					if (node && auto) {
						var _ret = function () {

							if (auto === true) {
								auto = eid;
							}

							var tmp = _this,
							    task = void 0;

							if (!$.fx.isTypeOf(node, NodeList)) {

								task = function task() {
									tmp.dispatch.apply(tmp, [eid, node].concat(Array.prototype.slice.call(arguments), _toConsumableArray(args)));
								};

								node.addEventListener(auto, task);

								return {
									v: {
										remove: function remove() {
											node.removeEventListener(auto, task);
										}
									}
								};
							} else {
								var result = [];

								var _loop = function _loop(i) {
									task = function task() {
										tmp.dispatch.apply(tmp, [eid, node[i]].concat(Array.prototype.slice.call(arguments), _toConsumableArray(args)));
									};
									node[i].addEventListener(auto, task);
									result.push({
										remove: function remove() {
											node[i].removeEventListener(auto, task);
										}
									});
								};

								for (var i = 0; i < node.length; i++) {
									_loop(i);
								}
								return {
									v: result
								};
							}
						}();

						if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
					}
				}
			}, {
				key: 'dispatch',
				value: function dispatch(eid, tArg) {
					if ($.prv.$.reg[this.$.id].events[eid]) {

						var $rid = this.$.id,
						    args = Array.prototype.slice.call(arguments);
						args = args.slice(2);

						//if(eid=='window::resize'){console.log('--------------------');}

						Object.keys($.prv.$.reg[this.$.id].events[eid].callbacks).forEach(function (key) {
							var _$$prv$$$reg$$rid$eve;

							(_$$prv$$$reg$$rid$eve = $.prv.$.reg[$rid].events[eid].callbacks[key]).call.apply(_$$prv$$$reg$$rid$eve, [tArg ? tArg : window].concat(_toConsumableArray(args)));
						});

						return true;
					} else {
						return false;
					}
				}
			}, {
				key: 'remove',
				value: function remove(eid) {
					delete $.prv.$.reg[this.$.id].events[eid];
				}
				//------------------------------------------------------------>

			}, {
				key: 'addCallback',
				value: function addCallback(eid, cb) {
					var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


					if ($.prv.$.reg[this.$.id].events[eid] && cb) {
						return $.prv.$.reg[this.$.id].events[eid].setCallback(cb, position);
					} else {
						return false;
					}
				}
				/*getCallback(eid){
    	if($.prv.$.reg[this.$.id].events[eid]){
    		return $.prv.$.reg[this.$.id].events[eid].getCallbacks();
    	}else{return null;}
    }
    delCallback(eid, callback_name){}
    */

			}]);

			return generator;
		}()
	});
	//************************************************************************>
})();