const Hapi = require("hapi");

const server = new Hapi.Server();

var messages   =   [
    {
        name    : "Tom",
        designation :   "SE",
        company :   "Cue"
    },
    {
        name    : "Steve",
        designation :   "SSE",
        company :   "Cue"
    },
    {
        name    : "Jim",
        designation :   "SSE",
        company :   "Cue"
    }
    
];
server.connection({
   host :   "localhost" ,
   port :   8000
});

server.route({
    method  :   "GET",
    path    :   "/",
    handler :   function(req,reply){
        return reply(JSON.stringify(messages)).code(200);
    }
});

server.start((err)  =>  {
   if(err){
        throw   err;
    }
    console.log("Server Running at",server.info.uri);
});


