var mysql   =   require("mysql");


exports.register = function(server,options,next){
    
    var connection =   mysql.createConnection({
        host    :   "localhost",
        user    :   "root",
        password    :   "root",
        database    :   "sampleDB"
     
    });

    connection.connect(function(error){
        if(error){
            throw error;
        }else{
            console.log("Connected to DB");
        }    
    });

    const getAllUsers = function(callback){
              connection.query("SELECT * FROM users",callback);
      };
      
    const getUser = function(userId,callback){
              connection.query("SELECT * FROM users WHERE id = ?",[userId],callback);     
      };
      
    const createUser = function(userData,callback){
        
        var sql =   "INSERT INTO users (`first_name`,`last_name`,`email`,`phone`) VALUES (?,?,?,?)";
        sql =   mysql.format(sql,userData);
        connection.query(sql,callback);     
      };
      
    const updateUser = function(req,callback){
       
        var sql =   "UPDATE users SET `first_name` = ?,`last_name` = ?,`email` = ?,`phone` = ? WHERE `id` = ?";
        var inserts =   [req.payload.first_name,req.payload.last_name,req.payload.email,req.payload.phone,req.params.id];
        sql =   mysql.format(sql,inserts);
        connection.query(sql,callback);     
    };
    
    const deleteUser = function(req,callback){
            
            var sql =   "DELETE FROM users WHERE id = ?";
            var inserts =   [req.params.id];
            sql =   mysql.format(sql,inserts);
            connection.query(sql,callback); 
      };
      
    
    
    server.expose({
      getAllUsers :   getAllUsers,
      getUser   :   getUser,
      createUser    :   createUser,
      updateUser    :   updateUser,
      deleteUser    :   deleteUser
    });
    
    return next();
};
exports.register.attributes  =   {
    name    :   'userModel'
};