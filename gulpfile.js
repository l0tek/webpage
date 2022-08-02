    var gulp = require('gulp');
    var browserSync = require('browser-sync').create();
    var sass = require('gulp-sass')(require('sass'));
    var inject = require('gulp-inject');
    var autoprefixer = require('gulp-autoprefixer');
    var replace = require('gulp-replace');
    var minify = require('gulp-minify');

    // Compile sass into CSS & auto-inject into browsers
    gulp.task('styles', function() {
        return gulp.src("src/scss/*.scss")
            .pipe(sass())
            .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
            .pipe(gulp.dest("dist/css"))
            .pipe(browserSync.stream());
    });

    gulp.task('cacheburst', () => {
        var cbString = new Date().getTime();
        return gulp.src('./src/index.html')
            .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
            .pipe(gulp.dest('./src'));
    });


    gulp.task('minjs', () => {
        return gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.js', './node_modules/popper.js/dist/popper.js'])
            .pipe(minify({ noSource: true }))
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream());
    });


    gulp.task('inject', () => {
        return gulp.src('./src/index.html')
            .pipe(inject(gulp.src(['./src/tpl/nav.html']), {
                starttag: '<!-- inject:nav:{{ext}} -->',
                transform: function(filePath, file) {
                    // return file contents as string
                    return file.contents.toString('utf8')
                }
            }))

        .pipe(gulp.dest('./dist'));
    });





    // Static Server + watching scss/html files
    gulp.task('serve', gulp.series('styles', 'cacheburst', 'minjs', 'inject', function() {

        browserSync.init({
            server: "./dist/"
        });

        gulp.watch("src/scss/*.scss", gulp.series('styles'));
        gulp.watch("src/*.html").on('change', browserSync.reload);
    }));

    gulp.task('default', gulp.series('serve'));