/**
 * @fileOverview Provider for redis clients.
 */
var Promise = require('bluebird');
var redis = require('redis');

// use localhost
var REDIS_URL = null;

/** @type {Array.<redis>} Redis clients */
var clients = [];

/** @type {?redis} Redis persistent client */
var persistentClient = null;

// var noop = function () {};

/**
 * Provider for redis clients.
 *
 */
var redisClient = module.exports = {};

/**
 * Creates a persistent connection to redis and provides it.
 *
 * Optionally you can require a new connection from the arguments.
 *
 * @param {Object=} optOpts Optionally define options.
 *   @param {boolean=} newClient get a new client, default is false.
 * @return {Promise(redis.redisClient)} A redis client.
 */
redisClient.getClient = Promise.method(function(optOpts) {
  var opts = optOpts || {};

  if (!opts.newClient) {
    if (persistentClient) {
      return persistentClient;
    }
  }

  var client = redisClient._connect();

  if (!client) {
    throw new Error('Failed to connect to Redis.');
  }

  clients.push(client);

  if (!opts.newClient) {
    persistentClient = client;
  }

  return redisClient._connectWait(client);
});

/**
 * Connect to Redis server.
 *
 * @return {redis.redisClient|null} Redis client instance or null on error.
 * @private
 */
redisClient._connect = function() {
  try {
    var client = redis.createClient(REDIS_URL);

    client.on('error', redisClient._onRedisError);

    return client;

  } catch(ex) {
    return null;
  }
};

/**
 * Handle redis errors so exceptions will not bubble up.
 *
 * @param {string} err the error message
 * @private
 */
redisClient._onRedisError = function(err) {
  console.error('_onRedisError() :: Redis Error:', err);
};

/**
 * Close all connections and reset objects.
 *
 */
redisClient.dispose = function() {
  clients.forEach(function(client){
    client.end();
  });
  clients = [];
  persistentClient = null;
};

/**
 * Wait until redis client reports connection.
 *
 * @return {Promise} A promise.
 */
redisClient._connectWait = function(client) {
  return new Promise(function(resolve, reject) {
    var local = {};

    local.onError = function onError(err) {
      client.removeListener('connect', local.onConnect);
      reject(err);
    };

    local.onConnect = function onConnect() {
      client.removeListener('error', local.onError);
      resolve(client);
    };

    client.once('connect', local.onConnect);
    client.once('error', local.onError);
  });
};
