import { ipcRenderer } from 'electron';
import open from 'open';
import { createAliasedAction } from 'electron-redux';
import { isDryRun } from '$Constants';
// import { createActions } from 'redux-actions';
import { logger } from '$Logger';
import { ManagedApplication } from '$Definitions/application.d';

export const TYPES = {
    ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP',
    ALIAS_OPEN_APP: 'ALIAS_OPEN_APP',
    ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP'
};

const installApplication = ( application: ManagedApplication ) => {
    ipcRenderer.send( 'initiateDownload', application );
};
const uninstallApplication = ( application: ManagedApplication ) => {
    ipcRenderer.send( 'uninstallApplication', application );
};

const openApplication = async ( application: ManagedApplication ) => {
    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have opened ${application.name}` );
        return;
    }

    await open( 'safe://sindresorhus.com', { app: ['SAFE Browser', '--debug'] } );
};

export const installApp = createAliasedAction(
    TYPES.ALIAS_INSTALL_APP,
    ( application: ManagedApplication ) => ( {
        // the real action
        type: TYPES.ALIAS_INSTALL_APP,
        payload: installApplication( application )
    } )
);

export const uninstallApp = createAliasedAction(
    TYPES.ALIAS_UNINSTALL_APP,
    ( application: ManagedApplication ) => ( {
        // the real action
        type: TYPES.ALIAS_UNINSTALL_APP,
        payload: uninstallApplication( application )
    } )
);

export const openApp = createAliasedAction(
    TYPES.ALIAS_OPEN_APP,
    ( application: ManagedApplication ) => ( {
        // the real action
        type: TYPES.ALIAS_OPEN_APP,
        payload: openApplication( application )
    } )
);
