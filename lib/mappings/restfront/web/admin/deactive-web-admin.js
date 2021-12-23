'use strict';

module.exports = [

  {
    path: '/deactive',
    method: 'POST',
    serviceName: 'application/webAdminDeactive',
    methodName: 'deactive',
    input: {
      transform: function (req) {
        return {
          ...req
        };
      }
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
  {
    path: '/get_information',
    method: 'GET',
    serviceName: 'application/webAdminDeactive',
    methodName: 'getInforAuthor',
    input: {
      transform: function (req) {
        return {
          ...req.query
        };
      }
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
