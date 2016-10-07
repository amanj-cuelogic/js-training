var Joi =   require("joi");
var Boom    =   require("boom");
var model   =   require("./models");
var bcrypt  =   require("bcrypt");
var mysql = require("mysql");
var promise = require("bluebird");
//promise.promisifyAll(require("mysql/lib/Connection").prototype);

//var User = require("./models/user-model.js");
promise.promisifyAll(model.usermodel);
promise.promisifyAll(model.accountmodel);


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
                
                var password = bcrypt.hashSync(req.payload.password,salt);
                var userData =   [req.payload.first_name.trim(),req.payload.last_name.trim(),req.payload.email,req.payload.phone,password];  
                model.usermodel.createUserAsync(userData).then(function(data){
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
                    model.accountmodel.loginAsync(req).then(function(response){
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
                    console.log(req.auth.credentials);
                    model.accountmodel.logoutAsync(userId).then(function(response){
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
                    model.usermodel.addFriendAsync(userId,req.payload.friend_id).then(function(response){
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
                    model.usermodel.listFriendsAsync(userId).then(function(response){
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
                    model.usermodel.searchFriendAsync(userId,req.params.query_string).then(function(response){
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
                    model.usermodel.deleteFriendAsync(userId,req.params.friend_id).then(function(response){
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
                    model.usermodel.viewFriendAsync(userId,req.params.friend_id).then(function(response){
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
        path    :   "/promisetestlink",
        handler :   function(req,rep){
                    var userId = req.auth.credentials.id;
                    promise.all([model.usermodel.getAllUsersAsync(),model.usermodel.getUserAsync(userId)])
                            .then(function(results){
                                rep(results);   
                            }).catch(function(error){
                                rep(Boom.badRequest(error));
                            });  
        },
    },
    {
        method  :   "GET",
        path    :   "/promise-spreadtestlink",
        handler :   function(req,rep){
                    var userId = req.auth.credentials.id;
                    promise.all([model.usermodel.getAllUsersAsync(),model.usermodel.getUserAsync(userId)])
                            .spread(function(allusers,userdetails){
                                rep(userdetails);   
                            }).catch(function(error){
                                rep(Boom.badRequest(error));
                            });  
        }
    },
    {
        
        method  :   "POST",
        path    :   "/promise-dtestlink",
        handler :   function(req,rep){
                    
                        //var password = bcrypt.hashSync(req.payload.password,salt);
                        var userData = ['Aman','Juneja','am.ju@in.com','123456789','ajuneja123'];
                        var a = model.usermodel.createUserAsync(userData);
                        var b = a.then(function(){
                            var userData = ['Test','User','te.us@in.com','123456789','tuser123'];
                            return model.usermodel.createUserAsync(userData);
                                    
                        });
                        var c = b.then(function(){
                                console.log(b);
                                var userData = ['Test1','User1','te1.us1@in.com','123456789','tuser1123'];
                                return model.usermodel.createUserAsync(userData);    
                        });
                        
                        //var d = c.then(function(){
                        //    rep(a.value()+'-'+b.value()+'-'+c.value());
                        //}).catch(function(err){
                        //    rep(Boom.badRequest(err));    
                        //});
                        promise.all([a,b,c]).spread(function(resp1,resp2,resp3){
                            rep(resp1+'-'+resp2+'-'+resp3);
                        }).catch(function(err){
                            rep(Boom.badRequest(err));    
                        });
        },
        config  :   {
            auth    :   false
        }
        
    }
    
    
    
   
];
