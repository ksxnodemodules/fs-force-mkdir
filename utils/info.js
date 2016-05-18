
((module) => {
	'use strict';

	var freeze = Object.freeze;

	module.exports = class extends Info {};

	function Info(type, path, action) {
		this.type = type;
		this.path = path;
		this.action = action;
		freeze(this);
	}

})(module);
