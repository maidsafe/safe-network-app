import { logger } from '$Logger';
import {
    MAC_OS,
    LINUX,
    WINDOWS,
    platform,
    isRunningTestCafeProcess
} from '$Constants';
import { App } from '$Definitions/application.d';

export const getS3Folder = ( application: App ): string => {
    // https://safe-network-app.s3.eu-west-2.amazonaws.com/safe-network-app-osx/safe-network-app-v0.0.3-mac-x64.zip

    // https://safe-browser.s3.eu-west-2.amazonaws.com/safe-browser-win/latest.yml
    const { packageName } = application;
    const baseUrl = `https://${packageName}.s3.eu-west-2.amazonaws.com/${packageName}`;

    let targetUrl: string;

    logger.silly( 'Checking platform to get folder', platform );
    switch ( platform ) {
        case MAC_OS: {
            // https://safe-browser.s3.eu-west-2.amazonaws.com/safe-browser-mac/safe-browser-v0.15.1-mac-x64.dmg
            targetUrl = `${baseUrl}-mac`;
            break;
        }
        case WINDOWS: {
            // https://safe-browser.s3.eu-west-2.amazonaws.com/safe-browser-win/safe-browser-v0.15.1-win-x64.exe
            targetUrl = `${baseUrl}-win`;
            break;
        }
        case LINUX: {
            // https://safe-browser.s3.eu-west-2.amazonaws.com/safe-browser-linux/safe-browser-v0.15.1-linux-x64.AppImage
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
