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

amdlib.set({
  'paths': {
    'module/user': 'module/user_fuck'
  }
});

var dependency = amdlib.getDependency('module/toptips');

debugger;