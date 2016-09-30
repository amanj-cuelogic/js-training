var Hapi    =   require("hapi");
var mysql   =   require("mysql");
var Blipp   =   require("blipp");
//var model   =   require("./models");
var hapiauthjwt = require('hapi-auth-jwt');
var AppRoutes   =   require("./routes");
//var Joi =   require("joi");
var jwt = require('jsonwebtoken');
//var Boom    =   require("boom");


var server  =   new Hapi.Server();

server.connection({
    host    :   "localhost",
    port    :   8000
});


global.connection =   mysql.createConnection({
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

global.privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';


var validate = function (request, decodedToken, callback) {
    var error,
        credentials = decodedToken || {};
    console.log(decodedToken);
    if (!credentials) {
        return callback(error, false, credentials);
    }

    return callback(error, true, credentials);
};

server.register([
        { register : Blipp, options : {showAuth : true}},
        hapiauthjwt,
    ],function (err){
        server.auth.strategy('token', 'jwt', {
            key: privateKey,
            validateFunc: validate,
            verifyOptions: { algorithms: [ 'HS256' ] }  // only allow HS256 algorithm
        });
        server.auth.default('token');
        server.route(AppRoutes);
        server.start((err)=>{
            if (err) {
                throw err;
            }
            console.log("Sever is running at ",server.info.uri);
        });
});

