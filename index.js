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

var basePath = '';
exports.config = function (opts) {
  basePath = opts.basePath || '';
};

var _resolvePath = function (path) {
  var modulePath = basePath + path;
  var suffixExpress = /\.([^\.]+)$/;
  var results = suffixExpress.exec(modulePath);
  var ext;
  try {
    ext = results[1];
  } catch (e) {
    modulePath += '.js';
  }

  return modulePath;
};

function _dependency(path) {
  transversed[path] = true;

  var modulePath = _resolvePath(path);
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
 * @path String 需要分析的模块的路径
 * @deps Number 需要遍历的模块的深度
 * @isflat Boolean 返回值的格式，是否为一个树，如果设置为false，则返回的是一个扁平化的结构
 * 
 */
var tree = {}, transversed = {};

var _flattenDp = function (dpData) {
  var _dpData = [];
  for (var i in dpData) {
    if (dpData.hasOwnProperty(i)) {
      _dpData.push(i);
    }
  }
  return _dpData;
};

module.exports.getDependency = function (path, isflat, deps) {
  isflat = isflat || true;

  if (deps != 1) {
    var currentTree = [];
    if (!transversed[path]) {
      currentTree = _dependency(path) || [];
      
      /*
      if (deps && deps-- == 0) {
        if (isflat) {
          return transversed;
        }
      }
      */

      for (var i = 0; i < currentTree.length; i++) {
        this.getDependency(currentTree[i], isflat, deps);
      }
    }

    if (isflat) {
      return _flattenDp(transversed);
    }
  } else {
    return _dependency(path);
  }
};

/**
 * 
 * 判断当前的模块，是不是一个有效地AMD模块
 * 
 * 
 * 
 */
module.exports.isValidateAMD = function (path) {
  if (!path) {
    return 'is not a validate path.';
  }


};