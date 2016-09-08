function strSearch(orgStr,key){
  var index = orgStr.indexOf(key);
  
  var obj = {
    count : 0 ,
    lastIndex : orgStr.lastIndexOf(key)
  }; 
  if(index != -1){
   while(index != -1){
     orgStr = orgStr.slice(++index);
     obj.count++;
     index = orgStr.indexOf(key);
   }
   return obj;
  }else{
    return -1;
  }
}
var obj = strSearch("aman","p");
console.log(obj);
