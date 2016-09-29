var mysql   =   require("mysql");
var bcrypt  =   require("bcrypt");
var hat =   require("hat");

function AccountModel() {
    
}


AccountModel.prototype.login    =   function(req){
    
    return new Promise(function(resolve,reject){
        var sql =   "SELECT * from users WHERE  email   =   ?";
        var inserts =   [req.payload.email];
        sql =   mysql.format(sql,inserts);
        console.log(sql);
        connection.query(sql,function(err,rows){
                if (err) {
                    reject(err);
                }
                if (rows.length > 0) {
                    bcrypt.compare(req.payload.password,rows[0].password,function(err,res){
                        if(err){
                            reject(err);
                        }
                        if (res === true) {
                            if(rows[0].hasOwnProperty(access_token) && rows[0].access_token !== ''){
                                resolve({"access_token":rows[0].access_token});
                            }else{
                                var access_token = hat();
                                var sql = "UPDATE users SET access_token = ? WHERE id = ?";
                                var inserts = [access_token,rows[0].id];
                                sql = mysql.format(sql,inserts);
                                connection.query(sql,function(err){
                                   if(err){
                                        reject(err);
                                    }
                                    resolve({'access_token':access_token});
                                });
                            }
                        }else{
                            reject("Invalid password");
                        }
                    });
                }else{
                    reject("User does not exist");
                }
            });     
    });
    
    
};

AccountModel.prototype.logout = function(userId){
    return new Promise(function(resolve,reject){
        var sql = "UPDATE users SET `access_token` = null WHERE id = ?";
        var inserts = [userId];
        sql = mysql.format(sql,inserts);
        connection.query(sql,function(error){
           if(error){
                reject(error);
            }
            resolve({"message" : "User logged out successfully"});
        });
    });
}



module.exports  =   AccountModel;