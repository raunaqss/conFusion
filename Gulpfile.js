var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    del = require('del'),
    stylish = require('jshint-stylish'),
    plugs = require('gulp-load-plugins')();


// Take the js scripts, pipe 'em through and return
gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
    .pipe(plugs.jshint())
    .pipe(plugs.jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    // these three are independent of each other
    gulp.start('usemin', 'imagemin', 'copyfonts');
});


gulp.task('usemin', ['jshint'], function() {
    return gulp.src('./app/menu.html')
    .pipe(plugs.usemin({
        css: [plugs.minifyCss(),plugs.rev()],
        js: [plugs.uglify(),plugs.rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src('app/images/**/*')
    .pipe(plugs.cache(plugs.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(plugs.notify({message: 'Images task complete'}));
});


gulp.task('copyfonts', ['clean'], function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', ['browser-sync'], function() {
    // watch all specified files, if any change run usemin task
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*html}',
        ['usemin']);
    // watch image files, if any change run the imagemin task
    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function() {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "menu.html"
        }
    });

    gulp.watch(['dist/**']).on('change', browserSync.reload);
});
