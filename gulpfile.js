var gulp = require('gulp');
var path = require('path');
var connect = require('gulp-connect');
//文件压缩
var uglify     = require('gulp-uglify');
var gutil = require('gulp-util');
//JS 文件合并
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var compass    = require('gulp-compass');
var plumber    = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
//文件清理功能
var clean      = require('gulp-clean');
//图片无损压缩1
var imagemin   = require('gulp-imagemin');
//重命名
var rename = require('gulp-rename');
//自动打包
var zip= require('gulp-zip');
//var sh = require('shelljs');
var htmlmin = require('gulp-htmlmin');
//文件复制
var copy    = require("gulp-copy");
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

//浏览器自动打开项目目录
var  opn        = require('opn');
//配置文件
var config     = require('./config.json');
var paths = {
  sass: ['./scss/**/*.scss']
};
//监视sass文件变化
gulp.task('sass', function(done) {
  gulp.src('./scss/*.scss')
    .pipe(sass({
      errLogToConsole: true,sourcemap: true, sourcemapPath: './www/css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
//监视页面变化
gulp.task('html', function () {
  gulp.src('./www/*.html').pipe(connect.reload());
});
gulp.task('css', function () {
    gulp.src('./www/stylesheets/*.css').pipe(connect.reload());
});
gulp.task('templates', function(){
  gulp.src('./www/templates/*.hbs')
      .pipe(handlebars())
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
        namespace: 'MyApp.templates',
        noRedeclare: true
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('./www/templates/js/'));


});
//压缩javascript 文件，压缩后文件放入build/js下
gulp.task('minifyjs',function(){
  gulp.src('js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./js/min'))
});
//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function() {
  //gulp.watch(paths.sass, ['sass']);
  gulp.watch('./www/*.css', ['css']);
  gulp.watch(['./www/*.html'], ['html']);
});

//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
  opn( 'http://' + config.localserver.host + ':' + config.localserver.port );
});

//Compass 进行SASS 代码
gulp.task('compass', function(){
  gulp.src('./www/sass/*.scss')
      .pipe(plumber({
        errorHandler: function (error) {
          console.log("====="+error.message+"=====");
          this.emit('end');
        }}))
      .pipe(compass({config_file: './www/config.rb'}))
      .pipe(minifyCss())
      .pipe(gulp.dest('www/temp'));
});
//压缩HTML
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});
//打包主体build 文件夹并按照时间重命名
gulp.task('zip', function(){
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i
    }
    return i
  }

  var d=new Date();
  var year=d.getFullYear();
  var month=checkTime(d.getMonth() + 1);
  var day=checkTime(d.getDate());
  var hour=checkTime(d.getHours());
  var minute=checkTime(d.getMinutes());

  return gulp.src('./hooks/**')
      .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
      .pipe(gulp.dest('./'));
});

//使用connect启动一个Web服务器
gulp.task('connect', function () {
  connect.server({
    root: 'www',
    livereload: true
  });
});

gulp.task("default",['connect', 'watch','openbrowser']);
/*定义gulp的任务*/
