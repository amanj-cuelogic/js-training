var Hapi    =   require("hapi");
var mysql   =   require("mysql");
var Blipp   =   require("blipp");
var model   =   require("./models");

var AppRoutes   =   require("./routes.js");
//var Joi =   require("joi");
var Boom    =   require("boom");


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

//server.ext('onPreHandler',function(request,reply){
//    var access_token    =   request.params.access_token;
//    if (access_token !== undefined && request.params.access_token !== '') {
//         model.accountmodel.validateToken(access_token);           
//    }else{
//         reply(Boom.badRequest("Access token is missing"));
//    }
//   
//});

server.register([
        Blipp,
        AppRoutes
    ],(err)=>{
        server.start((err)=>{
            if (err) {
                throw err;
            }
            console.log("Sever is running at ",server.info.uri);
        });
});

