'use strict';
module.exports = [
  {
    path: '/employees/signation',
    method: 'POST',
    serviceName: 'application/webAdminEmployee',
    methodName: 'createEmployeeSignation',
    input: {
      transform: function (req) {
        return {
          ...req.body
        };
      }
    },
  },
  {
    path: '/employees',
    method: 'POST',
    serviceName: 'application/webAdminEmployee',
    methodName: 'createEmployees',
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
          body: result,
        };
      }
    }
  },
  {
    path: '/editEmployees/:employeeId',
    method: 'PUT',
    serviceName: 'application/webAdminEmployee',
    methodName: 'editEmployees',
    input: {
      transform: function (req) {
        return {
          ...req.body
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
  {
    path: '/employees/search',
    method: 'GET',
    serviceName: 'application/webAdminEmployee',
    methodName: 'searchEmployees',
    input: {
      transform: function (req) {
        return {
          params: req.query
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
    path: '/listEmployees',
    method: 'GET',
    serviceName: 'application/webAdminEmployee',
    methodName: 'listEmployee',
    input: {
      transform: function (req) {
        return {
          ...req.query
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
  {
    path: '/employees/getEmployeebyId/:employeeid',
    method: 'GET',
    serviceName: 'application/webAdminEmployee',
    methodName: 'getEmployeebyId',
    input: {
      transform: function (req) {
        return {
          id: req.params.employeeid
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
          body: response.result
        };
      }
    }
  },
];
