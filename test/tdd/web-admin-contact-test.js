const liberica = require('liberica');
const { mockit, assert } = liberica;
const path = require('path');

describe('web-admin-contact', function () {
  let webAdminContact = mockit.acquire('web-admin-contact', {
    moduleHome: path.join(__dirname, '../../lib/services')
  });

  describe('resolveMessage', function () {
    let resolveMessage = mockit.get(webAdminContact, 'resolveMessage');
    assert.isFunction(resolveMessage);
    it('Should be return string message', function () {
      assert.deepEqual(resolveMessage('Hello'), {
        message: 'Hello'
      });
    });
    it('Should be throw error if args diff input message', function () {
      assert.deepEqual(resolveMessage('Hello'), {
        message: 'Hello'
      })
    })
  })
})