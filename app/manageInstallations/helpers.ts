import path from 'path';

import { MAC_OS, LINUX, WINDOWS, platform } from '$Constants';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';

import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

export const getApplicationExecutable = ( application: App ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.

    let applicationExecutable: string;

    switch ( platform ) {
        case MAC_OS: {
            applicationExecutable = `${application.packageName ||
                application.name}.app`;
            break;
        }
        case WINDOWS: {
            applicationExecutable = `${application.packageName ||
                application.name}.exe`;
            break;
        }
        case LINUX: {
            applicationExecutable = `${application.packageName ||
                application.name}.AppImage`;
            break;
            // electron-react-boilerplate-0.1.0-x86_64.AppImage
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
    logger.verbose( 'Executable is called: ', applicationExecutable );
    return applicationExecutable;
};

export const getInstalledLocation = ( application: App ): string => {
    const applicationExecutable = getApplicationExecutable( application );

    const installedPath = path.resolve(
        INSTALL_TARGET_DIR,
        applicationExecutable
    );

    return installedPath;
};
