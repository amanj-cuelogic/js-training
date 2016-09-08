function arrConversion(Args,newarrlength=Args[0].length){
  var twodArr = new Array(newarrlength);
  Args.forEach(function(element,index){
    for(var i=0;i<newarrlength;i++){
     if(!Array.isArray(twodArr[i])){
       twodArr[i] = []; 
     }  
     twodArr[i][index] = element[i]; 
    }
  });
  return twodArr;
}

var multidArr = arrConversion(['000','011','113','104','115','006','997','444','335','876']);
console.log(multidArr[1]);

