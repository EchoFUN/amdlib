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
  basePath: __dirname + '/demo/'
})

var treedp = amdlib.getDependency('entry', true);
var flatdp = amdlib.simpleDependency('entry');

console.log(treeify.asTree(treedp, true));
console.log(treeify.asTree(flatdp, true));