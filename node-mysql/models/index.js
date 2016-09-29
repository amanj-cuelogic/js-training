var mysql   =   require("mysql");

var UserModel = require("./user-model.js");
var AccountModel    =   require("./account-model.js");

exports.usermodel = new UserModel();
exports.accountmodel    =   new AccountModel();