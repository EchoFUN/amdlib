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
var esprima = require('esprima');

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
  
  try {
    var isExists = fs.existsSync(modulePath);
    if (isExists) {
      
      var buffer = fs.readFileSync(modulePath, 'utf8');
      
      console.log(buffer);
    } else {
      console.log('Path do not exists !');
      process.exit();
    }
  } catch (e) {
    ;
  }

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