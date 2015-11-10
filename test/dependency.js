/**
 * 
 * 
 * 
 * 
 * 
 */

var amdlib = require('../index.js');

amdlib.config({
  basePath: '/Users/xukai/Documents/workspace/waimai_web/src/main/webapp/static/js/'
})

var dependency = amdlib.getDependency('page/map/seedsnew');

var dependency2 = amdlib.getDependency('page/home');

debugger;