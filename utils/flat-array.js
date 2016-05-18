
((module) => {
	'use strict';

	var callback = (prev, element) =>
		[...prev, ...(element instanceof Array ? flatArray(element) : [element])];

	var flatArray = (array) =>
		array.reduce(callback, []);

	module.exports = (...array) => flatArray(array);

})(module);
