var Joi =   require("joi");
var Boom    =   require("boom");
var model   =   require("./models");
var bcrypt  =   require("bcrypt");
var promise = require("bluebird");
//var User = require("./models/user-model.js");
promise.promisifyAll(model.usermodel);


global.salt    =   bcrypt.genSaltSync(10);


var userSchema  =   Joi.object().keys({
    first_name  :   Joi.string().min(2).max(10).regex(/^[a-zA-Z ]*$/).required(),
    last_name  :   Joi.string().min(3).max(10).regex(/^[a-zA-Z ]*$/).required(),
    email  :   Joi.string().email(),
    phone   :  Joi.number().required(),
    password    :   Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    meta    :   Joi.object()
});

var userUpdateSchema  =   Joi.object().keys({
    first_name  :  [Joi.string().min(2).max(10).regex(/^[a-zA-Z ]*$/).required()],
    last_name  :   [Joi.string().min(3).max(10).regex(/^[a-zA-Z ]*$/).required()],
    email  :   [Joi.string().email()],
    phone   :  [Joi.number().required()],
    password    :   [Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()],
    meta    :   Joi.object()
});


module.exports = [  

    {
        method  :   "GET",
        path    :   "/users",
        config  : {
            handler :   function(req,rep){
                
                model.usermodel.getAllUsersAsync().then(function(response){
                    rep(response);    
                },function(error){
                    rep(Boom.badRequest(error));
                });
                
            },
            auth : {
                strategy    :   'token'
            }
        }
    },
    {
        method  :   "GET",
        path    :   "/userdetails",
        handler :   function(req,rep){
            
            var userId = req.auth.credentials.id;
            model.usermodel.getUserAsync(userId).then(function(response){
                    rep(response);    
                },function(error){
                    rep(Boom.badRequest(error));
            });
            //
            //model.usermodel.getUser(userId,function(data){
            //        rep(data); 
            //});
        },
    },
    {
        method  :   "POST",
        path    :   "/users",
        handler :   function(req,rep){
            
                model.usermodel.createUserAsync(req).then(function(data){
                    rep(data);
                },function(data){
                    rep(Boom.badRequest(data));
                });    
                
        },
        config  :   {
            validate    :   {
                
                query   :   false,
                params  :  false,
                payload :   userSchema
            },
            auth    :   false
        }
    },
    {
        method  :   "DELETE",
        path    :   "/users/{id}",
        handler :   function(req,rep){
            var userId = req.params.id;
            
            model.usermodel.deleteUserAsync(userId).then(function(data){
                rep(data);
            }, function(data){
                rep(Boom.badRequest(data));
            });
            
        },
        config  :   {
            validate    :   {
                params  :   {
                    id  :   Joi.number().required()
                }
            },
            auth    :   false
        }
    },
    {
        method  :   "POST",
        path    :   "/userupdate",
        handler :   function(req,rep){
            
                    var userId = req.auth.credentials.id;
                    model.usermodel.updateUserAsync(req,userId).then(function(data){
                        rep(data);
                    },function(data){
                        rep(Boom.badRequest(data));
                    });  
            
        },
        config  :   {
            validate    :   {
                payload :   userUpdateSchema
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
            },
            auth    :   false
        }
    },
    {
        method  :   "GET",
        path    :   "/logout",
        handler :   function(req,rep){
                    var userId = req.auth.credentials.id;
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
                    var userId = req.auth.credentials.id;
                    model.usermodel.addFriend(userId,req.payload.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.unauthorized(error));
                        });  
            
        },
        config  :   {
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
                    var userId = req.auth.credentials.id;
                    model.usermodel.listFriends(userId).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        
    },
    {
        method  :   "GET",
        path    :   "/search/{query_string}",
        handler :   function(req,rep){
                    var userId = req.auth.credentials.id;
                    model.usermodel.searchFriend(userId,req.params.query_string).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            
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
                    var userId = req.auth.credentials.id;
                    model.usermodel.deleteFriend(userId,req.params.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
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
                    var userId = req.auth.credentials.id;
                    model.usermodel.viewFriend(userId,req.params.friend_id).then(function(response){
                            return rep(response).code(200);    
                        },function(error){
                            return rep(Boom.badRequest(error));
                        });  
            
        },
        config  :   {
            validate    :   {
                params :   {
                    friend_id   :   Joi.number().required()
                    
                }
            }
        }
    }
    
   
];
