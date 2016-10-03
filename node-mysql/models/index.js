var UserModel = require("./user-model.js");
var AccountModel    =   require("./account-model.js");
var promise = require("bluebird");
promise.promisifyAll(UserModel.prototype);

exports.usermodel = new UserModel();
exports.accountmodel    =   new AccountModel();