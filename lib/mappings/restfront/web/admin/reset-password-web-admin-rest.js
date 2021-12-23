'use strict';

module.exports = [

  {
    path: '/auth/resetPassword',
    method: 'PUT',
    serviceName: 'application/webAdminResetPassword',
    methodName: 'resetPassword',
    input: {
      transform: function (req) {
        return {
          ...req
        };
      },
    },
    output: {
      transform: function (result) {
        return {
          headers: {
            'X-Return-Code': result.returnCode,
          },
          body: result,
        };
      }
    }
  },
];
