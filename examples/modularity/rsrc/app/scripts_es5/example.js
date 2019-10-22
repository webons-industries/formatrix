'use strict';

(function () {

	var $ = new Namespace("app://scripts~?/example");
	//************************************************************************> private
	$.prv = {
		$: {
			var: 'hello world'
		}
	};
	//************************************************************************> public
	$.pub({
		HelloWorld: function HelloWorld() {
			return $.prv.$.var;
		},
		direct: function direct() {
			var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			console.log('direct call: ' + list);
		},

		lvl1: {
			lvl2: {
				lvl3: function lvl3() {
					console.log('lvl1.lvl2.lvl3()');
				}
			},
			lvl2b: function lvl2b() {
				var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

				if (val == 1) {
					return {
						lvlA: {
							lvlB: function lvlB() {
								console.log('lvl1.lvl2b(1).lvlA.lvlB()');
							}
						},
						abc: {}
					};
				} else {
					return {
						lvlX: function lvlX() {
							console.log('lvl1.lvl2b(2).lvlX()');
						}
					};
				}
			}
		}
	});
	//************************************************************************>
})();
