import path from 'path';

import { Store } from 'redux';
import fs from 'fs-extra';
import {
    MAC_OS,
    LINUX,
    WINDOWS,
    platform,
    isRunningOnWindows,
    isRunningOnLinux,
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
            applicationExecutable = path.join(
                `${application.packageName || application.name}`,
                `${application.name || application.packageName}.exe`
            );
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

export const checkIfAppIsInstalledLocally = async (
    application
): Promise<boolean> => {
    const applicationExecutable = getApplicationExecutable( application );

    const installedPath = getInstalledLocation( application );

    const exists = await fs.pathExists( installedPath );

    logger.warn( 'Checking if path exists', installedPath, exists );

    return exists;
};

export const getLocalAppVersion = ( application, store: Store ): string => {
    logger.warn(
        'Checking locally installed version: ',
        path.resolve( INSTALL_TARGET_DIR, application.packageName, 'version' )
    );

    try {
        // default to MacOs
        let versionFilePath = path.resolve(
            getInstalledLocation( application ),
            'Contents/Resources/version'
        );

        if ( isRunningOnWindows ) {
            versionFilePath = path.resolve(
                getInstalledLocation( application ),
                'version'
            );
        }

        if ( isRunningOnLinux ) {
            // need to mount appIMage to view contents...

            // my.AppImage --appimage-mount
            versionFilePath = path.resolve(
                INSTALL_TARGET_DIR,
                application.packageName,
                'version'
            );
        }

        const localVersion = fs.readFileSync( versionFilePath ).toString();

        logger.info( 'Version found was: ', localVersion );

        store.dispatch(
            setCurrentVersion( {
                ...application,
                currentVersion: localVersion
            } )
        );
        return localVersion;
    } catch ( error ) {
        return null;
    }
};
