const slug = require('slug');

let slugFunction = (firstName, lastName) => {
    let fullName = lastName  + ' ' + firstName;
    return slug(fullName);
};

module.exports = {
    slugFunction: slugFunction
};