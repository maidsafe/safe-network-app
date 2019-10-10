let appString = 'safe-network-app';

let TEST_UNPACKED = process.env.TEST_UNPACKED;
// const allArgs = ['--mock'];

const testAuthenticator = process.env.TEST_CAFE_TEST_AUTH;

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

if (platform === MAC_OS) {
    PLATFORM_NAME = 'mac';
    appString = 'SAFE Network App.app';
}

if (platform === LINUX) {
    PLATFORM_NAME = 'linux-unpacked';
}

if (platform === WINDOWS) {
    PLATFORM_NAME = 'win-unpacked';
    appString = 'SAFE Network App.exe';
}

let config = {
    mainWindowUrl: './app/app.html',
    // electronPath: `./release/${PLATFORM_NAME}/${appString}`,
    appPath: '.'
    // , appArgs: allArgs
    // , openDevTools: true
};

if (!TEST_UNPACKED) {
    console.log('Testcafe testing the packaged app. \n');
    // delete config.appPath;
    config.electronPath = `./release/${PLATFORM_NAME}/${appString}`;
} else {
    console.log('Testcafe testing the unpackaged app. \n');
}

module.exports = config;
