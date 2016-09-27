const mongoose = require('mongoose');

var Schema, User;

Schema = mongoose.Schema;
var userSchema = new Schema({
     name : String
 });
 User = mongoose.model('User',userSchema);

module.exports = User;