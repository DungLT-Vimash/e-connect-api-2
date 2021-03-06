'use strict';

module.exports = {
  devebot: {
    mode: "silent"
  },
  logger: {
    transports: {
      console: {
        type: 'console',
        level: 'debug',
        json: false,
        timestamp: true,
        colorize: false
      }
    }
  }
};
