import path from 'path';
import fs from 'fs-extra';
import { app, remote } from 'electron';

import pkg from '$Package';

export const LOG_FILE_NAME = 'safe-network-app.log';
export const APPLICATION_LIST_SOURCE =
    'https://safe-network-app.s3.eu-west-2.amazonaws.com/managedApplications.json';

export const { platform } = process;
export const MAC_OS = 'darwin';
export const LINUX = 'linux';
export const WINDOWS = 'win32';
export const isRunningOnMac = platform === MAC_OS;
export const isRunningOnWindows = platform === WINDOWS;
export const isRunningOnLinux = platform === LINUX;

declare const document: Document;

const allPassedArguments = process.argv;

let shouldRunMockNetwork: boolean = fs.existsSync(
    path.resolve( __dirname, '../..', 'startAsMock' )
);

let hasDebugFlag = false;
let hasDryRunFlag = false;

export const isRunningTestCafeProcess =
    remote && remote.getGlobal
        ? remote.getGlobal( 'isRunningTestCafeProcess' )
        : process.env.TEST_CAFE || false;

export const isRunningUnpacked = process.env.IS_UNPACKED;
export const isRunningPackaged = !isRunningUnpacked;
export const isRunningTestCafeProcessingPackagedApp =
    isRunningTestCafeProcess && isRunningPackaged;

export const inBgProcess = !!(
    typeof document !== 'undefined' && document.title.startsWith( 'Background' )
);
// override for spectron dev mode
if ( isRunningTestCafeProcess && !isRunningTestCafeProcessingPackagedApp ) {
    shouldRunMockNetwork = true;
}

if ( allPassedArguments.includes( '--mock' ) ) {
    shouldRunMockNetwork = true;
}

if ( allPassedArguments.includes( '--live' ) ) {
    shouldRunMockNetwork = false;
}

if ( allPassedArguments.includes( '--debug' ) ) {
    hasDebugFlag = true;
}

if ( allPassedArguments.includes( '--dryRun' ) || process.env.LAUNCHER_DRY_RUN ) {
    hasDryRunFlag = true;
}

let forcedPort: number;
if ( allPassedArguments.includes( '--port' ) ) {
    const index = allPassedArguments.indexOf( '--port' );

    forcedPort = Number( allPassedArguments[index + 1] );
}

// Still needed if we want to pass this on to apps we open up...
export const shouldStartAsMockFromFlagsOrPackage: boolean = shouldRunMockNetwork;

export const environment = shouldStartAsMockFromFlagsOrPackage
    ? 'development'
    : process.env.NODE_ENV || 'production';

export const isRunningDevelopment = environment.startsWith( 'dev' );

export const isCI: boolean =
    remote && remote.getGlobal ? remote.getGlobal( 'isCI' ) : process.env.CI;
export const travisOS = process.env.TRAVIS_OS_NAME || '';
// other considerations?
export const isHot = process.env.HOT || 0;

const startAsMockNetwork = shouldStartAsMockFromFlagsOrPackage;

// only to be used for inital store setting in main process. Not guaranteed correct for renderers.
export const startedRunningMock: boolean =
    remote && remote.getGlobal
        ? remote.getGlobal( 'startedRunningMock' )
        : startAsMockNetwork || isRunningDevelopment;
export const startedRunningProduction = !startedRunningMock;
export const isRunningNodeEnvironmentTest = environment.startsWith( 'test' );
export const isRunningDebug = hasDebugFlag || isRunningTestCafeProcess;
export const isDryRun = hasDryRunFlag || isRunningTestCafeProcess;
export const inRendererProcess = typeof window !== 'undefined';
export const inMainProcess = typeof remote === 'undefined';

export const currentWindowId =
    remote && remote.getCurrentWindow
        ? remote.getCurrentWindow().id
        : undefined;

// Set global for tab preload.
// Adds app folder for asar packaging ( space before app is important ).
const preloadLocation = isRunningUnpacked ? '' : '../';

export const getAppFolderPath = () => {
    if ( remote && remote.app ) return remote.app.getPath( 'appData' );
    return app.getPath( 'appData' );
};
export const I18N_CONFIG = {
    locales: ['en'],
    directory: path.resolve( __dirname, 'locales' ),
    objectNotation: true
};

export const PROTOCOLS = {
    SAFE: 'safe',
    SAFE_AUTH: 'safe-auth',
    SAFE_LOGS: 'safe-logs',
    INTERNAL_PAGES: 'safe-browser'
};

export const CONFIG = {
    APP_HTML_PATH: path.resolve( __dirname, '..', './app.html' ),
    DATE_FORMAT: 'h:MM-mmm dd',
    NET_STATUS_CONNECTED: 'Connected'
};

if ( inMainProcess ) {
    const developmentPort = process.env.PORT || 1232;

    global.preloadFile = `file://${__dirname}/webPreload.prod.js`;
    global.appDirectory = __dirname;
    global.isCI = isCI;
    global.startedRunningMock = startedRunningMock;
    global.isRunningTestCafeProcess = isRunningTestCafeProcess;
    global.isRunningTestCafeProcessingPackagedApp = isRunningTestCafeProcessingPackagedApp;
    global.shouldStartAsMockFromFlagsOrPackage = shouldStartAsMockFromFlagsOrPackage;
    global.SAFE_NODE_LIB_PATH = CONFIG.SAFE_NODE_LIB_PATH;
}

export const LAUNCHPAD_APP_ID = '__LAUNCHPAD_APP_ID__';

// TODO: remove this from here...
export const defaultPreferences = {
    userPreferences: {
        autoUpdate: false,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: false,
        warnOnAccessingClearnet: true
    },
    appPreferences: {
        shouldOnboard: true
    }
};

export const settingsHandlerName = {
    production: 'preferences',
    test: 'testPreferences'
};
