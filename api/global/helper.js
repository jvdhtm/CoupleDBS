var path = require('path');
var fs = require('fs');
var glob = require("glob");

module.exports = {
  createFile : function (path,contents,response)
	{
		var path = path,
		buffer = new Buffer(contents);

		fs.open(path, 'w', function(err, fd) {
			if (err) {
				throw 'error opening file: ' + err;
			}

			fs.write(fd, buffer, 0, buffer.length, null, function(err) {
				if (err) throw 'error writing file: ' + err;
				fs.close(fd, function() {
					console.log('file written');
				})
			});
		});
	},
  readJson:function (src,cb)
  {
    var self = this;
    glob(src, [], function (er, files) {

      var result = [];
       for (var i in files){
         var name = files[i];
         var obj = JSON.parse(fs.readFileSync(name, 'utf8'));
         result[i] = obj;

       }
       cb(result);
    });
    return '';
  }
}
