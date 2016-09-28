var Hapi    =   require("hapi");
var mysql   =   require("mysql");
var Blipp   =   require("blipp");

var server  =   new Hapi.Server();

server.connection({
    host    :   "localhost",
    port    :   8000
});


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

server.route({
    method  :   "GET",
    path    :   "/users",
    handler :   function(req,rep){
        connection.query("SELECT * FROM users",function(err,rows,tab){
            if(err){
                throw err;    
            }
            rep(rows);
        });     
    }
});

server.route({
    method  :   "GET",
    path    :   "/users/id/{id}",
    handler :   function(req,rep){
        connection.query("SELECT * FROM users WHERE id = ?",[req.params.id],function(err,rows,tab){
            if(!!err){
                throw err;    
            }
            rep(rows);
        });     
    }
});

server.route({
    method  :   "POST",
    path    :   "/users",
    handler :   function(req,rep){
        var sql =   "INSERT INTO users (`first_name`,`last_name`,`email`,`phone`) VALUES (?,?,?,?)";
        var inserts =   [req.payload.first_name,req.payload.last_name,req.payload.email,req.payload.phone];
        sql =   mysql.format(sql,inserts);
        console.log(sql);
        connection.query(sql,function(err,rows,tab){
            if(!!err){
                throw err;    
            }
            rep(rows);
        });     
    }
});

server.route({
    method  :   "DELETE",
    path    :   "/users/{id}",
    handler :   function(req,rep){
        var sql =   "DELETE FROM users WHERE id = ?";
        var inserts =   [req.params.id];
        sql =   mysql.format(sql,inserts);
        console.log(sql);
        connection.query(sql,function(err,rows,tab){
            if(!!err){
                throw err;    
            }
            rep(rows);
        });     
    }
});

server.route({
    method  :   "POST",
    path    :   "/users/{id}",
    handler :   function(req,rep){
        var sql =   "UPDATE users SET `first_name` = ?,`last_name` = ?,`email` = ?,`phone` = ? WHERE `id` = ?";
        var inserts =   [req.payload.first_name,req.payload.last_name,req.payload.email,req.payload.phone,req.params.id];
        sql =   mysql.format(sql,inserts);
        console.log(sql);
        connection.query(sql,function(err,rows,tab){
            if(!!err){
                throw err;    
            }
            rep(rows);
        });     
    }
});

server.register([
        Blipp
    ],(err)=>{
        server.start((err)=>{
            if (err) {
                throw err;
            }
            console.log("Sever is running at ",server.info.uri);
        });
});

