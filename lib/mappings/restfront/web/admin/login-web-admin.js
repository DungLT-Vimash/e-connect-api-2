'use strict';

module.exports = [

  {
    path: '/auth/login',
    method: 'POST',
    serviceName: 'application/webAdminLogin',
    methodName: 'login',
    input: {
      transform: function (req) {
        return {
          ...req.body
        };
      },
    },
    output: {
      transform: function (result) {
        return {
          headers: {
            'X-Return-Code': result.returnCode,
          },
          body: result.data,
        };
      }
    }
  },
  {
    path: '/auth/refreshToken',
    method: 'POST',
    serviceName: 'application/webAdminLogin',
    methodName: 'refreshToken',
    input: {
      transform: function (req) {
        return {
          ...req.body
        };
      },
    },
    output: {
      transform: function (result, req) {
        return {
          headers: {
            'X-Return-Code': result.returnCode,
          },
          body: result.data,
        };
      }
    },
  },
];
