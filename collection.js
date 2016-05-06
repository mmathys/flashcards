var argv = require('yargs').argv;
var csv = require("fast-csv");
var _ = require('lodash')

var file = argv.file;

var result = [];
csv
 .fromPath(file)
 .on("data", function(read){
   result.push(read);
 })
 .on("end", function(){
   setupCollectionOrder();
   prepareOutput();
 });

function setupCollectionOrder() {

  // T H E   C O L L E C T I O N   O R D E R
  // ---------------------------------------
  //
  // First, chunk all data into 8 groups.
  // Then iterate. Read the first one of all, then the second and so on.

  //console.log("result lenght: "+result.length)
  var order = partition(result, 8);
  //console.log("order length: "+order.length)


  /*console.log("the chunks have a length of "  + order[0].length + ", "
                                              + order[1].length + ", "
                                              + order[2].length + ", "
                                              + order[3].length + ", "
                                              + order[4].length + ", "
                                              + order[5].length + ", "
                                              + order[6].length + ", "
                                              + order[7].length + "!")*/

  result = [];
  for(var i = 0; i<order[0].length; i++){
    for(var j = 0; j<order.length/* it's 8 */; j++){
      if(order[j][i]){
        result.push(order[j][i]);
      }else{
        console.log("INVALID")
      }
    }
  }
}


function prepareOutput() {
 // What we wanna have: 8-er chunks with vocabulary. output goes like this:
 // first output the 8 defintions then the 8 terms.
 // but. create inside 8-er chunks 2-er chunks and flip the order of defintion and term.
 // result: array of 2-er pages. one page is an array: of definition and terms.

 var two_er_pages = [];
 _.each( _.chunk(result, 8), function(chunk){

   var pageDef = [];
   var pageTerm = [];

   // chunk can be less than 8. if less, fill in.

   for(var i = 0; chunk.length<8; i++){
     chunk.push(["",""]);
  }

   // complete 8er chunk. do output

   _.each(_.chunk(chunk, 2), function(two_er_chunk){
     pageDef.push(two_er_chunk[0][0])
     pageDef.push(two_er_chunk[1][0])
     pageTerm.push(two_er_chunk[1][1])
     pageTerm.push(two_er_chunk[0][1])
   })

   two_er_pages.push([pageDef, pageTerm]);
 })

 // Output everthing.
 _.each(two_er_pages, function(two_er_page){
   // 8 Definitions
   _.each(two_er_page[0], function(def){
     console.log("\\definition{"+def+"}")
   })

   // 8 Terms
   _.each(two_er_page[1], function(term){
     console.log("\\term{"+term+"}")
   })
 })
}
/**
 * Util
 */
function partition(items, n) {
    var counter = 0;
    var maxItems = Math.ceil(items.length/n);
    //console.log(items.length+" % "+n+": "+items.length%n)
    //console.log("max items "+maxItems)

    var ret = _.groupBy(items, function(item) {
        //console.log(Math.floor(counter / maxItems)+": "+item);
        return Math.floor((++counter-1) / maxItems);
    });
    return _.values(ret);
}
