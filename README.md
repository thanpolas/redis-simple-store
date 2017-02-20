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

### set(key, value)

* `key` {string} The record key to store the value on.
* `value` {*} Any type to store.
* **Returns**: {Promise(string)} A Bluebird Promise with the string `OK`.

### get(key)

* `key` {string} The record key to fetch the value from.
* **Returns**: {Promise(*)} A Bluebird Promise with the value.

### del(key)

* `key` {string} The record key to delete.
* **Returns**: {Promise(number)} A Bluebird Promise with the number of records deleted.

## Release History

- **v0.0.2**, *20 Feb 2017*
    - Big Bang

## License

Copyright Thanasis Polychronakis. Licensed under the MIT license.
