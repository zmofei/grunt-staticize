/*
 * grunt-staticize
 * https://github.com/zmofei/grunt-staticize
 *
 * Copyright (c) 2014 Z.Mofei
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        staticize: {
            targetName: {
                rev: {
                    msite: { //target
                        'files': ['static/**/*.{css,js,jpg,png,gif}'],
                        'dest': 'testF_2'
                    },
                    // staticize: { //target
                    //     'files': ['temp/staticize/**/*.{css,js,jpg,png,gif}'],
                    //     //'dest': 'testF_2'
                    // },
                    options: {
                        'encoding': 'utf8',
                        'algorithm': 'md5',
                        'length': 8
                    }
                },
                // rep: {
                //     msite: {
                //         'files': ['temp/msite/*.{css,js,jade}'],
                //         'assetsDirs': 'temp/msite/static/',
                //         'patterns': /\/{0,1}\w+(\/\w+)*\.\w+/mg
                //     },
                //     staticize: {
                //         'files': ['temp/staticize/*.{css,js,jade}'],
                //         'assetsDirs': 'temp/staticize/static/',
                //         'patterns': /\/{0,1}\w+(\/\w+)*\.\w+/mg
                //     },
                // }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'staticize']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};