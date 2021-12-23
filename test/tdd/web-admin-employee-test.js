const liberica = require('liberica');
const { mockit, assert, sinon } = liberica;
const path = require('path');

describe('web-admin-employee', function () {
  let webAdminEmployee = mockit.acquire('web-admin-employee', {
    moduleHome: path.join(__dirname, '../../lib/services')
  });

  let slugFunc = mockit.acquire('slugfunc', {
    moduleHome: path.join(__dirname, '../../lib/utils')
  });

  describe('slugFunction', function () {
    let slugFunction = mockit.get(slugFunc, 'slugFunction');
    assert.isFunction(slugFunction);
    it('Should be return "pham-minh-oanh" if firstName, lastName equal "oanh", "phạm minh"', function () {
      assert.deepEqual(slugFunction("oanh", "phạm minh"), "pham-minh-oanh");
    });
    it('Should be return "le-nam" if firstName, lastName equal "Nam", "Lê"', function () {
      assert.deepEqual(slugFunction("Nam", "Lê"), "le-nam");
    });
  });

  describe('isEmptyObject', function () {
    let isEmptyObject = mockit.get(webAdminEmployee, 'isEmptyObject');
    assert.isFunction(isEmptyObject);
    it('Should be return true if args equal {}', function () {
      assert.deepEqual(isEmptyObject({}), true);
    });
    it('Should be return false if args equal {"firstName":"Le Nam"}', function () {
      assert.deepEqual(isEmptyObject({ "firstName": "Le Nam" }), false);
    });
  });

  describe('removeSpace', function () {
    let removeSpace = mockit.get(webAdminEmployee, 'removeSpace');
    assert.isFunction(removeSpace);
    it('Should be return "minh oanh" if str equal "     minh    oanh    "', function () {
      assert.deepEqual(removeSpace("     minh    oanh    "), "minh oanh");
    });
    it('Should be return "Le Nam" if str equal "Le                 Nam"', function () {
      assert.deepEqual(removeSpace("Le                 Nam"), "Le Nam");
    });
    it('Should be return "martin" if str equal "martin"', function () {
      assert.deepEqual(removeSpace("martin"), "martin");
    });
    it('Should be return "phạm minh oanh" if str equal "    phạm       minh        oanh       "', function () {
      assert.deepEqual(removeSpace("    phạm       minh        oanh       "), "phạm minh oanh");
    });
    it('Should be return "hoàng thị ái hoài" if str equal "hoàng       thị ái      hoài   "', function () {
      assert.deepEqual(removeSpace("hoàng       thị ái      hoài   "), "hoàng thị ái hoài");
    });
  });

  describe('isPropertyEmpty', function () {
    let isPropertyEmpty = mockit.get(webAdminEmployee, 'isPropertyEmpty');
    assert.isFunction(isPropertyEmpty);
    it('Should be return false if args equal {"firstName":"Minh Oanh"}', function () {
      assert.deepEqual(isPropertyEmpty({ "firstName": "Minh Oanh" }), false);
    });
    it('Should be return true if args equal {"firstName":""}', function () {
      assert.deepEqual(isPropertyEmpty({ "firstName": "" }), true);
    });
    it('Should be return true if args equal {"firstName":"Le Nam", "lastName":"Nguyen", "phoneNumber":"0693251456", "email":""}', function () {
      assert.deepEqual(isPropertyEmpty({ "firstName": "Le Nam", "lastName": "Nguyen", "phoneNumber": "0693251456", "email": "" }), true);
    });
  });
  describe('convertToRegexp', function () {
    let convertToRegexp = mockit.get(webAdminEmployee, 'convertToRegexp');
    assert.isFunction(convertToRegexp);
    it('Should be return [dđ][uúùủũụưứừửữự]c ', function () {
      assert.deepEqual(convertToRegexp('Duc'),
        { '$regex': new RegExp('[dđ][uúùủũụưứừửữự]c', 'i') });
    });
    it('Should be return  ', function () {
      assert.deepEqual(convertToRegexp('Oanh'),
        { '$regex': new RegExp('[oóòỏõọôốồổỗộơớờởỡợ][aáàảãạăắằẳẵặâấầẩẫậ]nh', 'i') });
    });
  });
  describe('convertPhone', function () {
    let convertPhone = mockit.get(webAdminEmployee, 'convertPhone');
    assert.isFunction(convertPhone);
    it('+84935449848 Should be return 0  ', function () {
      assert.deepEqual(convertPhone('+84935449848'),
        { '$regex': new RegExp('(\\+84|84|0)935449848', 'i') }
      );
    });
    it('84935449848 Should be return 0935449848  ', function () {
      assert.deepEqual(convertPhone('84935449848'),
        { '$regex': new RegExp('(\\+84|84|0)935449848', 'i') }
      );
    });
    it(' 0935449848 Should be return 0935449848  ', function () {
      assert.deepEqual(convertPhone('0935449848'),
        { '$regex': new RegExp('(\\+84|84|0)935449848', 'i') }
      );
    });
  });

  describe('convertStatus', function () {
    let convertStatus = mockit.get(webAdminEmployee, 'convertStatus');
    assert.isFunction(convertStatus);
    it('Should be return true if status equal "true"', function () {
      assert.deepEqual(convertStatus("true"), true);
    });
    it('Should be return true if status equal "True"', function () {
      assert.deepEqual(convertStatus("True"), true);
    });
    it('Should be return true if status equal "TRUE"', function () {
      assert.deepEqual(convertStatus("TRUE"), true);
    });
    it('Should be return true if status equal 1', function () {
      assert.deepEqual(convertStatus(1), true);
    });
    it('Should be return true if status equal "1"', function () {
      assert.deepEqual(convertStatus("1"), true);
    });
    it('Should be return true if status equal "false"', function () {
      assert.deepEqual(convertStatus("false"), false);
    });
    it('Should be return true if status equal 0', function () {
      assert.deepEqual(convertStatus(0), false);
    });
    it('Should be return true if status equal "0"', function () {
      assert.deepEqual(convertStatus("0"), false);
    });
    it('Should be return true if status equal "False"', function () {
      assert.deepEqual(convertStatus("False"), false);
    });
    it('Should be return true if status equal "False"', function () {
      assert.deepEqual(convertStatus("FALSE"), false);
    });
  });

  describe('editEmployeesFunc', function () {
    let editEmployeesFunc = mockit.get(webAdminEmployee, 'editEmployeesFunc');
    assert.isFunction(editEmployeesFunc);

    let ctx = {
      dataManipulator: {
        find: sinon.stub()
          // .callsFake(() => Promise.resolve(
          //   []
          // ))
          .onFirstCall()
          .returns([
            {
              id: '1',
              firstName: 'Minh',
              lastName: 'Nguyễn',
              phoneNumber: '0935348581',
              birthDay: '2020-10-12',
              email: 'minh@gmail.com',
              province: 0,
              district: 2,
              userName: "john@github.com",
              gender: 0,
              role: "admin"
            },
            {
              id: '2',
              firstName: 'MinhPham',
              lastName: 'Van',
              phoneNumber: '0857875234',
              birthDay: '2020-10-24',
              email: 'minh@gmail.com',
              province: 0,
              district: 2,
              userName: "john@github.com",
              gender: 0,
              role: "admin"
            }
          ]
          )
          .onSecondCall()
          .returns(
            []
          )
      },
    };
    it('Should be return error Phone number can not be empty!', async function () {
      let args = {
        firstName: "oanh",
        lastName: "pham",
        email: "oanhpham41121@gmail.com",
        birthDay: "02/24/1995",
        province: 0,
        district: 2,
        userName: "john@github.com",
        gender: 0,
        role: "admin"
      };

      let error = await editEmployeesFunc(args, ctx.dataManipulator);

      const { dataManipulator } = ctx;

      assert.deepEqual(dataManipulator.find.called, false);

      assert.deepEqual(error, {
        status: 400,
        msg: "Phone number can't be empty!"
      });
    });

    it("Should be return error Duplicate phone!", async function () {
      let args = {
        id: "1",
        phoneNumber: "0857875234",
        firstName: "oanh",
        lastName: "pham",
        email: 'minh@gmail.com',
        userName: "john@github.com",
        role: "admin"
      };

      let data1 = await editEmployeesFunc(args, ctx.dataManipulator);

      const { dataManipulator } = ctx;

      assert.deepEqual(dataManipulator.find.called, true);

      assert.deepEqual(data1, {
        status: 400,
        msg: "Duplicate phone!"
      });
    });

    it("Should be return error Information can't be empty", async function () {
      let args = {
        phoneNumber: "0857875232"
      };

      let data1 = await editEmployeesFunc(args, ctx.dataManipulator);

      const { dataManipulator } = ctx;

      assert.deepEqual(dataManipulator.find.called, true);

      assert.deepEqual(data1, {
        status: 400,
        msg: "Information can't be empty!"
      });
    });
  });

  describe('searchEmployeesFunc', function () {
    let searchEmployeesFunc = mockit.get(webAdminEmployee, 'searchEmployeesFunc');
    assert.isFunction(searchEmployeesFunc);

    it('Should be return data and total with not page in params ', async function () {
      let ctx = {
        dataManipulator: {
          find: sinon.stub().callsFake(() => Promise.resolve(
            [
              {
                id: '1',
                firstName: 'Minh',
                lastName: 'Nguyễn',
                phoneNumber: '0935348581',
                gender: '0',
                birthDay: '2020-10-10',
                email: 'minh@gmail.com'
              },
              {
                id: '2',
                firstName: 'Minh 1',
                lastName: 'Nguyễn 1',
                phoneNumber: '0935348582',
                birthDay: '2020-09-10',
                email: 'minh1@gmail.com'
              }
            ]
          ))
        },
      };
      let args = {
        params: {
          status: 1,
          limit: 5
        }
      };
      let filter = {
        status: true
      };
      await searchEmployeesFunc(args, ctx.dataManipulator);
      const { dataManipulator } = ctx;
      assert.deepEqual(dataManipulator.find.called, true);

      let findEmployees = await dataManipulator.find.args[0][0];
      assert.deepEqual(findEmployees, {
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
          limit: 5
        }
      });

      let employees = await dataManipulator.find();
      assert.deepEqual(employees, [
        {
          id: '1',
          firstName: 'Minh',
          lastName: 'Nguyễn',
          phoneNumber: '0935348581',
          gender: '0',
          birthDay: '2020-10-10',
          email: 'minh@gmail.com'
        },
        {
          id: '2',
          firstName: 'Minh 1',
          lastName: 'Nguyễn 1',
          phoneNumber: '0935348582',
          birthDay: '2020-09-10',
          email: 'minh1@gmail.com'
        }
      ]);
    });
  });

  describe('getEmployeebyId', function () {
    let getEmployeebyId = mockit.get(webAdminEmployee, 'getEmployeebyId');
    assert.isFunction(getEmployeebyId);

    it.only('Should be return employees ', async function () {
      let ctx = {
        dataManipulator: {
          findOne: sinon.stub().callsFake(() => Promise.resolve(
            [
              {
                id: '1',
                firstName: 'Minh',
                lastName: 'Nguyễn',
                phoneNumber: '0935348581',
                gender: '0',
                birthDay: '2020-10-10',
                email: 'minh@gmail.com'
              },
            ]
          ))
        },
      };
      let args = {
        id: '1'
      };
      let _id = { _id: args.id }
      await getEmployeebyId(args, ctx.dataManipulator);
      const { dataManipulator } = ctx;
      assert.deepEqual(dataManipulator.findOne.called, true);

      let findEmployees = await dataManipulator.findOne.args[0][0];
      assert.deepEqual(findEmployees, {
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

      let employees = await dataManipulator.findOne();
      assert.deepEqual(employees,
        [
          {
            id: '1',
            firstName: 'Minh',
            lastName: 'Nguyễn',
            phoneNumber: '0935348581',
            gender: '0',
            birthDay: '2020-10-10',
            email: 'minh@gmail.com'
          },
        ]

      );
    });
  });
});
