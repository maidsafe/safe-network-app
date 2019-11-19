let appString = 'safe-network-app';

let TEST_UNPACKED = process.env.TEST_UNPACKED;
const pkg = require('./package.json');

const testAuthenticator = process.env.TEST_CAFE_TEST_AUTH;

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

let appChannel = '';
if (pkg.version.includes('-alpha')) {
    appChannel = ' Alpha';
}

if (pkg.version.includes('-beta')) {
    appChannel = ' Beta';
}
//
// if (platform === MAC_OS) {
//     PLATFORM_NAME = 'mac';
//     appString = `SAFE Browser${appChannel}.app`;
//     appResources = 'Contents/Resources/app.asar';
// }
//
// if (platform === LINUX) {
//     PLATFORM_NAME = 'linux-unpacked';
// }
//
// if (platform === WINDOWS) {
//     PLATFORM_NAME = 'win-unpacked';
//     appString = `SAFE Browser${appChannel}.exe`;
// }

if (platform === MAC_OS) {
    PLATFORM_NAME = 'mac';
    appString = `SAFE Network App${appChannel}.app`;
}

if (platform === LINUX) {
    PLATFORM_NAME = 'linux-unpacked';
}

if (platform === WINDOWS) {
    PLATFORM_NAME = 'win-unpacked';
    appString = `SAFE Network App${appChannel}.exe`;
}

const allArgs = [];
// allArgs.push('--debug')
let config = {
    mainWindowUrl: './app/app.html',
    // electronPath: `./release/${PLATFORM_NAME}/${appString}`,
    appPath: '.',
    appArgs: allArgs
};

if (!TEST_UNPACKED) {
    console.log('Testcafe testing the packaged app. \n');
    // delete config.appPath;
    config.electronPath = `./release/${PLATFORM_NAME}/${appString}`;
} else {
    console.log('Testcafe testing the unpackaged app. \n');
}

module.exports = config;
