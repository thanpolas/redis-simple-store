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
 * @param {Redis} redis The redis client.
 * @param {string} keyPrefix The key prefix to store keys on.
 * @constructor
 */
var RedisStore = module.exports = cip.extend(function(redis, keyPrefix) {
  if (typeof keyPrefix !== 'string') {
    throw new TypeError('keyPrefix not a string');
  }
  if (keyPrefix.length === 0) {
    throw new Error('keyPrefix cannot be empty');
  }
  this.keyPrefix = keyPrefix;
  this.redis = redis;
  this.redisSet = Promise.promisify(this.redis.set.bind(this.redis));
  this.redisGet = Promise.promisify(this.redis.get.bind(this.redis));
  this.redisDel = Promise.promisify(this.redis.del.bind(this.redis));
});

/**
 * Set a value.
 *
 * @param {string} recordId The id of the record.
 * @param {Object} data The data to store.
 * @return {Promise} A Promise.
 */
RedisStore.prototype.set = Promise.method(function(recordId, data) {
  var key = this.getKey(recordId);

  var value = JSON.stringify(data);

  return this.redisSet(key, value);
});

/**
 * Get a value.
 *
 * @param {string} recordId The id of the record.
 * @return {Promise(Object|null)} A Promise with the response data.
 */
RedisStore.prototype.get = Promise.method(function(recordId) {
  var key = this.getKey(recordId);

  return this.redisGet(key)
    .bind(this)
    .then(function (res) {
      var result = JSON.parse(res);

      if (!result) {
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
