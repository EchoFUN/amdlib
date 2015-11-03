/* global process */

/**
 * 
 * 
 * 
 * Ex:
 * 
 * var amdlib = require('amdlib');
 * amdlib.config({
 *   basePath: '/'
 * });
 * 
 */

var fs = require('fs');
var Q = require('q');

var AMDLib = function () {

};


module.exports.config = function (opts) {
  this.basePath = opts.basePath;
};

module.exports.getSingleDependency = function (path) {
  if (!this.basePath) {
    process.exit();
  }

  var modulePath = this.basePath + path;
  var suffixExpress = /\.([^\.]+)$/;
  var results = suffixExpress.exec(modulePath);
  var ext;
  try {
    ext = results[1];
  } catch (e) {
    modulePath += '.js';
  }

  Q.nfcall(fs.exists, modulePath, function (res) {

    if (res) {
      Q.nfcall(fs.readFile, modulePath, 'utf8').then(function (buffer) {
        
        console.log(buffer);
        
      }).fail(function () {
        
      });
    } else {
      console.log('Path do not exists !');
      process.exit();
    }
  }).fail(function () {

  });

};

/**
 * 
 * 
 * 
 * 
 */
module.exports.getDependency = function (path, deps) {

  if (deps && deps != 1) {

  } else {
    return this.getSingleDependency(path);
  }


};