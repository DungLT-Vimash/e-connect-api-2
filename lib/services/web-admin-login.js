'use strict';

const bcrypt = require('bcrypt');
const jwt = require('../helper/jwtHelper');
const moments = require('moment');

function Service (params = {}) {
    const { dataManipulator, packageName, errorManager, sandboxConfig } = params;
    const errorBuilder = errorManager.getErrorBuilder(packageName);
    const scretToken = sandboxConfig.secretKey;
    const refreshScretToken = sandboxConfig.secretKey;
    const lifeToken = sandboxConfig.lifeToken;
    const arrToken = [];
  // eslint-disable-next-line no-unused-expressions
  this.login = async function (args, opts = {}) {
    try {
      // Kiem tra so dien thoai da co trong db chua
      const [account] = await dataManipulator.find({
        type: 'AdminModel',
        query: { phoneNumber: `${args.phoneNumber}` }
      });
      // Neu so dien thoai chua co trong db
      if (!account) {
        throw errorBuilder.newError('AccountDoesNotExist');
      }
      // So sanh password trong db va password nhap vao
      const checkPassword = await bcrypt.compare(args.password, account.password);
      if (!checkPassword) {
        throw errorBuilder.newError('PasswordIncorrect');
        // eslint-disable-next-line brace-style
      }
      // Neu check thanh cong
      else {
        // Nhung thong tin luu trong access Token jwt
        const dataAccessToken = {
          phoneNumber: account.phoneNumber,
          uuid: account._id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName
        };
        // Nhung thong tin luu trong refresh Token jwt
        const dataRefreshToken = {
          phoneNumber: account.phoneNumber,
          uuid: account._id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName
        };
        // Tao ma accessToken va Refresh Token o file helper
        const moment = new Date();
        const accessToken = await jwt.generateToken(dataAccessToken, scretToken, lifeToken);
        const refreshToken = await jwt.generateRefreshToken(dataRefreshToken, refreshScretToken);
        return {
          message: 'Successfully!', data: {
              access_token: accessToken,
              expired_time: new Date(moment.getTime() + Number(lifeToken)),
              expires_in: Number(lifeToken) / 1000,
            profileUser: {
              id: account._id,
              firstName: account.firstName,
              lastName: account.lastName,
              birthDay: moments(account.birthDay).format('DD/MM/YYYY'),
              phoneNumber: account.phoneNumber,
              email: account.email,
              province: account.province,
              district: account.district
            }, refresh_token: refreshToken
          }
        };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };
  this.refreshToken = async function (args, opts = {}) {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = args.refreshToken;
    if (refreshTokenFromClient) {
      await arrToken.push(refreshTokenFromClient);
      // Kiem tra xem neu refreshToken xuat hien 2 lan thi bao khong hop le
      var result = await arrToken.reduce(function(obj, item) {
        obj[item] = (obj[item] || 0) + 1;
        return obj;
      }, {});
      if (result[refreshTokenFromClient] === 1) {
        try {
          // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
          const decoded = await jwt.verifyToken(refreshTokenFromClient, refreshScretToken);
          // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
          const userData = {
            phoneNumber: decoded.phoneNumber,
            uuid: decoded._id,
            email: decoded.email
          };
          const accessToken = await jwt.generateToken(userData, scretToken, lifeToken);
          const refreshToken = await jwt.generateRefreshToken(userData, refreshScretToken);
          const moment = new Date();
          // gửi token mới về cho người dùng
          return { returnCode: 0, data: {
            access_token: accessToken,
            expired_time: new Date(moment.getTime() + Number(lifeToken)),
            expires_in: Number(lifeToken) / 1000,
            refresh_token: refreshToken,
            token_type: "Bearer" } };
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        throw errorBuilder.newError('token_expired');
      }
    } else {
      // Không tìm thấy token trong request
      throw errorBuilder.newError('refreshTokenIncorrect');
    }
  };
}

Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
  errorManager: 'app-errorlist/manager'
};

module.exports = Service;
