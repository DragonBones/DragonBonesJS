'use strict';

const util = require('util');

if (!util.promisify) {
  util.promisify = function (handle) {
    return function (...args) {
      return new Promise(function (resolve, reject) {
        handle(...args, (err, res) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(res);
          }
        });
      });
    };
  };
}
