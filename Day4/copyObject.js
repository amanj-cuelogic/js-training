var obj = {
  make : "Fiat",
  model : "2002",
  brand : 'GE',
  displayname : function(){
    return this.make;
  }
};
function copyObject(src,dest={}){
  var keys = Object.keys(src);
  for(var i = 0;i<keys.length;i++){
    if(src.hasOwnProperty(keys[i])){
      dest[keys[i]] = src[keys[i]];
    }
  }
  return (dest);
}

var newobj = copyObject(obj,{});
obj.displayname = function(){
  return this.make+'///';
}
console.log(newobj.displayname());
console.log(obj.displayname());
