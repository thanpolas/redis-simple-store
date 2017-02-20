/**
 * @fileOverview Base API Surface tests.
 */
var chai = require('chai');
var expect = chai.expect;

var RedisStore = require('../..');

describe('Base API Surface', function() {
  it('should be a function', function() {
    expect(RedisStore).to.be.a('function');
  });
});
