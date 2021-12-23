'use strict';

const contactWebAdminRest = require('./web/admin/contact-web-admin-rest');
const employeeWebAdminRest = require('./web/admin/employee-web-admin-rest');
const agendaWebAdminRest = require('./web/admin/agenda-web-admin-rest');
const loginWebAdminRest = require('./web/admin/login-web-admin');
const deactiveWebAdminRest = require('./web/admin/deactive-web-admin');
const resetPasswordWebAdminRest = require('./web/admin/reset-password-web-admin-rest');

const webAdminMappings = [
  ...contactWebAdminRest,
  ...employeeWebAdminRest,
  ...agendaWebAdminRest,
  ...loginWebAdminRest,
  ...deactiveWebAdminRest,
  ...resetPasswordWebAdminRest
];

webAdminMappings.forEach(function (rest) {
  rest.path = '/:apiVersion/web/admin' + rest.path;
});

const mappings = [...webAdminMappings];

module.exports = mappings;
