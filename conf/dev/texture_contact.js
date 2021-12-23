'use strict';

module.exports = {
  application: {
    services: {
      webAdminContact: {
        methods: {
          contact: {
            mocking: {
              mappings: {
                default: {
                  selector: function (data = {}) {
                    return true;
                  },
                  generate: function (data = {}) {
                    return Promise.resolve({
                      message: 'Mocking api contact'
                    });
                  }
                }
              }
            }
          },
        }
      }
    }
  }
};
