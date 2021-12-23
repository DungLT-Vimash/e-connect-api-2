/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-promise-reject-errors */
'use strict';

const Devebot = require('devebot');
const Promise = Devebot.require('bluebird');
const { isEmpty, camelCase, assign } = Devebot.require('lodash');
const bcrypt = require('bcrypt');
const slgF = require('../utils/slugfunc');
const slugify = require('slugify');
const moments = require('moment');
const slug = require('slug');

function Service (params = {}) {
  const { dataManipulator, packageName, errorManager } = params;
  const errorBuilder = errorManager.getErrorBuilder(packageName);

  this.createEmployees = async function (args, opts) {
    try {
      // Kiem tra xem sdt da co trong db hay chua
      let [employee] = await dataManipulator.find({
        type: 'EmployeeModel',
        query: { phoneNumber: `${args.phoneNumber}` }
      });
      // Neu so dien thoai chua co trong db
      if (employee == null) {
        // Kiem tra xem gmail co trong db hay chua
        let [email] = await dataManipulator.find({
          type: 'EmployeeModel',
          query: { email: `${args.email}` }
        });
        if (email == null) {
          // Kiem tra firstName,lastName,province,district co de trong hay khong
          if (isEmpty(camelCase(args.firstName)) || isEmpty(camelCase(args.lastName))) {
            throw errorBuilder.newError('InformationIsAllWhiteSpace');
          }
          // Kiem tra xem sdt co phai so dien thoai viet nam khong
          const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
          if (!isVNPhoneMobile.test(args.phoneNumber)) {
            throw errorBuilder.newError('PhoneIncorrect');
          }
          // Kiem tra email co hop le hay khong
          const isEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
          if (!isEmail.test(args.email)) {
            throw errorBuilder.newError('EmailIncorrect');
          } else {
            let slug = slugFunction(args.firstName, args.lastName);
            await dataManipulator.create({
              type: 'EmployeeModel',
              data: {
                firstName: args.firstName,
                lastName: args.lastName,
                slug: slug,
                birthDay: args.birthDay,
                phoneNumber: args.phoneNumber,
                email: args.email,
                password: bcrypt.hashSync(args.password, 10),
                province: args.province,
                district: args.district,
                gender: args.gender
              }
            });
            return { status: 200, msg: "Create Successfully!" };
          }
        } else {
          throw errorBuilder.newError('DuplicateEmailRegister');
        }
        // eslint-disable-next-line brace-style
      }
      // Neu so dien thoai da co trong db
      else {
        throw errorBuilder.newError('DuplicatePhoneRegister');
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };
  function slugFunction(firstName, lastName) {
    let fullName = firstName + ' ' + lastName;
    return slug(fullName);
  }
  this.editEmployees = async function (args, opts) {
    try {
      if (!isEmptyObject(args)) {
        if (!isPropertyEmpty(args)) {
          if (!isEmpty(camelCase(args.phoneNumber))) {
            const checkNumber = await dataManipulator.find({
              type: 'EmployeeModel',
              query: { phoneNumber: args.phoneNumber }
            });
            if (checkNumber.length > 0 && args.id != checkNumber[0]._id) {
              return { status: 400, msg: "Duplicate phone!" };
            }
            else {
              if (isEmpty(camelCase(args.firstName)) || isEmpty(camelCase(args.lastName)) || isEmpty(camelCase(args.email)) || isEmpty(camelCase(args.password)) || isEmpty(camelCase(args.userName)) || isEmpty(camelCase(args.gender)) || isEmpty(camelCase(args.province)) || isEmpty(camelCase(args.district))) {
                return Promise.reject({ message: "Information can't be empty!" });
              }
              const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
              if (!isVNPhoneMobile.test(args.phoneNumber)) {
                throw errorBuilder.newError('PhoneIncorrect');
              }

              const isEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
              if (!isEmail.test(args.email)) {
                throw errorBuilder.newError('EmailIncorrect');
              } else {
                let firstName = removeSpace(args.firstName);
                let lastName = removeSpace(args.lastName);
                let phoneNumber = removeSpace(args.phoneNumber);
                let userName = removeSpace(args.userName);
                let email = removeSpace(args.email);
                let slug = slgF.slugFunction(firstName, lastName);
                await dataManipulator.update({
                  _id: args.id,
                  type: 'EmployeeModel',
                  data: {
                    firstName: firstName,
                    lastName: lastName,
                    birthDay: args.birthDay,
                    phoneNumber: phoneNumber,
                    email: email,
                    userName: userName,
                    province: args.province,
                    district: args.district,
                    gender: args.gender,
                    status: args.status,
                    slug: slug
                  }
                });
                return ({status: 200, msg: 'Update Successfully!'});
              }
            }
          }
          else {
            throw errorBuilder.newError('PhoneNumberCanNotBeEmpty');
          }
        }
        else {
          throw errorBuilder.newError('PropertyIsEmpty');
        }
      }
      else {
        throw errorBuilder.newError('ArgsEmpty');
      }
    }
    catch (err) {
      return Promise.reject(err);
    }
  };

  this.searchEmployees = async function (args, opts) {
    try {
      let filter = {};
      let page = parseInt(args.params._page);
      let limit = parseInt(args.params.limit);

      let phoneNumber = { phoneNumber: convertPhone(args.params.phoneNumber) };
      let status = convertStatus(args.params.status);
      // eslint-disable-next-line eqeqeq
      if (status == undefined || isEmpty(camelCase(status))) {
        status = null;
      } else {
        status = { status: status };
        assign(filter, status);
      }
      if (args.params.fullName == undefined || isEmpty(camelCase(args.params.fullName))) {
        args.params.fullName = null;
      } else {
        let slug = { slug: convertToRegexp(slugify(args.params.fullName)) }
        assign(filter, slug);
      }

      if (isEmpty(camelCase(phoneNumber.phoneNumber) || !phoneNumber.phoneNumber)) {
        phoneNumber = null;
      } else { assign(filter, phoneNumber); }

      // Nếu không truyền page
      if (!page) {
        const data = await dataManipulator.find({
          type: 'EmployeeModel',
          query: filter,
          projection: {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            gender: 1,
            birthDay: 1,
            status: 1,
            email: 1
          },
          options: {
            limit: limit
          }
        });
        const data1 = await dataManipulator.find({
          type: 'EmployeeModel',
        })
        const data2 = await dataManipulator.find({
          type: 'EmployeeModel',
          query: filter,
        })
        return { result: data, searched: data2.length, total: data1.length };
      } else {
        if (page < 1) {
          page = 1;
          let start = (page - 1) * limit;
          let end = start + limit
          const data = await dataManipulator.find({
            type: 'EmployeeModel',
            query: filter,
            projection: {
              firstName: 1,
              lastName: 1,
              phoneNumber: 1,
              gender: 1,
              birthDay: 1,
              status: 1,
              email: 1
            },
          });
          const data1 = await dataManipulator.find({
            type: 'EmployeeModel',
          })
          return { result: data.slice(start, end), searched: data.length, total: data1.length };
        };
        let start = (page - 1) * limit;
        let end = start + limit
        const data = await dataManipulator.find({
          type: 'EmployeeModel',
          query: filter,
          projection: {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            gender: 1,
            birthDay: 1,
            status: 1,
            email: 1
          },
        });
        const data1 = await dataManipulator.find({
          type: 'EmployeeModel',
        })
        return { result: data.slice(start, end), searched: data.length, total: data1.length };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  this.listEmployee = async function (args) {
    try {
      // Neu khong truyen vao so trang thi mac dinh list ra ds trang dau tien gom 8 nguoi
      if (!args.page) {
        // Neu khong truyen so trang
        const data = await dataManipulator.find({
          type: 'EmployeeModel',
          options: {
            skip: 0,
            limit: 8
          }
        });
        let listEmployees = [];
        await data.map(results => {
          let slug = slugFunction(results.firstName, results.lastName);
          listEmployees.push({
            id: results.id,
            firstName: results.firstName,
            lastName: results.lastName,
            slug: slug,
            gender: results.gender,
            phoneNumber: results.phoneNumber,
            birthDay: moments(results.birthDay).format('DD/MM/YYYY'),
            status: results.status,
            joinedDate: results.joinedDate,
            district: results.district,
            province: results.province
          });
        });
        return { returnCode: 0, listEmployee: listEmployees };
      }
      // Neu truyen so trang
      // Tim trong db va phan trang
      const data = await dataManipulator.find({
        type: 'EmployeeModel',
        options: {
          skip: (args.page - 1) * 8,
          limit: 8
        }
      });
      let listEmployees = [];
      await data.map(results => {
        let slug = slugFunction(results.firstName, results.lastName);
        listEmployees.push({
          id: results.id,
          firstName: results.firstName,
          lastName: results.lastName,
          slug: slug,
          gender: results.gender,
          phoneNumber: results.phoneNumber,
          birthDay: moments(results.birthDay).format('DD/MM/YYYY'),
          status: results.status,
          joinedDate: results.joinedDate,
          district: results.district,
          province: results.province
        });
      });
      return { message: "Successfully", listEmployee: listEmployees };
    } catch (err) {
      throw errorBuilder.newError('NoEmployees');
    }
  };

  this.removeEmployeesDuplicate = async function (data) {
    let arrPromises = [];
    for (let i = 0; i < data.length - 1; i++) {
      arrPromises.push(new Promise((resolve) => {
        for (let j = i + 1; j < data.length; j++) {
          if (data[i]._id.equals(data[j]._id) && !data[j].status) {
            data.splice(j--, 1);
          }
          if ((data[i]._id.equals(data[j]._id) && !data[i].status)) {
            data.splice(i++, 1);
          }
        }
        resolve();
      }));
    }
    await Promise.all(arrPromises);
    return data;
  };
  this.getEmployeebyId = async function (args) {
    try {
      let _id = { _id: args.id }
      const data = await dataManipulator.findOne({
        type: 'EmployeeModel',
        query: _id,
        projection: {
          "id": 1,
          "firstName": 1,
          "lastName": 1,
          "birthDay": 1,
          "phoneNumber": 1,
          "province": 1,
          "district": 1,
          "userName": 1,
          "gender": 1,
          "status": 1,
          "email": 1,
          "password": 1
        }
      });
      return { result: data };
    } catch (err) {
      return { msg: "result not fonnd" };
    }
  };
}

async function editEmployeesFunc(args, dataManipulator) {
  try {
    if (!isEmptyObject(args)) {
      if (!isPropertyEmpty(args)) {
        if (!isEmpty(camelCase(args.phoneNumber))) {
          const checkNumber = await dataManipulator.find({
            type: 'EmployeeModel',
            query: { phoneNumber: args.phoneNumber }
          });
          if (checkNumber.length > 0 && args.id != checkNumber[0]._id) {
            return { status: 400, msg: "Duplicate phone!" };
          } else {
            if (isEmpty(camelCase(args.firstName)) || isEmpty(camelCase(args.lastName)) || isEmpty(camelCase(args.email)) || isEmpty(camelCase(args.userName))) {
              return { status: 400, msg: "Information can't be empty!" };
            }
            const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
            if (!isVNPhoneMobile.test(args.phoneNumber)) {
              return Promise.reject({ status: 400, msg: "Invalid phone number!" });
            }
            const isEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
            if (!isEmail.test(args.email)) {
              return Promise.reject({ status: 400, msg: "Invalid email!" });
            } else {
              let firstName = removeSpace(args.firstName);
              let lastName = removeSpace(args.lastName);
              let phoneNumber = removeSpace(args.phoneNumber);
              let userName = removeSpace(args.userName);
              let role = removeSpace(args.role);
              let email = removeSpace(args.email);
              let slug = slgF.slugFunction(firstName, lastName);
              await dataManipulator.update({
                _id: args.id,
                type: 'EmployeeModel',
                data: {
                  firstName: firstName,
                  lastName: lastName,
                  birthDay: args.birthDay,
                  phoneNumber: phoneNumber,
                  email: email,
                  userName: userName,
                  province: args.province,
                  district: args.district,
                  gender: args.gender,
                  role: role,
                  joinedDate: args.joinedDate,
                  status: args.status,
                  slug: slug
                }
              });
              return ({ status: 200, msg: 'Update Successfully!' });
            }
          }
        } else {
          return ({ status: 400, msg: "Phone number can't be empty!" });
        }
      } else {
        return ({ status: 400, msg: 'Property is empty' });
      }
    } else {
      return ({ status: 400, msg: 'Information is empty!' });
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
//for unit test
async function searchEmployeesFunc(args, dataManipulator) {
  try {
    let filter = {};
    let page = parseInt(args.params._page);
    let limit = parseInt(args.params.limit);

    let phoneNumber = { phoneNumber: convertPhone(args.params.phoneNumber) };
    let status = convertStatus(args.params.status);
    // eslint-disable-next-line eqeqeq
    if (status == undefined || isEmpty(camelCase(status))) {
      status = null;
    } else {
      status = { status: status };
      assign(filter, status);
    }
    if (args.params.fullName == undefined || isEmpty(camelCase(args.params.fullName))) {
      args.params.fullName = null;
    } else {
      let slug = { slug: convertToRegexp(slugify(args.params.fullName)) };
      assign(filter, slug);
    }

    if (isEmpty(camelCase(phoneNumber.phoneNumber) || !phoneNumber.phoneNumber)) {
      phoneNumber = null;
    } else { assign(filter, phoneNumber); }

    // Nếu không truyền page
    if (!page) {
      const data = await dataManipulator.find({
        type: 'EmployeeModel',
        query: filter,
        projection: {
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          gender: 1,
          birthDay: 1,
          email: 1
        },
        options: {
          limit: limit
        }
      });
      const data1 = await dataManipulator.find({
        type: 'EmployeeModel',
      });
      const data2 = await dataManipulator.find({
        type: 'EmployeeModel',
        query: filter,
      });
      return { result: data, searched: data2.length, total: data1.length };
    } else {
      if (page < 1) {
        page = 1;
        let start = (page - 1) * limit;
        let end = start + limit;
        const data = await dataManipulator.find({
          type: 'EmployeeModel',
          query: filter,
          projection: {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            gender: 1,
            birthDay: 1,
            email: 1
          },
        });
        const data1 = await dataManipulator.find({
          type: 'EmployeeModel',
        });
        return { result: data.slice(start, end), searched: data.length, total: data1.length };
      };
      let start = (page - 1) * limit;
      let end = start + limit;
      const data = await dataManipulator.find({
        type: 'EmployeeModel',
        query: filter,
        projection: {
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          gender: 1,
          birthDay: 1,
          email: 1
        },
      });
      const data1 = await dataManipulator.find({
        type: 'EmployeeModel',
      });
      return { result: data.slice(start, end), searched: data.length, total: data1.length };
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

// eslint-disable-next-line no-unused-vars
async function listEmployees(args, dataManipulator) {
  try {
    // Neu khong truyen vao so trang thi mac dinh list ra ds trang dau tien gom 8 nguoi
    if (!args.page) {
      // Neu khong truyen so trang
      const data = await dataManipulator.find({
        type: 'EmployeeModel',
        options: {
          skip: 0,
          limit: 8
        }
      });
      let listEmployees = [];
      await data.map(results => {
        listEmployees.push({
          id: results.id,
          firstName: results.firstName,
          lastName: results.lastName,
          gender: results.gender,
          phone: results.phoneNumber,
          birthDay: moments(results.birthDay).format('DD/MM/YYYY'),
          status: results.status,
          joinedDate: results.joinedDate
        });
      });
      return { message: "Successfully", listEmployee: listEmployees };
    }
    // Neu truyen so trang
    // Tim trong db va phan trang
    const data = await dataManipulator.find({
      type: 'EmployeeModel',
      options: {
        skip: (args.page - 1) * 8,
        limit: 8
      }
    });
    let listEmployees = [];
    await data.map(results => {
      listEmployees.push({
        id: results.id,
        firstName: results.firstName,
        lastName: results.lastName,
        gender: results.gender,
        phone: results.phoneNumber,
        birthDay: moments(results.birthDay).format('DD/MM/YYYY'),
        status: results.status,
        joinedDate: results.joinedDate
      });
    });
    return { message: "Successfully", listEmployee: listEmployees };
  } catch (err) {
    // eslint-disable-next-line no-undef
    throw errorBuilder.newError('NoEmployees');
  }
};

function removeSpace(str) {
  let ar = str.split(' ');
  if (ar.length > 1) {
    let strNew = "";
    for (var i = 0; i < ar.length; i++) {
      if (ar[i] !== "") {
        strNew += ar[i] + " ";
      }
    }
    return strNew.trim();
  } else {
    return ar[0];
  }
}

function isEmptyObject(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}

function isPropertyEmpty(obj) {
  for (var key in obj) {
    if (obj[key] === "") {
      return true;
    }
  }
  return false;
}

function convertStatus(status) {
  // eslint-disable-next-line eqeqeq
  if (status == "true" || status == "1" || status == 1 || status == "True" || status == "TRUE") {
    // eslint-disable-next-line no-return-assign
    return status = true;
    // eslint-disable-next-line eqeqeq
  } else if (status == "false" || status == "0" || status == 0 || status == "False" || status == "FALSE") {
    // eslint-disable-next-line no-return-assign
    return status = false;
  }
  // eslint-disable-next-line no-return-assign
  return status = undefined;
}
// Search tên không dấu và viết hoa
function convertToRegexp(text) {
  if (text === undefined) return undefined;
  text = text.replace(/a/g, '[aáàảãạăắằẳẵặâấầẩẫậ]');
  text = text.replace(/A/g, '[aáàảãạăắằẳẵặâấầẩẫậ]');
  text = text.replace(/d/g, '[dđ]');
  text = text.replace(/D/g, '[dđ]');
  text = text.replace(/e/g, '[eéèẻẽẹêếềểễệ]');
  text = text.replace(/E/g, '[eéèẻẽẹêếềểễệ]');
  text = text.replace(/i/g, '[iíìỉĩị]');
  text = text.replace(/I/g, '[iíìỉĩị]');
  text = text.replace(/o/g, '[oóòỏõọôốồổỗộơớờởỡợ]');
  text = text.replace(/u/g, '[uúùủũụưứừửữự]');
  text = text.replace(/y/g, '[yýỳỷỹỵ]');
  text = text.replace(/O/g, '[oóòỏõọôốồổỗộơớờởỡợ]');
  text = text.replace(/U/g, '[uúùủũụưứừửữự]');
  text = text.replace(/Y/g, '[yýỳỷỹỵ]');
  return { '$regex': new RegExp(text, 'i') };
}
function convertPhone(phone) {
  // eslint-disable-next-line eqeqeq
  if (phone == undefined || phone == " ") return undefined;
  phone = phone.replace(/^(\+84|84|0)/g, '(\\+84|84|0)');
  return { '$regex': new RegExp(phone, 'i') };
}

Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
  errorManager: 'app-errorlist/manager'
};

module.exports = Service;
