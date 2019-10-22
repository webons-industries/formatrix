"use strict";

(function (Namespace) {

	var $ = new Namespace("app://scripts~?/examples/pubFunction");
	//************************************************************************>
	$.pub(function () {
		console.log('pubFunction');
	});
	//************************************************************************>
})(fx.namespace);
