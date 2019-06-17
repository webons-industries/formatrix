'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (Namespace) {

	var $ = new Namespace("[app]scripts~?/examples/pubObject");
	//************************************************************************>
	$.pub({
		aFunction: function aFunction() {
			console.log('pubObject:aFunction');
		},

		aClass: function aClass() {
			_classCallCheck(this, aClass);

			console.log('pubObject:aClass');
		},
		aObject: {

			value: 'pubObject:aObject.value',

			aFunction: function aFunction() {
				console.log('pubObject:aObject.aFunction');
			}
		}
	});
	//************************************************************************>
})(fx.namespace);