'use strict';

const contextPath = '/rest/api';

const helper = require('app-restguard').require('helper');
const lifeToken= '600000';
const secretKey= 'dobietday';
module.exports = {
  application: {
    contextPath: contextPath,
    lifeToken: lifeToken,
    secretKey: secretKey
  },
  plugins: {
    appRestguard: {
      enabled: true,
      secretKey: process.env['DEVEBOT_CONFIG_VAL_sandbox_plugins_appSequence_counterStateKey'] || 'dobietday',
      deprecatedKeys: helper.stringToArray(process.env['DEVEBOT_CONFIG_VAL_sandbox_plugins_appRestguard_deprecatedKeys']),
      protectedPaths: [contextPath],
      publicPaths: [
        `${contextPath}/v1/web/admin/contact`,
        `${contextPath}/v1/web/admin/auth/login`,
        `${contextPath}/v1/web/admin/auth/refreshToken`
      ],
      authorization: {
        enabled: false,
        permissionLocation: ['permissions'],
        permissionRules: [
          {
            url: '/editEmployees',
            methods: ['PUT'],
            permission: 'admin'
          },
          {
            url: '/employees/search',
            methods: ['GET'],
            permission: 'admin'
          },
          {
            url: '/employees/getEmployeebyId',
            methods: ['GET'],
            permission: 'admin'
          },
          {
            url: '/listEmployees',
            methods: ['GET'],
            permission: 'admin'
          },
          {
            url: '/employees/signation',
            methods: ['POST'],
            permission: 'admin'
          },
          {
            url: '/agenda',
            methods: ['GET'],
            permission: 'admin'
          },
          {
            url: '/agenda/:id',
            methods: ['GET'],
            permission: 'admin'
          },
        ]
      }
    },
    appRestfetch: {
      mappings: {},
    },
    appRestfront: {
      priority: 100,
      contextPath: contextPath,
      requestOptions: {
        requestId: {
          required: false
        }
      }
    },
    appWebweaver: {
      cors: {
        enabled: true,
        mode: 'simple'
      }
    },
    appWebserver: {
      host: process.env['DEVEBOT_CONFIG_VAL_sandbox_plugins_appWebserver_host'] || '0.0.0.0',
      port: process.env['DEVEBOT_CONFIG_VAL_sandbox_plugins_appWebserver_port'] || 8080
    },
  },
  bridges: {
    mongoose: {
      appDatastore: {
        manipulator: {
          connection_options: {
            host: process.env['appDatastore_mongoose_manipulator_host'] || '127.0.0.1',
            port: process.env['appDatastore_mongoose_manipulator_port'] || '27017',
            name: process.env['appDatastore_mongoose_manipulator_db'] || 'e-connect'
          }
        }
      }
    }
  }
};
