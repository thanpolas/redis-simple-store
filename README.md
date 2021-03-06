# Redis Simple Store

> A Simple key/value store for arbitrary values based on redis.

[![Build Status](https://travis-ci.org/thanpolas/redis-simple-store.svg?branch=master)](https://travis-ci.org/thanpolas/redis-simple-store)

Redis Simple Store provides a simple API to store arbitrary values using the Redis string store. Everything is serialized using JSON.

## Install

Install the module using NPM:

```
npm install redis-simple-store --save
```

## Quick Start

```js
var redis = require('redis');
var RedisStore = require('redis-simple-store');

var redisClient = redis.createClient();

var redisStore = new RedisStore('key-prefix.');
redisStore.setClient(redisClient);

redisStore.set('record-id', 'value')
    .bind(this) // bluebird promise
    .then(function(res) {
        if (res !== 'OK') {
            // not stored
        }

        return redisStore.get('record-id');
    })
    .then(function(res) {
        console.log(res);
        // "value"
    });
```

## API Reference

### new RedisStore(keyPrefix)

That is the way you instantiate the Redis Simple Store:

* `keyPrefix` {string} Arbitrary key prefix to store all keys on, better that it ends with a full stop (`.`).

### setClient(redisClient)

This method needs to be invoked before any other so you can pass the redis client.

* `redisClient` {redis} The redis package's instance, a  redis client that exposes `set`, `get` and `del` with node callbacks.

### set(key, value, ...*)

* `key` {string} The record key to store the value on.
* `value` {*} Any type to store.
* `...*` Any number of arguments like `'EX', 60` to define expiration for the set value.
* **Returns**: {Promise(string)} A Bluebird Promise with the string `OK`.

### get(key)

* `key` {string} The record key to fetch the value from.
* **Returns**: {Promise(*)} A Bluebird Promise with the value.

### del(key)

* `key` {string} The record key to delete.
* **Returns**: {Promise(number)} A Bluebird Promise with the number of records deleted.

## Examples

### Exposing redis store as a model module

**Filename**: `account.model.js`

```js
var RedisStore = require('redis-simple-store');

var redisService = require('../some/local/redis/provider');


var accountModel = module.exports = new RedisStore('app.account.');

accountModel.init = function() {
    redisService.getRedisClient()
        .then(function(redisClient) {
            accountModel.setClient(redisClient);
        });
};
```

You will need to initialize the model once and then all `get()`, `set()`, etc methods will be available from that model.

## Release History

- **v0.2.0**, *28 Mar 2017*
    - Added support for variable arguments on the `set()` method so as to facilitate expiring keys.
- **v0.1.0**, *20 Feb 2017*
    - **Breaking Change** Changed signature of constructor and introduced the `setClient()` method for defining the redis client at a different time from instanciation.
- **v0.0.2**, *20 Feb 2017*
    - Big Bang

## License

Copyright Thanasis Polychronakis. Licensed under the MIT license.
