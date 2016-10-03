var mysql   =   require("mysql");
//var bcrypt  =   require("bcrypt");
var jwt = require('jsonwebtoken');
var promise   = require("bluebird");
promise.promisifyAll(require("mysql/lib/Connection").prototype);
var bcrypt = promise.promisifyAll(require("bcrypt"));

function AccountModel() {
    
}


AccountModel.prototype.login    =   function login(req,callback){
    
        var sql =   "SELECT * from users WHERE  email   =   ?";
        var inserts =   [req.payload.email];
        sql =   mysql.format(sql,inserts);
        connection.queryAsync(sql).then(function(rows){
                
            if (rows.length) {
                bcrypt.compareAsync(req.payload.password,rows[0].password).then(function(response){
                    
                    if (response === true) {
                        if(rows[0].hasOwnProperty("access_token") && rows[0].access_token){
                            jwt.verify(rows[0].access_token,privateKey,function(err){
                                if(err){
                                    var token = jwt.sign({ id: rows[0].id , iat : Date.now() + 48*3600*60 }, privateKey, { algorithm: 'HS256'} );
                                    callback(null,{"access_token":token});
                                }
                                callback(null,{"access_token":rows[0].access_token});
                            });
                            
                            
                        }else{
                            //var access_token = hat();
                            var token = jwt.sign({ id: rows[0].id , iat : Date.now() + 48*3600*60 }, privateKey, { algorithm: 'HS256'} );
                            var sql = "UPDATE users SET access_token = ? WHERE id = ?";
                            var inserts = [token,rows[0].id];
                            sql = mysql.format(sql,inserts);
                            connection.queryAsync(sql).then(function(){
                               callback(null,{'access_token':token});
                            },function(error){
                                callback(error);
                            });
                        }
                    }else{
                        callback("Invalid password");
                    }
                },function(error){
                    callback(error);    
                });
            }else{
                callback("User does not exist");
            }
        },function(error){
            callback(error);    
        });     
    
};

AccountModel.prototype.logout = function logout(userId,callback){
    
        var sql = "UPDATE users SET `access_token` = null WHERE id = ?";
        var inserts = [userId];
        sql = mysql.format(sql,inserts);
        connection.queryAsync(sql).then(function(){
            callback(null,{"message" : "User logged out successfully"});
        },function(error){
            callback(error);    
        });
    
};



module.exports  =   AccountModel;