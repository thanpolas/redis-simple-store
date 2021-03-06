/*
 * Redis Simple Store
 * A Simple key/value store for arbitrary values based on redis.
 * https://github.com/thanpolas/__proto__
 *
 * Copyright © Thanasis Polychronakis
 * Licensed under the MIT license.
 */

/**
 * @fileOverview A Simple key/value store for arbitrary values based on redis.
 *
 * A redis plain string with JSON serialization.
 */

var Promise = require('bluebird');
var cip = require('cip');

/**
 * A Simple key/value store for arbitrary values based on redis.
 *
 * @param {string} keyPrefix The key prefix to store keys on.
 * @constructor
 */
var RedisStore = module.exports = cip.extend(function(keyPrefix) {
  if (typeof keyPrefix !== 'string') {
    throw new TypeError('keyPrefix not a string');
  }
  if (keyPrefix.length === 0) {
    throw new Error('keyPrefix cannot be empty');
  }
  this.keyPrefix = keyPrefix;
  this.redis = null;
  this.redisSet = null;
  this.redisGet = null;
  this.redisDel = null;
});

/**
 * Set the redis client.
 *
 * @param {Redis} redis The redis client.
 * @param {string} keyPrefix The key prefix to store keys on.
 * @constructor
 */
RedisStore.prototype.setClient = function(redisClient) {
  this.redis = redisClient;
  this.redisSet = Promise.promisify(this.redis.set.bind(this.redis));
  this.redisGet = Promise.promisify(this.redis.get.bind(this.redis));
  this.redisDel = Promise.promisify(this.redis.del.bind(this.redis));
};

/**
 * Set a value.
 *
 * @param {string} recordId The id of the record.
 * @param {Object} data The data to store.
 * @param {...*} any number of arguments.
 * @return {Promise} A Promise.
 */
RedisStore.prototype.set = Promise.method(function() {
  var args = Array.prototype.slice.call(arguments);
  if (!this.redis) {
    throw new Error('Redis client not set, use setClient()');
  }

  var recordId = args[0];
  var data = args [1];

  var key = this.getKey(recordId);

  var value = JSON.stringify(data);

  var callArgs = [
    key,
    value,
  ].concat(args.slice(2));

  return this.redisSet.apply(null, callArgs);
});

/**
 * Get a value.
 *
 * @param {string} recordId The id of the record.
 * @return {Promise(Object|null)} A Promise with the response data.
 */
RedisStore.prototype.get = Promise.method(function(recordId) {
  if (!this.redis) {
    throw new Error('Redis client not set, use setClient()');
  }

  var key = this.getKey(recordId);

  return this.redisGet(key)
    .bind(this)
    .then(function (res) {
      var result = JSON.parse(res);

      if (typeof result === 'undefined') {
        return null;
      }

      return result;
    });
});

/**
 * Devare a key.
 *
 * @param {string} recordId The id of the record.
 * @return {Promise(Object)} A Promise with the response.
 */
RedisStore.prototype.del = Promise.method(function(recordId) {
  if (!this.redis) {
    throw new Error('Redis client not set, use setClient()');
  }

  var key = this.getKey(recordId);

  return this.redisDel(key);
});

/**
 * Provide namespacing on store keys.
 *
 * @param {string} recordId The id of the record.
 * @return {string} Proper key to store.
 */
RedisStore.prototype.getKey = function (recordId) {
  return this.keyPrefix + recordId;
};
