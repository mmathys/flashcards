var l = 25;
var chunks = 8;
var size = Math.ceil(l / chunks);
console.log("max size: "+size)

for(var i = 0; i<l; i++) {
  var group = Math.floor(i / size);
  console.log("put "+i+" in "+group)
}
