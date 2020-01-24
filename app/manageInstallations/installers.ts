import { app } from 'electron';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { Store } from 'redux';
import dmg from 'dmg';

import {
    downloadAndInstallAppSuccess,
    downloadAndInstallAppFailure
} from '$Actions/application_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';
import { logger } from '$Logger';
import {
    delay,
    getApplicationExecutable
} from '$App/manageInstallations/helpers';
import { App } from '$Definitions/application.d';
import {
    DESKTOP_APP_INSTALL_TARGET_DIR,
    ELECTRON,
    BIN
} from '$Constants/installConstants';
import {
    silentInstallAppOnMacOS,
    silentInstallAppOnWindows,
    silentInstallAppOnLinux
} from '$App/manageInstallations/desktopApps/installers';
import { silentInstallBin } from '$App/manageInstallations/bins/installers';

const installElectronApplication = (
    store: Store,
    application: App,
    downloadLocation: string
): void => {
    const applicationExecutable = getApplicationExecutable( application );

    logger.info( 'Silent install will install as:', applicationExecutable );
    switch ( platform ) {
        case MAC_OS: {
            silentInstallAppOnMacOS(
                store,
                application,
                applicationExecutable,
                downloadLocation
            );
            break;
        }
        case WINDOWS: {
            silentInstallAppOnWindows( store, application, downloadLocation );
            break;
        }
        case LINUX: {
            silentInstallAppOnLinux(
                store,
                application,
                applicationExecutable,
                downloadLocation
            );
            break;
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
};
const installBin = (
    store: Store,
    application: App,
    downloadLocation: string
): void => {
    const applicationExecutable = getApplicationExecutable( application );

    logger.info( 'silent install will install bin as:', applicationExecutable );
    silentInstallBin(
        store,
        application,
        // applicationExecutable,
        downloadLocation
    );
};

export const silentInstall = async (
    store: Store,
    application: App,
    downloadLocation?: string
): Promise<void> => {
    logger.info( 'Running silent install for ', downloadLocation );

    if ( isDryRun ) {
        await delay( 500 );
    }

    if ( application.type === ELECTRON ) {
        installElectronApplication( store, application, downloadLocation );
    }

    if ( application.type === BIN )
        installBin( store, application, downloadLocation );
};
