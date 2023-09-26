import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
const { series, src, dest } = gulp;
import { deleteSync } from 'del';
import GulpSSH from 'gulp-ssh';

const config = {
  host: '18.134.229.196',
  port: 22,
  username: 'bitnami',
  privateKey: fs.readFileSync('./id_rsa.pem'),
};
const ssh = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config,
});

const remoteDir = '/opt/bitnami/projects/budget';

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

export function copyEnvToServer() {
  return src('build/.env').pipe(ssh.dest(remoteDir), {
    filePath: 'commands.log',
  });
}

function copyInstallRestartServer() {
  return src('build/**/*.*')
    .pipe(ssh.dest(remoteDir))
    .on('end', () => {
      console.log('Installing dependencies...');
      ssh
        .shell(['cd ' + remoteDir, 'npm install'], {
          filePath: 'commands.log',
        })
        .pipe(gulp.dest('logs'))
        .on('end', () => {
          console.log('Re-starting server...');
          ssh.shell(['sudo systemctl restart budget_node_app.service'], {
            filePath: 'commands.log',
          });
        });
    });
}

function clearServer() {
  return ssh.shell(['cd ' + remoteDir, 'rm -rf *'], {
    filePath: 'commands.log',
  });
}

export const deploy = series(
  clearServer,
  copyEnvToServer,
  copyInstallRestartServer
);

export default series(cleanDist, cpServer, cpClient);
