# grunt-staticize

> Staticize your static files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-staticize --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-staticize');
```

## The "staticize" task

### Overview
In your project's Gruntfile, add a section named `staticize` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  staticize: {
    targetName:{
      rev:{  //revisioning task
        msite:{ //target
          'cwd':'folderPath',
          'files': ['temp/msite/**/*.{css,js,jpg,png,gif}'],
          'dest': 'testF_2'
        },
        options: {  //revisioning options
          'encoding': 'utf8',
          'algorithm': 'md5',
          'length': 8
        }
      },
      rep: {  //replace task
        msite: {  //target
          'files': ['temp/msite/*.{css,js,jade}'],
          'assetsDirs': 'temp/msite/static/',
          'patterns': /\/{0,1}\w+(\/\w+)*\.\w+/mg
        }
      }
    }
  },
});
```

=======

### Revisioning task

Revisionging task is to add hash for files,like:  `/static/logo.jpg` -> `/static/logo.d124da.jpg`

Revisionging use field `rev` to defined.

`rev` is a json type,which inclode some target,and a option

```js
//...
  rev:{
    targetA:{
      //...
    }
    targetB:{
      //...
    }
    option:{
      //...
    }
  }
//...
``` 
#### target

In each target you need defined `files`(the files you want opration) and `dest`(where you save the new files)

`dest` is optional,if you write this value,the new files will save to this folder, if you didn't write this,the old files will overwrite by the new files.

#### options [optional]

##### options.encoding [optional] 

Type: `String` Default value: `utf8`

the files' encoding

##### options.algorithm [optional]  

Type: `String` Default value: `md5`

the files hash type

##### options.length [optional] 

Type: `String` Default value: `8`

the hash length in the filename

#### example

```js
grunt.initConfig({
  staticize: {
    targetName:{
      rev:{  //revisioning task
        msite:{ //target
          'cwd':'folderPath',
          'files': ['temp/msite/**/*.{css,js,jpg,png,gif}'],
          'dest': 'testF_2'
        },
        options: {  //revisioning options
          'encoding': 'utf8',
          'algorithm': 'md5',
          'length': 8
        }
      }
    }
  },
});
```

=====

### Replace task

Replace task is to replace all the resources' link url

That's say after you `/static/logo.jpg` -> `/static/logo.d124da.jpg`,you can use replace task to change all the place which use this file, for example in `index.css` and `index.html` we have 

```css
.logo{
  background:url('/static/logo.jpg');
}
```

```html
<img src="/static/logo.jpg">
```
after replace task,this two file will became

```css
.logo{
  background:url('/static/logo.d124da.jpg');
}
```

```html
<img src="/static/logo.d124da.jpg">
```

Replace use field `rep` to defined.

`rep` is a json type,which inclode some target

```js
//...
  rep:{
    targetA: { },
    targetB: { }
  }
//...
``` 
#### target

In each target you need defined `files`(the files you want opration) and `assetsDirs`(the static's place ) and `patterns` (which we need replace)

#### example

```js
grunt.initConfig({
  staticize: {
    rep: {  //replace task
      msite: {  //target
        'files': ['temp/msite/*.{css,js,jade}'],  //replace this files 
        'assetsDirs': 'temp/msite/static/',  //the static which files use in 'temp/msite/static/'
        'patterns': /\/{0,1}\w+(\/\w+)*\.\w+/mg  //if match for example 'ad/ad.jpg','dfa/d.css' and try to replace the match based on the 'assetsDirs'
      }
    }
  },
});
```


======

