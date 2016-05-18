
((module) => {
	'use strict';

	var freeze = Object.freeze;

	module.exports = class extends Action {};

	function Action(type, itemPath, itemType) {
		this.type = type;
		this.itemPath = itemPath;
		this.itemType = itemType;
		freeze(this);
	}

})(module);
