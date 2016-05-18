
((module) => {
	'use strict';

	var {mkdir, stat, unlink} = require('fs');
	var path = require('path');
	var justTry = require('try-promise').try;
	var {addPromise} = require('./utils/promise.js');
	var Info = require('./utils/info.js');
	var Action = require('./utils/action.js');
	var _throwif = require('./utils/throw-if.js');
	var _donothing = require('./utils/do-nothing.js');
	var flatArray = require('./utils/flat-array.js');

	var resolvePath = path.resolve;
	var getParent = path.dirname;

	var __mkdir = (dirname, onfinish, onaction) => {
		var callOnFinish = (...action) =>
			onfinish(null, new Info('mkdir', dirname, action));
		stat(dirname, (error, info) => {
			if (error) {
				let parent = getParent(dirname);
				return parent !== dirname ? __mkdir(parent, (error, info) => {
					if (error) {
						return onfinish(error, null);
					}
					mkdir(dirname, (error) => {
						if (error) {
							return onfinish(error, null);
						}
						var action = new Action('create', dirname, 'dir');
						justTry(onaction, [action]);
						callOnFinish(action, ...flatArray(info.action));
					});
				}, onaction) : onfinish({
					message: `Root directory "${parent}" doesn't exist`,
					__proto__: error
				}, null);
			}
			if (info.isFile()) {
				return unlink(dirname, (error) => {
					if (error) {
						return onfinish(error, null);
					}
					var action = new Action('delete', dirname, 'file');
					justTry(onaction, [action]);
					__mkdir(dirname, (error, info) => {
						if (error) {
							return onfinish(error, null);
						}
						callOnFinish(action, ...flatArray(info.action));
					}, onaction);
				});
			}
			callOnFinish();
		});
	};

	var _mkdir = (dirname, onfinish, onaction) =>
		addPromise((resolve) => __mkdir(dirname, (...errinf) => resolve(errinf), onaction))
			.onfinish((errinf) => onfinish(...errinf));

	module.exports = (dirname, onfinish = _throwif, onaction = _donothing) => _mkdir(resolvePath(dirname), onfinish, onaction);

})(module);
