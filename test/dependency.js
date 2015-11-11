/**
 * 
 * 
 * 
 * 
 * 
 */

var amdlib = require('../index.js');
var treeify = require('treeify');

amdlib.config({
  basePath: '/Users/xukai/Documents/workspace/waimai_web/src/main/webapp/static/js/'
})

var dependency = amdlib.getDependency('page/map/seedsnew', true);

console.log(treeify.asTree(dependency, true));

var dependency2 = amdlib.getDependency('page/home');

debugger;