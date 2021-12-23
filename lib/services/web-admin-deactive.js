/* eslint-disable standard/object-curly-even-spacing */
'use strict';
const moment = require('moment');
const lodash = require('lodash');

function Service (params = {}) {
    const { dataManipulator, packageName, errorManager } = params;
    const errorBuilder = errorManager.getErrorBuilder(packageName);
  // eslint-disable-next-line no-unused-expressions
  this.deactive = async function (args, opts = {}) {
    try {
        const [employee] = await dataManipulator.find({
            type: 'EmployeeModel',
            query: { _id: `${args.query.id}` }
        });
        if (!employee) {
            throw errorBuilder.newError('AccountDoesNotExist');
        }
        if (employee.joinedDate === null) {
        if (!employee.status) {
            await dataManipulator.update({
                type: 'EmployeeModel',
                id: `${args.query.id}`,
                data: {status: true, updatedAt: new Date(), joinedDate: args.body.createdDate}
            });
            await dataManipulator.create({
                type: 'DeactiveModel',
                data: {
                    joinedDate: args.body.createdDate,
                    status: true,
                    idEmployee: args.query.id,
                    author: {
                        id: args.accessToken.uuid,
                        phoneNumber: args.accessToken.phoneNumber,
                        email: args.accessToken.email,
                        firstName: args.accessToken.firstName,
                        lastName: args.accessToken.lastName,
                    },
                }
            });
            return {status: 200, msg: 'Updated successfully!'};
        } else {
            await dataManipulator.update({
                type: 'EmployeeModel',
                id: `${args.query.id}`,
                data: {status: false, updatedAt: new Date()}
            });
            await dataManipulator.create({
                type: 'DeactiveModel',
                data: {
                    offedDate: args.body.createdDate,
                    status: false,
                    idEmployee: args.query.id,
                    author: {
                        id: args.accessToken.uuid,
                        phoneNumber: args.accessToken.phoneNumber,
                        email: args.accessToken.email,
                        firstName: args.accessToken.firstName,
                        lastName: args.accessToken.lastName,
                    },
                }
            });
            return {status: 200, msg: 'Updated successfully!'};
            }
        } else {
            if (!employee.status) {
                await dataManipulator.update({
                    type: 'EmployeeModel',
                    id: `${args.query.id}`,
                    data: {status: true, updatedAt: new Date()}
                });
                await dataManipulator.create({
                    type: 'DeactiveModel',
                    data: {
                        joinedDate: args.body.createdDate,
                        status: true,
                        idEmployee: args.query.id,
                        author: {
                            id: args.accessToken.uuid,
                            phoneNumber: args.accessToken.phoneNumber,
                            email: args.accessToken.email,
                            firstName: args.accessToken.firstName,
                            lastName: args.accessToken.lastName,
                        },
                    }
                });
                return {status: 200, msg: 'Updated successfully!'};
            } else {
                await dataManipulator.update({
                    type: 'EmployeeModel',
                    id: `${args.query.id}`,
                    data: {status: false, updatedAt: new Date()}
                });
                await dataManipulator.create({
                    type: 'DeactiveModel',
                    data: {
                        offedDate: args.body.createdDate,
                        status: false,
                        idEmployee: args.query.id,
                        author: {
                            id: args.accessToken.uuid,
                            phoneNumber: args.accessToken.phoneNumber,
                            email: args.accessToken.email,
                            firstName: args.accessToken.firstName,
                            lastName: args.accessToken.lastName,
                        },
                    }
                });
                return {status: 200, msg: 'Updated successfully!'};
                }
        }
    } catch (err) {
        return Promise.reject(err);
    }
  };
  this.getInforAuthor = async function (args) {
    const arrAuthor = [];
    try {
        const authors = await dataManipulator.find({
            type: 'DeactiveModel',
            query: { idEmployee: `${args.id}`}
        });
        if (authors) {
            authors.map(results => {
                if (results.status) {
                    arrAuthor.push({ joinedDate: results.joinedDate, status: results.status, statusCretead: true, createdAt: results.createdAt, author: {
                        id: results.author.id,
                        phoneNumber: results.author.phoneNumber,
                        email: results.author.email,
                        firstName: results.author.firstName,
                        lastName: results.author.lastName
                      }});
                } else {
                    arrAuthor.push({ joinedDate: results.offedDate, status: results.status, statusCretead: true, createdAt: results.createdAt, author: {
                        id: results.author.id,
                        phoneNumber: results.author.phoneNumber,
                        email: results.author.email,
                        firstName: results.author.firstName,
                        lastName: results.author.lastName
                      }});
                }
            });
            var result = lodash.last(arrAuthor);
        };
        return {
            returnCode: 0, author: {
                id: result.author.id,
                phoneNumber: result.author.phoneNumber,
                email: result.author.email,
                firstName: result.author.firstName,
                lastName: result.author.lastName,
            }, createdAt: moment(result.createdAt).format('YYYY-MM-DDTHH:mm'), statusCretead: true, status: result.status, joinedDate: moment(result.joinedDate).format('YYYY-MM-DDTHH:mm')
        };
    } catch (err) {
        return ({
            returnCode: 200, msg: "No History Information Author",
            statusCretead: false
        });
    }
  };
};

Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
  errorManager: 'app-errorlist/manager'
};

module.exports = Service;
