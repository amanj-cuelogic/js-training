var Joi =   require("joi");
var Boom    =   require("boom");
//var User = require('./models/user-model.js');

exports.register    =   function(server,options,next){
  
    var userSchema  =   Joi.object().keys({
        first_name  :   Joi.string().min(2).max(10).required(),
        last_name  :   Joi.string().min(3).max(10).required(),
        email  :   Joi.string().email(),
        phone   :  Joi.number().required(), 
        meta    :   Joi.object()
    });
    
    server.route([
    {
        method  :   "GET",
        path    :   "/users",
        handler :   function(req,rep){
                 server.plugins.userModel.getAllUsers((err,data)=>{
                    if (err) {
                        rep(Boom.badRequest(err));
                    }
                    rep(data);
                 });
        }
    },
    {
        method  :   "GET",
        path    :   "/users/id/{id}",
        handler :   function(req,rep){
            var userId = req.params.id;
            server.plugins.userModel.getUser(userId,(err,data)=>{
                if (err) {
                    rep(Boom.badRequest(err));
                }
                rep(data);
            });
        },
        config  :   {
            validate    :   {
                params  :   {
                    id  :   Joi.number().required()
                }
            }
        }
    },
    {
        method  :   "POST",
        path    :   "/users",
        handler :   function(req,rep){
                        var inserts =   [req.payload.first_name,req.payload.last_name,req.payload.email,req.payload.phone];
                        server.plugins.userModel.createUser(inserts,(err,data)=>{
                            if (err) {
                                rep(Boom.badRequest(err));
                            }
                            rep(data);
                        });    
                
        },
        config  :   {
            validate    :   {
                query   :   false,
                params  :   false,
                payload :   userSchema
            }
        }
    },
    {
        method  :   "DELETE",
        path    :   "/users/{id}",
        handler :   function(req,rep){
            server.plugins.userModel.deleteUser(req,function(err,data){
                if (err) {
                    rep(Boom.badRequest(err));
                }
                rep(data);
            });
        },
        config  :   {
            validate    :   {
                params  :   {
                    id  :   Joi.number().required()
                }
            }
        }
    }
    ]);
    
    server.route({
        method  :   "POST",
        path    :   "/users/{id}",
        handler :   function(req,rep){
            
                    server.plugins.userModel.updateUser(req,(err,data)=>{
                        if (err) {
                            rep(Boom.badRequest(err));
                        }
                        rep(data);
                    });  
            
        },
        config  :   {
            validate    :   {
                params  :   {
                    id  :   Joi.number().required()
                },
                payload :   userSchema
            }
        }
    });

    return next();
};
exports.register.attributes = {
    name    :   "AppRoutes"
};