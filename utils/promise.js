
((module) => {
    'use strict';

    var queue = require('fs-one-promise-queue');

    var {addPromise} = queue;

    module.exports = {
        addPromise: (callback) =>
            addPromise((_, ...rest) => callback(...rest)),
        __proto__: queue
    };

})(module);
