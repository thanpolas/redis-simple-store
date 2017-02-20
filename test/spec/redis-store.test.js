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
      .then(function(whot) {
        console.log('whot:', whot);

        return redisStore.get('alpha');
      })
      .then(function(res) {
        expect(res).to.be.a('string');
        expect(res).to.equal('word');
      });
  });
});
