var mysql   =   require("mysql");
var bcrypt  =   require("bcrypt");


function UserModel() {
    
}

UserModel.prototype.getAllUsers = function(callback){
              connection.query("SELECT * FROM users",callback);
      };
      
UserModel.prototype.getUser =  function(userId,callback){
              connection.query("SELECT * FROM users WHERE id = ?",[userId],callback);     
      };
      
UserModel.prototype.createUser  =   function(req,callback){
            var password = bcrypt.hashSync(req.payload.password,salt);
            var userData =   [req.payload.first_name.trim(),req.payload.last_name.trim(),req.payload.email,req.payload.phone,password];
            var sql =   "INSERT INTO users (`first_name`,`last_name`,`email`,`phone`,`password`) VALUES (?,?,?,?,?)";
            sql =   mysql.format(sql,userData);
            connection.query(sql,callback);     
      };

UserModel.prototype.updateUser  =   function(req,userId,callback){
       
            var sql =   "UPDATE users SET `first_name` = ?,`last_name` = ?,`email` = ?,`phone` = ? WHERE `id` = ?";
            var inserts =   [req.payload.first_name,req.payload.last_name,req.payload.email,req.payload.phone,userId];
            sql =   mysql.format(sql,inserts);
            connection.query(sql,callback);     
    };
    
UserModel.prototype.deleteUser  =  function(req,callback){
            
            var sql =   "DELETE FROM users WHERE id = ?";
            var inserts =   [req.params.id];
            sql =   mysql.format(sql,inserts);
            connection.query(sql,callback); 
      };
      
      
UserModel.prototype.addFriend = function(user_id,friend_id){
       
       return new Promise(function(resolve,reject){
                var sql = "INSERT INTO friends (`user_id`,`friend_id`) VALUES (?,?)";
                var inserts = [user_id,friend_id];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error){
                        if (error) {
                            reject(error);
                        }
                        resolve(user_id+" is now firend with "+friend_id);
                });
        });
      
};

UserModel.prototype.listFriends = function(user_id){
        
        return new Promise(function(resolve,reject){
                var sql = "SELECT GROUP_CONCAT(friend_id) as friends FROM friends WHERE `user_id` = ?";
                var inserts = [user_id];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error,rows){
                        if(error){
                                reject(error);        
                        }
                        if (rows[0].friends !== null) {
                                //var friends = rows[0].friends.split(',');
                                var sql = "SELECT DISTINCT(users.id), CONCAT(users.first_name,' ',users.last_name) as name, users.email, users.phone  FROM friends JOIN users ON users.id IN ("+rows[0].friends+")";
                                //var inserts = [rows[0].friends];
                                //sql = mysql.format(sql,inserts);
                                connection.query(sql,function(error,rows){
                                        if(error){
                                                reject(error);        
                                        }
                                        resolve(rows);
                                });
                        }else{
                            rows[0].friends = 0;    
                            resolve(rows);
                        }
                });
        });      
};

UserModel.prototype.searchFriend = function(user_id,query_string){
        
        return new Promise(function(resolve,reject){
                var sql = "SELECT GROUP_CONCAT(friend_id) as friends FROM friends WHERE `user_id` = ?";
                var inserts = [user_id];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error,rows){
                        if(error){
                                reject(error);        
                        }
                        if (rows[0].friends !== null) {
                                var sql = "SELECT DISTINCT(users.id), CONCAT(users.first_name,' ',users.last_name) as name, users.email, users.phone  FROM friends JOIN users ON users.id IN ("+rows[0].friends+") WHERE users.first_name LIKE \""+query_string+"%\" OR users.last_name LIKE \""+query_string+"%\"";
                                connection.query(sql,function(error,rows){
                                        if(error){
                                                reject(error);        
                                        }
                                        resolve(rows);
                                });
                        }else{
                            rows[0].friends = 0;    
                            resolve(rows);
                        }
                });
        });      
};

UserModel.prototype.deleteFriend = function(user_id,friend_id){
        
        return new Promise(function(resolve,reject){
                var sql = "DELETE FROM friends WHERE user_id = ? AND friend_id = ?";
                var inserts = [user_id,friend_id];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error,rows){
                        if(error){
                                reject(error);
                        }
                        if (rows.affectedRows !== 0) {
                                resolve(rows);    
                        }else{
                                reject("User Relation doesn't exist.");
                        }
                        
                });
        });      
};

UserModel.prototype.viewFriend = function(user_id,friend_id){
        
        return new Promise(function(resolve,reject){
                var sql = "SELECT DISTINCT(u.id),CONCAT(u.first_name,' ',u.last_name) as name, u.phone, u.email FROM users as u JOIN  friends as f ON u.id = f.friend_id WHERE f.user_id = ? AND f.friend_id = ?";
                var inserts = [user_id,friend_id];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error,rows){
                        if(error){
                                reject(error);
                        }
                        if (rows.length > 0) {
                                resolve(rows);    
                        }else{
                                reject("User Relation doesn't exist.");
                        }
                        
                });
        });      
};

UserModel.prototype.validateToken = function(token){
        return new Promise(function(resolve,reject){
                var sql = "SELECT id FROM users WHERE access_token = ?";
                var inserts = [token];
                sql = mysql.format(sql,inserts);
                connection.query(sql,function(error,rows){
                        if(error){
                                reject(error);
                        }
                        if (rows.length > 0) {
                            resolve(rows[0].id);
                        }else{
                            reject("Invalid access token.");
                        }
                        
                });
        });
};

module.exports  =   UserModel;