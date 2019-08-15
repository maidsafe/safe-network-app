let appString = 'SAFE Network App.app';

if (process.platform === 'linux') {
    appString = 'safe-network-app';
}

if (process.platform === 'windows') {
    appString = 'safe-network-app';
}

let TEST_UNPACKED = process.env.TEST_UNPACKED;
// const allArgs = ['--mock'];

const testAuthenticator = process.env.TEST_CAFE_TEST_AUTH;

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

if (platform === MAC_OS) {
    PLATFORM_NAME = 'mac';
}

if (platform === LINUX) {
    PLATFORM_NAME = LINUX;
}

if (platform === WINDOWS) {
    PLATFORM_NAME = 'win';
}

let config = {
    mainWindowUrl: './app/app.html',
    // electronPath: `./release/${PLATFORM_NAME}/${appString}`,
    appPath: '.'
    // appArgs: allArgs
    // openDevTools: true
};

if (!TEST_UNPACKED) {
    console.log('Testcafe testing the packaged app. \n');
    // delete config.appPath;
    config.electronPath = `./release/${PLATFORM_NAME}/${appString}`;
} else {
    console.log('Testcafe testing the unpackaged app. \n');
}

module.exports = config;
