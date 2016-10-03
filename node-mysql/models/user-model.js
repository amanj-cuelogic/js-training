var bcrypt  =   require("bcrypt");
var mysql = require("mysql");
var promise   = require("bluebird");
promise.promisifyAll(require("mysql/lib/Connection").prototype);

function UserModel() {
    
}


UserModel.prototype.getAllUsers = function getAllUsers(callback){
              
              connection.queryAsync("SELECT id,first_name,last_name,email,phone FROM users").then(function(response){
                                          callback(null,response);
                            },function(error){
                                          callback(error);
              });
              
      };
      
UserModel.prototype.getUser =  function getUser(userId,callback){
              
              connection.queryAsync("SELECT * FROM users WHERE id = ?",[userId]).then(function(response){
                            callback(null,response);
              },function(error){
                            callback(error);              
              });
              
      };
      
UserModel.prototype.createUser  =   function createUser(req,callback){
              
              var password = bcrypt.hashSync(req.payload.password,salt);
              var userData =   [req.payload.first_name.trim(),req.payload.last_name.trim(),req.payload.email,req.payload.phone,password];
              var sql =   "INSERT INTO users (`first_name`,`last_name`,`email`,`phone`,`password`) VALUES (?,?,?,?,?)";
              sql =   mysql.format(sql,userData);
              connection.queryAsync(sql).then(function(response){
                            callback('',response);              
              },function(error){
                            callback(error);
              });                  

      };

UserModel.prototype.updateUser  =   function updateUser(req,userId,callback){
            
              var queryString = '';

              for(var keys in req.payload){
                if (req.payload.hasOwnProperty(keys)) {
                   if (keys == "password") {
                            queryString += "`"+keys+"` = '"+bcrypt.hashSync(req.payload[keys],salt)+"',";
                   }else{
                            queryString += "`"+keys+"` = '"+req.payload[keys]+"',";         
                   }
                   
                }
              }
              if (queryString !== '') {
                  queryString = queryString.slice(0,-1);
                  var sql =   "UPDATE users SET "+queryString+" WHERE id = ?";
                  var inserts =   [userId];
                  sql =   mysql.format(sql,inserts);
                  connection.queryAsync(sql).then(function(response){
                            callback(null,response);
                  },function(error){
                            callback(error);
                  });     
              }else{
                  callback("Nothing to Update");
              }  


    };
    
UserModel.prototype.deleteUser  =  function deleteUser(userId,callback){
            
              var sql =   "DELETE FROM users WHERE id = ?";
              var inserts =   [userId];
              sql =   mysql.format(sql,inserts);
              connection.queryAsync(sql).then(function(response){
                            callback('',response);
              },function(error){
                            callback(error);              
              });   
            
      };
      
      
UserModel.prototype.addFriend = function addFriend(user_id,friend_id,callback){
       
                var sql = "INSERT INTO friends (`user_id`,`friend_id`) VALUES (?,?)";
                var inserts = [user_id,friend_id];
                sql = mysql.format(sql,inserts);
                connection.queryAsync(sql).then(function(response){
                        callback(null,JSON.stringify(user_id+" is now firend with "+friend_id));
                },function(error){
                        callback(error);    
                });
        
};

UserModel.prototype.listFriends = function listFriends(user_id,callback){
        
              var sql = "SELECT DISTINCT(users.id), CONCAT(users.first_name,' ',users.last_name) as name, users.email, users.phone  FROM users JOIN friends ON users.id = friends.friend_id AND friends.user_id = "+user_id+" ";
              connection.queryAsync(sql).then(function(response){
                           callback(null,response);
              },function(error){
                            callback(error);              
              });
        
};

UserModel.prototype.searchFriend = function searchFriend(user_id,query_string,callback){
        
              var sql = "SELECT DISTINCT(users.id), CONCAT(users.first_name,' ',users.last_name) as name, users.email, users.phone  FROM friends JOIN users ON users.id = friends.friend_id AND friends.user_id = "+user_id+" WHERE users.first_name LIKE \""+query_string+"%\" OR users.last_name LIKE \""+query_string+"%\" ";
              connection.queryAsync(sql).then(function(response){
                      callback(null,response);
              },function(error){
                            callback(error);
              });
      
        
};

UserModel.prototype.deleteFriend = function deleteFriend(user_id,friend_id,callback){
        
              var sql = "DELETE FROM friends WHERE user_id = ? AND friend_id = ?";
              var inserts = [user_id,friend_id];
              sql = mysql.format(sql,inserts);
              connection.queryAsync(sql).then(function(response){
                      if (response.affectedRows !== 0) {
                              callback(null,response);    
                      }else{
                              callback("User Relation doesn't exist.");
                      }
                      
              },function(error){
                            callback(error);
              });
        
};

UserModel.prototype.viewFriend = function viewFriend(user_id,friend_id,callback){
        
              var sql = "SELECT DISTINCT(u.id),CONCAT(u.first_name,' ',u.last_name) as name, u.phone, u.email FROM users as u JOIN  friends as f ON u.id = f.friend_id WHERE f.user_id = ? AND f.friend_id = ?";
              var inserts = [user_id,friend_id];
              sql = mysql.format(sql,inserts);
              connection.queryAsync(sql).then(function(response){
                      
                      if (response.length) {
                              callback(null,response);    
                      }else{
                              callback("User Relation doesn't exist.");
                      }
                      
              },function(error){
                            callback(error);              
              });
      
};



module.exports  =   UserModel;