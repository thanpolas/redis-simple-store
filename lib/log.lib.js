/**
 * @fileOverview Provides a Bunyan logger.
 */
var bunyan = require('bunyan');
var fmt = require('bunyan-format');

var shouldLog = !!process.env.REDIS_SIMPLE_STORE_LOG_LEVEL;
var logLevel = process.env.REDIS_SIMPLE_STORE_LOG_LEVEL || 'info';
var noColors = !!process.env.REDIS_SIMPLE_STORE_LOG_NO_COLORS;

// default outstream mutes
var outStream = {
  write: function() {}
};

if (shouldLog) {
  outStream = fmt({
    outputMode: 'long',
    levelInString: true,
    color: !noColors,
  });
}

/**
 * Create a singleton bunyan logger and expose it.
 */
module.exports = bunyan.createLogger({
  name: 'redis-simple-store',
  level: logLevel,
  stream: outStream,
});
