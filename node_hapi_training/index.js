'use strict';

const Hapi = require("hapi");
const Blipp = require("blipp");
const mongoose = require('mongoose');
//const HapiLevel = require("hapi-level");
//const Hello =   require("./hello.js");
//const UserStore = require("./user-store.js");
const server = new Hapi.Server();
const User = require('./user-model.js');

mongoose.connect("mongodb://localhost/test");
   

server.connection({
   host :   "localhost" ,
   port :   8000
});

server.route({
        method  :   'GET',
        path    :   '/users/{name}',
        handler : function(req,reply){
            User.findOne({name : req.params.name},(error,user)=>{
                if(error){
                    throw error;    
                }
                return reply(user); 
            });
            
        }
});
server.route({
        method  :   'POST',
        path    :   '/users/{name}',
        handler : function(req,reply){
            User.create({name : req.params.name},(error,user)=>{
                if(error) {
                    throw error;
                }
                return reply(user);
            });
        }
});

server.register([
    Blipp
    ],
    { routes : {
            prefix : '/v1'
        }
    },(err)  => {
        server.start((err)  =>  {
            if(err){
                 throw   err;
             }
             console.log("Server Running at",server.info.uri);
    });    
});




