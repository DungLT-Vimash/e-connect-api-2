'use strict';

const Devebot = require('devebot');
const Promise = Devebot.require('bluebird');

function Service() {
  this.contact = function () {
    return resolveMessage('Vui lòng liên hệ Admin');
  };
};

function resolveMessage(string) {
  return { message: string };
}

module.exports = Service;