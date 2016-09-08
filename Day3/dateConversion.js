function convertDate(timestamp){
  var d = new Date(timestamp);
  console.log(d.toUTCString());
}
convertDate(1473316606338);
