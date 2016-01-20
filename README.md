# amdlib

## Install
Install the tool from npm registry.
```javascript
npm install -g amdlib
```

## API
* -b --basePath : `specify the base path of the module dependency`
* -t --tree : `print the dependency details as a tree format`
* -h --help : `print help doc`

## How to use
### Standalone
A test file called toto.js
```javascript
amdlib -b "path/to/" -t toto.js
```

### Program API
```javascript
var amdlib = require('../index.js');
var treeify = require('treeify');

amdlib.config({
  basePath: __dirname + '/demo/'
})

var treedp = amdlib.getDependency('entry', true);
var flatdp = amdlib.simpleDependency('entry');

console.log(treeify.asTree(treedp, true));
console.log(treeify.asTree(flatdp, true));
```

## License
MIT
