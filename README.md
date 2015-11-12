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
var amdlib = require('amdlib');
amdlib.set({
  basePath: '/'
});

var treedp = amdlib.getDependency('path/to/module', true);
var flatdp = amdlib.getDependency('path/to/module');
```

## License
MIT
