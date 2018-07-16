var fs = require('fs');
var path = require('path');

var jsPath = "/js/file/path";
var dirPath = "/path/to/save/files";

var test = require(jsPath);
var modules = test.require.modules;

var mkdirsSync = function (filePath, mode) {
  if (!fs.existsSync(filePath)) {
    var pathtmp;
    filePath.split('/').forEach(function(dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      } else {
        pathtmp = dirname;
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp, mode)) {
          return false;
        }
      }
    });
  }

  return true; 
};

var jsFilesTask = function () {
  for (var module in modules) {
    // 创建文件 module
    // 在文件中写入 modules[module]
    var filePath = dirPath + module + '.js';
    var fileDir = dirPath + module.substring(0, module.lastIndexOf('/'));

    // 判断文件路径
    mkdirsSync(fileDir);

    var fd = fs.openSync(filePath, 'w');

    var text = modules[module].toString();
    text = text.substring(51, text.length - 20);

    var buf = new Buffer(text);
    fs.writeSync(fd, buf, 0, buf.length, 0, function (err, written, buffer){});

  }
}

jsFilesTask();
