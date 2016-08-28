const gulp = require('gulp');

const watchify = require('gulp-watchify');


gulp.task('default', ['browserify']);

// browserify/watchify
var watching = false;
gulp.task('enable-watch-mode', () => watching = true);

gulp.task('browserify', watchify(watchify =>
  gulp.src('src/*.js')
    .pipe(watchify({
      watch: watching
    }))
    .pipe(gulp.dest('public/'))
));

gulp.task('watch', ['enable-watch-mode', 'browserify']);
