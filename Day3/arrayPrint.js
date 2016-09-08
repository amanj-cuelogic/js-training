function createArray(length = 100){
  var a = [];
  for(var i=0;i<length;i++){
    a[i] = i+1;
  }
  return a;
}
var arr = createArray();
console.log(arr.join("\n"));
