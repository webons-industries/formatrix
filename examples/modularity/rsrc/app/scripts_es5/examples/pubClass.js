"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (Namespace) {

	var $ = new Namespace("app://scripts~?/examples/pubClass");
	//************************************************************************>
	$.pub(function () {
		function _class() {
			_classCallCheck(this, _class);

			console.log('pubClass');
		}

		return _class;
	}());
	//************************************************************************>
})(fx.namespace);
