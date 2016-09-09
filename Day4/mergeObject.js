var A = {
  make : "Fiat",
  model : "2002",
  brand : 'GE',
  displayname : function(){
    return this.make;
  }
};
var B = {
  make : "Fiat",
  model : "2002",
  brand : 'GE',
  type : 'sedan',
  displayname : function(){
    return this.make;
  },
  printModel : function(){
    return this.model;
  }
};
function copyObject(dest,...src){
  
  src.forEach((src) => {
    var keys = Object.keys(src);
    for(var i = 0;i<keys.length;i++){
      if(src.hasOwnProperty(keys[i]) && !dest.hasOwnProperty(keys[i])){
        dest[keys[i]] = src[keys[i]];
      }
    }  
  }
  );
  return (dest);
}

var newobj = copyObject({},A,B);
console.log(newobj);