#!/usr/bin/env node

/**
 * 使用glob做文件匹配
 * 使用git log做操作记录获取（获取了创建记录和最近一次修改记录）
 *
 * 使用前提：
 * node
 * git
 */

var config = {
  filePath: __dirname + '/src/{components,scripts,styles}/**/*.{js,es6,jsx,css,scss,less}',
  product: 'YourProductName',
  module: (file) => {file.replace(/^.+(app\/components\/common|app\/components|app\/scripts|app\/styles)\/([^/]+).+/, '$2')}
}

var fs = require('fs')
var process = require('child_process')
var glob = require('glob')

var txt = function (file, date, logs) {
  var module = config.module

  if (typeof module === 'function') {
    module = module(file)
  } else if (typeof module !== 'string') {
    console.err('module 要求类型为 string 或 function')
    return
  }

  return `/*
* ------------------------------------------------------------------
* Copyrightxxx
* ------------------------------------------------------------------
* Product : ${config.product}
* Module Name : ${module}
* Date Created: ${date}
* Description :
* ------------------------------------------------------------------
* Modification History * DATE Name Description
* ------------------------------------------------------------------
* ${logs}
* ------------------------------------------------------------------
*/
`
}

var format = '%cd %cn %s'

glob(filePath, function (err, fileList) {
  for (var i = fileList.length - 1; i >= 0; i--) {
    let _file = fileList[i]
    
    process.exec(`git log --date=short --diff-filter=A --pretty=format:"${format}" ${_file}` +
                 ' & ' +
                 `git log --date=short -1 --pretty=format:"%n* ${format}" ${_file}`, function (err, stdout, stderr) {
      if (err == null) {
        var _txt = txt(_file, stdout.substring(0, 10), stdout)

        _txt += fs.readFileSync(_file, {
          encoding: 'utf-8'
        })

        var fd = fs.openSync(_file, 'w')
        fs.write(fd, _txt, 0, 'utf-8', function (err) {
          console.err('write err:', err)
        })
      } else {
        console.err('git exe err:', err)
      }
    })
  }
})
