
((module) => {
	'use strict';

	var {mkdir, stat, unlink} = require('fs');
	var path = require('path');
	var justTry = require('try-promise').try;
	var {addPromise} = require('fs-force-utils/promise');
	var Info = require('fs-force-utils/info');
	var Action = require('fs-force-utils/action');
	var _throwif = require('fs-force-utils/throw-if');
	var _donothing = require('fs-force-utils/do-nothing');
	var flatArray = require('fs-force-utils/flat-array');

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
