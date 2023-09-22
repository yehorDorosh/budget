import gulp from 'gulp';
const { series, src, dest } = gulp;
import { deleteSync } from 'del';

function cleanDist(cb) {
  deleteSync(['./build/*']);
  cb();
}

export function cpServer() {
  return src([
    'server/build/**/*.js',
    'server/package.json',
    'server/build/.env',
  ]).pipe(dest('build'));
}

function cpClient() {
  return src('client/build/**/*.*').pipe(dest('build/public'));
}

export default series(cleanDist, cpServer, cpClient);
