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

 });
