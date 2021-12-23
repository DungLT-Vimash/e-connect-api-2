'use strict';
const path = require('path');
const contextPath = '/rest/api/v1';

module.exports = {
  application: {
    contextPath: contextPath,
    errorCodes: {
      NameError: {
        message: 'message error',
        returnCode: 3000,
        statusCode: 400,
      },
      ArgsNotFound: {
        message: 'args not found',
        returnCode: 3001,
        statusCode: 400,
      },
      InformationIsAllWhiteSpace: {
        message: 'Information Is All White Space',
        returnCode: 3002,
        statusCode: 400,
      },
      PhoneIncorrect: {
        message: 'Phone Incorrect',
        returnCode: 3003,
        statusCode: 400,
      },
      EmailIncorrect: {
        message: 'Email Incorrect',
        returnCode: 3004,
        statusCode: 400,
      },
      BirthDayIncorrect: {
        message: 'BirthDay Incorrect',
        returnCode: 3005,
        statusCode: 400,
      },
      InvalidVerifiedNewPassword: {
        message: 'Invalid Verified NewPassword',
        returnCode: 3006,
        statusCode: 400,
      },
      GenderIncorrect: {
        message: 'Gender Incorrect',
        returnCode: 3007,
        statusCode: 400,
      },
      DuplicateEmailRegister: {
        message: 'Duplicate Email Register',
        returnCode: 3008,
        statusCode: 400,
      },
      DuplicatePhoneRegister: {
        message: 'Duplicate Phone Register',
        returnCode: 3008,
        statusCode: 400,
      },
      NoEmployees: {
        message: 'No Employees',
        returnCode: 3009,
        statusCode: 400,
      },
      JoinedDateIncorrect: {
        message: 'JoinedDate Incorrect',
        returnCode: 3010,
        statusCode: 400,
      },
      PasswordIncorrect: {
        message: 'Password Incorrect',
        returnCode: 3011,
        statusCode: 400,
      },
      AccountDoesNotExist: {
        message: 'Account Does Not Exist',
        returnCode: 3012,
        statusCode: 400,
      },
      refreshTokenIncorrect: {
        message: 'refreshToken Incorrect',
        returnCode: 3013,
        statusCode: 400,
      },
      SystemError: {
        message: 'SystemError',
        returnCode: 3014,
        statusCode: 500,
      },
      token_expired: {
        message: 'Token Expired',
        returnCode: 3018,
        statusCode: 400,
      },
      PhoneNumberCanNotBeEmpty: {
        message: 'Phone Number Can Not Be Empty',
        returnCode: 3015,
        statusCode: 400,
      },
      PropertyIsEmpty: {
        message: 'Property is empty',
        returnCode: 3016,
        statusCode: 400,
      },
      ArgsEmpty: {
        message: 'Args Empty',
        returnCode: 3017,
        statusCode: 400,
      },
      NoInformation: {
        message: 'No Information Author',
        returnCode: 3019,
        statusCode: 400,
      }
    }
  },
  plugins: {
    appRestguard: {
      secretKey: 'dobietday',
      protectedPaths: [contextPath],
      publicPaths: [`${contextPath}/v1/web/admin/contacts`],
      accessTokenDetailPath: '/-access-token-',
      authorization: {
        enabled: false,
        permissionLocation: ['permissions'],
        permissionRules: []
      }
    },
    appRestfetch: {
      mappingStore: {
        application: path.join(__dirname, '../lib/mappings/restfetch/'),
      },
    },
    appRestfront: {
      priority: 100,
      contextPath: contextPath,
      mappingStore: {
        'e-connect-adm-api': path.join(__dirname, '../lib/mappings/restfront/'),
      },
    },
    appWebweaver: {
      cors: {
        enabled: true,
        mode: 'simple',
      },
    },
    appWebserver: {
      host: 'localhost',
      port: 3000,
    },
  },
  bridges: {
    mongoose: {
      appDatastore: {
        manipulator: {
          connection_options: {
            host: '127.0.0.1',
            port: '27017',
            name: 'e-connect',
          },
        },
      },
    },
  },
};
