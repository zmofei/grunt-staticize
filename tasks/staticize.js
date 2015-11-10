/*
 * grunt-staticize
 * https://github.com/zmofei/grunt-staticize
 *
 * Copyright (c) 2014 Z.Mofei
 * Licensed under the MIT license.
 */

'use strict';
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

// useage
// 
// grunt.initConfig({
//     staticize: {
//         targetName: {
//             rev: { //校订任务（hash）
//                 msite: { //任务名称(task name)
//                        'cwd':'folderPath',
//                     'files': ['temp/msite/**/*.{css,js,jpg,png,gif}'],
//                     'dest': 'testF_2'
//                 },
//                 options: { //任务配置(task config)
//                     'encoding': 'utf8',
//                     'algorithm': 'md5',
//                     'length': 8
//                 }
//             },
//             rep: { //替换任务(repalce)
//                 msite: { //替换任务名称 (task name)
//                     'files': ['temp/msite/*.{css,js,jade}'],
//                     'assetsDirs': 'temp/msite/static/',
//                     'patterns': /\/{0,1}\w+(\/\w+)*\.\w+/mg
//                 }
//             }
//         }
//     },
// });

module.exports = function(grunt) {

    grunt.registerMultiTask('staticize', 'The best Grunt plugin ever.', function() {
        //rev task
        grunt.log.writeln(chalk.underline('Revisioning tasking'));
        var revtask = this.data.rev || {};
        var revOption = revtask.options || {};
        var cwd;


        function revRun(filePath, dest, cwd, revOption) {
            //rev files
            var mapping = grunt.file.expand(cwd+filePath, dest);
            mapping.forEach(function(ele) {
                var dirname, resultPath;
                var hash = crypto.createHash(revOption.algorithm || 'md5').update(grunt.file.read(ele), (revOption.encoding || 'utf8')).digest('hex');
                hash = hash.slice(0, (revOption.length || 8));

                var ext = path.extname(ele);
                var newName = [path.basename(ele, ext), hash, ext.slice(1)].join('.');

                if (dest) {
                    console.log(dest, ele);
                    dirname = dest;
                    resultPath = path.resolve(dirname, path.dirname(ele).replace(cwd,''), newName);
                    grunt.file.copy(ele, resultPath);
                } else {
                    dirname = path.dirname(ele);
                    resultPath = path.resolve(dirname, newName);
                    fs.renameSync(ele, resultPath);
                }

                grunt.log.writeln(chalk.cyan('✔  ') + ele + chalk.gray(' -> ') + newName);
            });
        }
        for (var i in revtask) {
            if (i !== 'options') {
                cwd = revtask[i].cwd || '';
                revRun(revtask[i].files, revtask[i].dest,cwd,revOption);
            }
        }
        grunt.log.writeln(chalk.underline('Revisioning task end'));
        //repalce task
        grunt.log.writeln(chalk.underline('Repalce tasking'));
        var reptask = this.data.rep || {};

        function repRun(files, patterns, assetsDirs) {
            if (!files || !patterns) {
                return false;
            }
            var mapping = grunt.file.expand(files);

            var allFilesPath = path.join(assetsDirs, '**/*.*');
            var allFiles = grunt.file.expand(allFilesPath);

            mapping.forEach(function(file) {
                var log = '';
                grunt.log.writeln(chalk.cyan('☂  CheckFile: ') + file);

                var result = grunt.file.read(file).replace(patterns, function() {

                    var relaPath = path.join(assetsDirs, arguments[0]);
                    var absoPath = path.resolve(relaPath);
                    var absoPathRegStr = absoPath.replace(/\.\w+$/, function() {
                        return '(\\.\\w{' + (revOption.length || 8) + '})+' + arguments[0];
                    });
                    var absoPathReg = new RegExp(absoPathRegStr);
                    var result = allFiles.filter(function(filePath) {
                        var tryMatch = absoPathReg.test(path.resolve(filePath));
                        return tryMatch;
                    });
                    if (result.length > 0) {
                        var parentPath = path.join(arguments[0], '..');
                        var resultPath = path.join(parentPath, path.basename(result[0]));
                        resultPath = resultPath.replace(/\\/g,'/');
                        log += '    ' + chalk.cyan('↺  Replaced: ') + chalk.gray(arguments[0] + ' -> ' + resultPath) + '\n';
                        return resultPath;
                    } else {
                        return arguments[0];
                    }

                });

                grunt.log.writeln(log);
                grunt.file.write(file, result);
            });
        }

        for (var reps in reptask) {
            repRun(reptask[reps].files, reptask[reps].patterns, reptask[reps].assetsDirs || '');
        }

        grunt.log.writeln(chalk.underline('Repalce task end'));

    });
};
