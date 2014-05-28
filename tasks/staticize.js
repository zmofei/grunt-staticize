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

module.exports = function(grunt) {

    grunt.registerMultiTask('staticize', 'The best Grunt plugin ever.', function() {
        //rev task
        grunt.log.writeln(chalk.underline('Revisioning tasking'));
        var revtask = this.data.rev || {};
        var revOption = revtask.options || {};

        function revRun(filePath, dest, revOption) {
            //rev files
            var mapping = grunt.file.expand(filePath, dest);
            mapping.forEach(function(ele) {
                var dirname, resultPath;
                var hash = crypto.createHash(revOption.algorithm || 'md5').update(grunt.file.read(ele), (revOption.encoding || 'utf8')).digest('hex');
                hash = hash.slice(0, (revOption.length || 8));

                var ext = path.extname(ele);
                var newName = [path.basename(ele, ext), hash, ext.slice(1)].join('.');

                if (dest) {
                    console.log(dest, ele);
                    dirname = dest;
                    resultPath = path.resolve(dirname, path.dirname(ele), newName);
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
                revRun(revtask[i].files, revtask[i].dest, revOption);
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
            var allFiles = grunt.file.expand({
                cwd: assetsDirs
            }, '**/*.*');
            mapping.forEach(function(file) {
                var hit = 0;
                var log = '';
                var result = grunt.file.read(file).replace(patterns, function() {
                    //var fileSrc = arguments[0].replace(/^\//, '');
                    var fileSrc = arguments[0];
                    var regStr = fileSrc.replace(/\.\w+$/, function() {
                        return '(\\.\\w+)*' + arguments[0];
                    });
                    var result = allFiles.filter(function(fileName) {
                        return new RegExp('^' + regStr + '$').test(fileName);
                    });
                    if (result.length > 0 && (fileSrc !== result[0])) {
                        hit++;
                        log += '\t ' + fileSrc + ' -> ' + result[0] + '\n';

                        var prePath=/^\//.test(arguments[0])?'/':'';
                        return prePath+result[0];

                    } else {
                        return arguments[0];
                    }
                });
                grunt.log.writeln(chalk.cyan('↔ ') + file);
                if (hit > 0) {
                    
                    grunt.log.writeln(chalk.gray(log));
                }
                grunt.file.write(file, result);
            });
        }

        for (var reps in reptask) {
            repRun(reptask[reps].files, reptask[reps].patterns, reptask[reps].assetsDirs || '');
        }

        grunt.log.writeln(chalk.underline('Repalce task end'));

    });
};