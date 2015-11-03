/* global process */

/**
 * 
 * @author XU Kai(xukai.ken@gmail.com) botobe.net
 * @date 2015-11-04 星期三
 * 
 * Ex:
 * 
 * var AmdLib = require('amdlib');
 * AmdLib.config({
 *   basePath: '/'
 * });
 * 
 * AmdLib.getDependency('page/xxx');
 * 
 */
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

var basePath;
exports.config = function (opts) {
  basePath = opts.basePath;
};

function _dependency (path) {
  if (!basePath) {
    process.exit();
  }

  var modulePath = basePath + path;
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
      var ast = esprima.parse(buffer);
      
      var dependencyArray;
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          try {
            var elements = node.elements, name = parent.callee.name;
            if (parent.type == 'CallExpression' && (name == 'require' || name == 'define') && node.type == 'ArrayExpression' && elements.length != 0) {
              dependencyArray = elements; 
              this.skip();
            }
          } catch (e) {
            ;
          }
        }
      });
      
      dependencyArray.forEach(function (current, index, thisArray) {
        thisArray[index] = current.value;
      });
      return dependencyArray;
    } else {
      console.log('Path "' + modulePath + '" do not exists !');
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
var tree = {};
module.exports.getDependency = function (path, deps) {

  if (deps != 1) {
    var currentTree = _dependency(path) || [];
    for (var i = 0; i < currentTree.length; i++) {
      tree[currentTree[i]] = this.getDependency(currentTree[i]);
    }
  } else {
    return _dependency(path);
  }
};