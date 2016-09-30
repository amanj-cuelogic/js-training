var mysql   =   require("mysql");
var bcrypt  =   require("bcrypt");
//var hat =   require("hat");
var jwt = require('jsonwebtoken');

function AccountModel() {
    
}


AccountModel.prototype.login    =   function(req){
    
    return new Promise(function(resolve,reject){
        var sql =   "SELECT * from users WHERE  email   =   ?";
        var inserts =   [req.payload.email];
        sql =   mysql.format(sql,inserts);
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
                            if(rows[0].hasOwnProperty("access_token") && rows[0].access_token){
                                jwt.verify(rows[0].access_token,privateKey,function(err){
                                    if(err){
                                        var token = jwt.sign({ id: rows[0].id , iat : Date.now() + 48*3600*60 }, privateKey, { algorithm: 'HS256'} );
                                        resolve({"access_token":token});
                                    }
                                    resolve({"access_token":rows[0].access_token});
                                });
                                
                                
                            }else{
                                //var access_token = hat();
                                var token = jwt.sign({ id: rows[0].id , iat : Date.now() + 48*3600*60 }, privateKey, { algorithm: 'HS256'} );
                                var sql = "UPDATE users SET access_token = ? WHERE id = ?";
                                var inserts = [token,rows[0].id];
                                sql = mysql.format(sql,inserts);
                                connection.query(sql,function(err){
                                   if(err){
                                        reject(err);
                                    }
                                    resolve({'access_token':token});
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