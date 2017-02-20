# __proto__

> Clone, edit, hack. An opinionated boilerplate for Node Libraries.

[![Build Status](https://secure.travis-ci.org/thanpolas/__proto__.png?branch=master)](http://travis-ci.org/thanpolas/__proto__)

To use, simply Clone, Enter directory, delete `.git` folder and start over:

```shell
git clone git@github.com:thanpolas/__proto__.git
cd __proto__
rm -rf .git
git init
git add .
git commit "Boot!"
```

Boilerplate OSS follows...

## Install

Install the module using NPM:

```
npm install YADDAYADDA --save
```
## <a name='TOC'>Table of Contents</a>

1. [Overview](#overview)
1. [API](#api)

## Overview

Lorem ipsum trololol.

## API

One more to go back without onez has together we know!

**[[⬆]](#TOC)**

### <a name='toApi'>Getting an API Safe verison</a>

> ### errInstance.toApi()
>
> *Returns* `Object` A sanitized object.

Clones the error object and strips it of all the `Error` getters (like `stack`) and the following attributes:
    
    * `srcError`

```js
var appErr = require('nodeon-error');

var error = new appErr.Error();

console.log(error.toApi());
```

## Release History

- **v0.0.1**, *TBD*
    - Big Bang

## License

Copyright Thanasis Polychronakis. Licensed under the MIT license.
