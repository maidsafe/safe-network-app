let appString = 'SAFE Network App.app';

if (process.platform === 'linux') {
    appString = 'safe-network-app';
}

if (process.platform === 'windows') {
    appString = 'safe-network-app';
}

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

// Changing mainWindowURl to that of a tab gets us the browser UI going too.
module.exports = {
    mainWindowUrl: './app/app.html',
    electronPath: `./release/${PLATFORM_NAME}/${appString}`
    // appArgs: allArgs
    // openDevTools: true
};
