/* global process */

import path from 'path'
import gulp from 'gulp'
const { series, src, dest, watch } = gulp
import { deleteSync } from 'del'
import ts from 'gulp-typescript'
import gulpif from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'
import nodemon from 'gulp-nodemon'

const tsProject = ts.createProject('tsconfig.json')
const isDev = process.env.NODE_ENV === 'development'

function cleanDist(cb) {
  deleteSync(['./build/*'])
  cb()
}

function copyEtc() {
  return src('./src/logs/**/*').pipe(dest('build/logs'))
}

function copyPublic() {
  return src('./src/public', { allowEmpty: true }).pipe(dest('build'))
}

function copyToPublic() {
  return src('./src/public/**/*').pipe(dest('build/public'))
}

function copyEnv() {
  return src('./src/.env').pipe(dest('build'))
}

function compileTS() {
  return tsProject
    .src()
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(tsProject())
    .js.pipe(gulpif(isDev, sourcemaps.write('')))
    .pipe(dest('build'))
}

function serverWatch(done) {
  return nodemon({
    script: 'build/index.js',
    watch: 'build',
    ext: 'js',
    // env: { NODE_ENV: 'development' },
    ignore: ['node_modules/**'],
    delay: 500,
    done: done
  })
}

export function dev(done) {
  series(cleanDist, copyEtc, copyPublic, copyToPublic, copyEnv, compileTS, serverWatch)(done)

  const tsWatcher = watch('./src/**/*.ts', compileTS)
  tsWatcher.on('unlink', (filepath) => {
    deleteFile(filepath, 'src', 'build', ['.ts', '.js'])
  })

  const staticsWatcher = watch('./src/public/**/*', copyToPublic)
  staticsWatcher.on('unlink', (filepath) => {
    deleteFile(filepath, 'src/public', 'build/public')
  })

  watch('./src/.env', copyEnv)

  function deleteFile(filepath, srcDir, distDir, extension) {
    const filePathFromSrc = path.relative(path.resolve(srcDir), filepath)
    let destFilePath = path.resolve(distDir, filePathFromSrc)
    if (extension) destFilePath = destFilePath.replace(extension[0], extension[1])
    deleteSync(destFilePath)
    deleteSync(`${destFilePath}.map`)
  }
}

const build = series(cleanDist, copyEtc, copyPublic, copyToPublic, copyEnv, compileTS)

export default build
