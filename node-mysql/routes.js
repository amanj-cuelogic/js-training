var Joi =   require("joi");
var Boom    =   require("boom");
var model   =   require("./models");
var bcrypt  =   require("bcrypt");

global.salt    =   bcrypt.genSaltSync(10);

//var User = require('./models/user-model.js');
const pre1 = function(request,reply){
    model.usermodel.validateToken(request.headers.token).then(function(response){
            reply(response);
        },
        function(error){
            reply(Boom.unauthorized(error)).takeover();
        });
};

exports.register    =   function(server,options,next){
  
    var userSchema  =   Joi.object().keys({
        first_name  :   Joi.string().min(2).max(10).regex(/^[a-zA-Z ]*$/).required(),
        last_name  :   Joi.string().min(3).max(10).regex(/^[a-zA-Z ]*$/).required(),
        email  :   Joi.string().email(),
        phone   :  Joi.number().required(),
        password    :   Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        meta    :   Joi.object()
    });
    
    server.route([
    {
        method  :   "GET",
        path    :   "/users",
        config  : {
            pre :   [
                { method : pre1 }
            ],
            handler :   function(req,rep){
                model.usermodel.getAllUsers((err,data)=>{
                    if (err) {
                        return rep(Boom.badRequest(err));
                    }
                    rep(data);
                });
            }
        }
        
        
        
    },
    {
        method  :   "GET",
        path    :   "/userdetails",
        handler :   function(req,rep){
            
            var userId = req.pre.user_id;
            model.usermodel.getUser(userId,(err,data)=>{
                if (err) {
                    return rep(Boom.badRequest(err));
                }
                rep(data);
            });
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ]
        }
    },
    {
        method  :   "POST",
        path    :   "/users",
        handler :   function(req,rep){
                        model.usermodel.createUser(req,(err,data)=>{
                            if (err) {
                                return rep(Boom.badRequest(err));
                            }
                            rep(data);
                        });    
                
        },
        config  :   {
            validate    :   {
                
                query   :   false,
                params  :  false,
                payload :   userSchema
            }
        }
    },
    {
        method  :   "DELETE",
        path    :   "/users/{id}",
        handler :   function(req,rep){
            model.usermodel.deleteUser(req,function(err,data){
                if (err) {
                    return rep(Boom.badRequest(err));
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
        path    :   "/userupdate",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.updateUser(req,userId,(err,data)=>{
                        if (err) {
                            return rep(Boom.badRequest(err));
                        }
                        rep(data);
                    });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ],
            validate    :   {
                payload :   userSchema
            }
        }
    },
    {
        method  :   "POST",
        path    :   "/login",
        handler :   function(req,rep){
                    model.accountmodel.login(req).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.unauthorized(error));
                        });  
            
        },
        config  :   {
            validate    :   {
                payload :   {
                    email   :   Joi.string().email().required(),
                    password    :   Joi.string().required()
                }
            }
        }
    },
    {
        method  :   "GET",
        path    :   "/logout",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.accountmodel.logout(userId).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.unauthorized(error));
                        });  
            
        }
        
    },
    {
        method  :   "POST",
        path    :   "/addfriend",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.addFriend(userId,req.payload.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.unauthorized(error));
                        });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ],
            validate    :   {
                payload :   {
                    friend_id   :   Joi.number().required()
                    
                }
            }
        }
    },
    {
        method  :   "GET",
        path    :   "/listfriend",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.listFriends(userId).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ]
        }
    },
    {
        method  :   "GET",
        path    :   "/search/{query_string}",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.searchFriend(userId,req.params.query_string).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ],
            validate    :   {
                params :   {
                    query_string   :   Joi.string().required()
                    
                }
            }
        }
    },
    {
        method  :   "DELETE",
        path    :   "/deletefriend/{friend_id}",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.deleteFriend(userId,req.params.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ],
            validate    :   {
                params :   {
                    friend_id   :   Joi.number().required()
                }
            }
        }
    },
    {
        method  :   "GET",
        path    :   "/viewfriend/{friend_id}",
        handler :   function(req,rep){
                    var userId = req.pre.user_id;
                    model.usermodel.viewFriend(userId,req.params.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            pre :   [
                { method : pre1,assign:'user_id' }
            ],
            validate    :   {
                params :   {
                    friend_id   :   Joi.number().required()
                    
                }
            }
        }
    }
    
    ]);

    return next();
};
exports.register.attributes = {
    name    :   "AppRoutes"
};