'use strict';

const bcrypt = require('bcrypt');

function Service (params = {}) {
    const { dataManipulator, packageName, errorManager } = params;
    const errorBuilder = errorManager.getErrorBuilder(packageName);
  // eslint-disable-next-line no-unused-expressions
  this.resetPassword = async function (args, opts = {}) {
    try {
      // Kiem tra so dien thoai da co trong db chua
      const [account] = await dataManipulator.find({
        type: 'EmployeeModel',
        query: { _id: `${args.query.id}` }
      });
      // Neu so dien thoai chua co trong db
      if (!account) {
        throw errorBuilder.newError('AccountDoesNotExist');
      }
      // So sanh password trong db va password nhap vao
      if (args.body.currentPassword !== account.password) {
        throw errorBuilder.newError('PasswordIncorrect');
      } else {
        await dataManipulator.update({
          type: 'EmployeeModel',
          id: `${args.query.id}`,
          data: {password: bcrypt.hashSync(args.body.newPassword, 10)}
        });
        return {
            message: "reset password successfully "
          };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
  errorManager: 'app-errorlist/manager'
};

module.exports = Service;
