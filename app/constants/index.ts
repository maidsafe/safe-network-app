import path from 'path';
import fs from 'fs-extra';
import { app, remote } from 'electron';

import pkg from '$Package';

export const LOG_FILE_NAME = 'safe-network-app.log';

export const { platform } = process;
export const MAC_OS = 'darwin';
export const LINUX = 'linux';
export const WINDOWS = 'win32';
export const isRunningOnMac = platform === MAC_OS;
export const isRunningOnWindows = platform === WINDOWS;
export const isRunningOnLinux = platform === LINUX;

declare const document: Document;

const allPassedArguments = process.argv;

let hasDebugFlag = false;
let hasDryRunFlag = false;
let shouldOpenDebugApps = false;
let shouldUseTestPackages = false;

export const isRunningTestCafeProcess =
    remote && remote.getGlobal
        ? remote.getGlobal( 'isRunningTestCafeProcess' )
        : process.env.TEST_CAFE || false;

export const APP_PATH = app ? app.getAppPath() : remote.app.getAppPath();
export const DEFAULT_APP_ICON_PATH = `${
    isRunningTestCafeProcess ? `${APP_PATH}/app` : APP_PATH
}/assets/icons`;

export const isRunningUnpacked = process.env.IS_UNPACKED;
export const isRunningPackaged = !isRunningUnpacked;
export const isRunningTestCafeProcessingPackagedApp =
    isRunningTestCafeProcess && isRunningPackaged;

export const inBgProcess = !!(
    typeof document !== 'undefined' && document.title.startsWith( 'Background' )
);

let ignoreAppLocationMacOs = false;

if ( allPassedArguments.includes( '--ignoreAppLocation' ) ) {
    ignoreAppLocationMacOs = true;
}
export const ignoreAppLocation = ignoreAppLocationMacOs;

if ( allPassedArguments.includes( '--debug' ) ) {
    hasDebugFlag = true;
}

if ( allPassedArguments.includes( '--dryRun' ) || process.env.SNAPP_DRY_RUN ) {
    hasDryRunFlag = true;
}

if (
    allPassedArguments.includes( `--openAppsAsDebug` ) ||
    process.env.SNAPP_OPEN_DEBUG_APPS
) {
    shouldOpenDebugApps = true;
}

if (
    allPassedArguments.includes( `--testPackages` ) ||
    process.env.SNAPP_TEST_PACKAGES
) {
    shouldUseTestPackages = true;
}

let forcedPort: number;
if ( allPassedArguments.includes( '--port' ) ) {
    const index = allPassedArguments.indexOf( '--port' );

    forcedPort = Number( allPassedArguments[index + 1] );
}

export const environment = process.env.NODE_ENV || 'production';

export const isRunningDevelopment = environment.startsWith( 'dev' );

export const isCI: boolean =
    remote && remote.getGlobal ? remote.getGlobal( 'isCI' ) : process.env.CI;
export const travisOS = process.env.TRAVIS_OS_NAME || '';
// other considerations?
export const isHot = process.env.HOT || 0;

export const isRunningNodeEnvironmentTest = environment.startsWith( 'test' );
export const isRunningDebug = hasDebugFlag;
export const isDryRun = hasDryRunFlag || isRunningTestCafeProcess;
export const inRendererProcess = typeof window !== 'undefined';
export const inMainProcess = typeof remote === 'undefined';
export const openAppsInDebugMode = shouldOpenDebugApps;
export const useTestPackages = shouldUseTestPackages;

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
    APP_HTML_PATH: path.join( __dirname, '..', './app.html' ),
    APP_HTML_PATH_ASAR: path.join( __dirname, './app.html' ),
    DATE_FORMAT: 'h:MM-mmm dd',
    NET_STATUS_CONNECTED: 'Connected'
};

if ( inMainProcess ) {
    const developmentPort = process.env.PORT || 1458;

    global.preloadFile = `file://${__dirname}/webPreload.prod.js`;
    global.appDirectory = __dirname;
    global.isCI = isCI;
    global.isRunningTestCafeProcess = isRunningTestCafeProcess;
    global.isRunningTestCafeProcessingPackagedApp = isRunningTestCafeProcessingPackagedApp;
}

export const LAUNCHPAD_APP_ID = '__LAUNCHPAD_APP_ID__';

// TODO: remove this from here...
export const defaultPreferences = {
    userPreferences: {
        autoUpdate: true,
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
