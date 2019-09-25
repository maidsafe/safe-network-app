import path from 'path';

import { Store } from 'redux';
import fs from 'fs-extra';
import {
    MAC_OS,
    LINUX,
    WINDOWS,
    platform,
    isRunningTestCafeProcess
} from '$Constants';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';

import { setCurrentVersion } from '$Actions/application_actions';

import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

export const delay = ( time: number ): Promise<void> =>
    new Promise(
        ( resolve ): ReturnType<typeof setTimeout> => setTimeout( resolve, time )
    );

export const getApplicationExecutable = ( application: App ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.

    let applicationExecutable: string;

    switch ( platform ) {
        case MAC_OS: {
            applicationExecutable = `${application.name ||
                application.packageName}.app`;
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

    const installedPath = path.join( INSTALL_TARGET_DIR, applicationExecutable );

    return installedPath;
};

export const checkForKnownAppsLocally = async ( store: Store ): Promise<void> => {
    logger.info( 'Checking for currently isntalled known apps' );

    const knownApps = store.getState().appManager.applicationList;

    if ( isRunningTestCafeProcess ) return;

    Object.keys( knownApps ).forEach( async ( theAppId ) => {
        const application = knownApps[theAppId];

        const applicationExecutable = getApplicationExecutable( application );

        const installedPath = path.resolve(
            INSTALL_TARGET_DIR,
            applicationExecutable
        );

        const exists = await fs.pathExists( installedPath );

        logger.warn( 'Checking if path exists', installedPath, exists );

        if ( exists ) {
            store.dispatch(
                setCurrentVersion( {
                    ...application,
                    currentVersion: '1.0.0'
                } )
            );
        }
        // fs grab version somehow...
    } );
};
