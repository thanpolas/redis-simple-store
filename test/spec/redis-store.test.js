/**
 * @fileOverview Full API tests.
 */
var chai = require('chai');
var expect = chai.expect;

var RedisStore = require('../..');
var redisService = require('../lib/redis.service');

describe('Full API Tests', function() {

  beforeEach(function() {
    return redisService.getClient()
      .bind(this)
      .then(function(redis) {
        this.redis = redis;
      });
  });

  beforeEach(function() {
    this.prefix = 'test.redis-simple-store.' + Date.now() + '.';
  });

  it('should store and read a string', function() {
    var redisStore = new RedisStore(this.redis, this.prefix);
    return redisStore.set('alpha', 'word')
      .bind(this)
      .then(function() {
        return redisStore.get('alpha');
      })
      .then(function(res) {
        expect(res).to.be.a('string');
        expect(res).to.equal('word');
      });
  });
  it('should store and read a number', function() {
    var redisStore = new RedisStore(this.redis, this.prefix);
    return redisStore.set('beta', 1)
      .bind(this)
      .then(function() {
        return redisStore.get('beta');
      })
      .then(function(res) {
        expect(res).to.be.a('number');
        expect(res).to.equal(1);
      });
  });
  it('should store and read an Array', function() {
    var redisStore = new RedisStore(this.redis, this.prefix);
    return redisStore.set('gamma', [1, 2, 3])
      .bind(this)
      .then(function() {
        return redisStore.get('gamma');
      })
      .then(function(res) {
        expect(res).to.be.an('array');
        expect(res).to.deep.equal([1, 2, 3]);
      });
  });
  it('should store and read an Object', function() {
    var redisStore = new RedisStore(this.redis, this.prefix);
    var value = {
      a: 1,
      b: 'two',
      c: [1, 2, 3],
    };
    return redisStore.set('delta', value)
      .bind(this)
      .then(function() {
        return redisStore.get('delta');
      })
      .then(function(res) {
        expect(res).to.be.an('object');
        expect(res).to.deep.equal(value);
      });
  });

  it('should delete a value', function() {
    var redisStore = new RedisStore(this.redis, this.prefix);
    return redisStore.set('epsilon', 'word')
      .bind(this)
      .then(function() {
        return redisStore.del('epsilon');
      })
      .then(function() {
        return redisStore.get('epsilon');
      })
      .then(function(res) {
        expect(res).to.be.null;
      });
  });
});
