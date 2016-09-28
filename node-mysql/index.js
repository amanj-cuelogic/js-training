var Hapi    =   require("hapi");
//var mysql   =   require("mysql");
var Blipp   =   require("blipp");
var UserModel   =   require("./models/user-model.js");
var AppRoutes   =   require("./routes.js");
//var Joi =   require("joi");
//var Boom    =   require("boom");


var server  =   new Hapi.Server();

server.connection({
    host    :   "localhost",
    port    :   8000
});



server.register([
        Blipp,
        UserModel,
        AppRoutes
    ],(err)=>{
        server.start((err)=>{
            if (err) {
                throw err;
            }
            console.log("Sever is running at ",server.info.uri);
        });
});

