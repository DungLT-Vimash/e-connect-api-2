const jwt = require('jsonwebtoken');

let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      phoneNumber: user.phoneNumber,
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: ['admin']
    };
    // Thực hiện ký và tạo token
    jwt.sign(
      userData,
      secretSignature,
      {
        algorithm: "HS512",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      });
  });
};
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};
let generateRefreshToken = (user, secretSignature) => {
  return new Promise((resolve, reject) => {
    const userData = {
      phoneNumber: user.phoneNumber,
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: ['admin']
    };
    // Thực hiện ký và tạo token
    jwt.sign(
      userData,
      secretSignature,
      {
        algorithm: "HS512",
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      });
  });
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
  generateRefreshToken: generateRefreshToken
};
