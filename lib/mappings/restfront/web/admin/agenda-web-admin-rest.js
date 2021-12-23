'use strict';

module.exports = [

  {
    path: '/agenda',
    method: 'GET',
    serviceName: 'application/webAdminAgenda',
    methodName: 'getAgenda',
    input: {
      transform: function (req) {
        return {
          startDate : req.query.startDate,
          start: req.query.start,
          name: req.query.name,
          end: req.query.end,
          page: req.query.page,
          limit: req.query.limit,
          status: req.query.status,
          id: req.query.id
        };
      }
    },
    output: {
      transform: function (response) {
        return {
          headers: {
            'X-Total-Count': response.total,
            'Access-Control-Expose-Headers': 'X-Total-Count'
          },
          body: response
        };
      }
    }
  },

  {
    path: '/agenda',
    method: 'PUT',
    serviceName: 'application/webAdminAgenda',
    methodName: 'editStatus',
    input: {
      transform: function (req) {
        return {
          ...req
        };
      }
    },
    output: {
      transform: function (response) {
        return {
          body: response
        };
      }
    }
  },
];
