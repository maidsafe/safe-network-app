import { autoUpdater } from 'electron-updater';

import { logger } from '$Logger';
import {
    MAC_OS,
    LINUX,
    WINDOWS,
    platform,
    isRunningTestCafeProcess
} from '$Constants';
import { App } from '$Definitions/application.d';

export const getMaidsafeS3Folder = ( application: App ): string => {
    const { packageName } = application;
    const baseUrl = `https://sn-browser.s3.eu-west-2.amazonaws.com/${packageName}`;

    let targetUrl: string;

    logger.silly( 'Checking platform to get folder', platform );
    switch ( platform ) {
        case MAC_OS: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-mac/sn_browser-v0.15.1-mac-x64.dmg
            targetUrl = `${baseUrl}-mac`;
            break;
        }
        case WINDOWS: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-win/sn_browser-v0.15.1-win-x64.exe
            targetUrl = `${baseUrl}-win`;
            break;
        }
        case LINUX: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-linux/sn_browser-v0.15.1-linux-x64.AppImage
            targetUrl = `${baseUrl}-linux`;
            break;
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
    logger.info( 'S3 Target Folder: ', targetUrl );
    return targetUrl;
};
