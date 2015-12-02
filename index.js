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

var tree = require('tree');

/**
 * 核心配置文件
 * 
 * conf.basePath: 基础路径信息
 * conf.paths: 路径的别名
 * 
 */
var conf = {};
conf.basePath = '';
exports.config = function (opts) {
  conf.basePath = opts.basePath || '';
};

var _addSuffix = function (path) {
  var suffixExpress = /\.([^\.]+)$/;
  var results = suffixExpress.exec(path);
  var ext;
  var haserror = false;
  try {
    ext = results[1];
  } catch (e) {
    haserror = true;
  }
  if (haserror) {
    path += '.js';
  }
  return path;
};

var _removeSuffix = function (path) {
  var paths = path.split('.');
  if (paths.pop() === 'js') {
    return paths.join();
  }
  return path;
};

function _dependency(path) {
  transversed[_removeSuffix(path)] = true;
  
  // 路径的映射
  var aliasPath = _addSuffix(path);
  if (conf.paths && conf.paths[aliasPath]) {
    aliasPath = conf.paths[aliasPath];
  }
  var modulePath = conf.basePath + aliasPath;
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
              this.break();
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
 * @istree Boolean 返回值的格式，是否为一个树，如果设置为false，则返回的是一个扁平化的结构
 * 
 */
var transversed = {};

var _flattenDp = function (dpData, deps) {
  var _dpData = [];
  for (var i in dpData) {
    if (dpData.hasOwnProperty(i)) {
      _dpData.push(i);
    }
  }
  if (deps == 1) {
    transversed = {};
  }
  return _dpData;
};

module.exports.simpleDependency = function (path) {
  var currentTree =  _dependency(path);
  transversed = {};
  return currentTree;
};

module.exports.getDependency = function (path, istree, deps, tree) {
  if (!deps) {
    deps = 0;
  }
  deps++;

  if (!tree) {
    tree = {};
  }

  var currentTree = [];
  if (!transversed[path] || istree) {
    currentTree = _dependency(path) || [];
    
    // TODO create Tree structure. at 2015-11-11 
    tree[path] = '-';
    if (currentTree.length == 1) {
      tree[path] = currentTree[0];
    }
    if (currentTree.length >= 1) {
      tree[path] = {};
    }
    
    for (var i = 0; i < currentTree.length; i++) {
      this.getDependency(currentTree[i], istree, deps, tree[path]);
    }
  }
  if (!istree) {
    return _flattenDp(transversed, deps);
  } else {
    if (deps == 1) {
      transversed = {};
      return tree;
    }
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

/**
 * 设置配置文件
 * 
 * 
 */
module.exports.set = function (opts) {
  if (!opts) {
    return;
  }

  for (var i in opts) {
    if (opts.hasOwnProperty(i) && !!opts[i]) {
      conf[i] = opts[i];
    }
  }
};
