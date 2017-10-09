var path = require('path');
var fs = require('fs');
var glob = require("glob");
var walk  = require('walk');

module.exports = {
  readJson:function (src,cb)
  {
    var self = this;
    glob(src, [], function (er, files) {

      var result = [];
       for (var i in files){
         var name = files[i];
         var obj = JSON.parse(fs.readFileSync(src, 'utf8'));
         result[i] = obj;

       }
       cb(result);
    });
    return obj;
  }
}
