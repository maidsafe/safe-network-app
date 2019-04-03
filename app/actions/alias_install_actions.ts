import { ipcRenderer } from 'electron';
import open from 'open';

// import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';

export const TYPES = {
    ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP',
    ALIAS_OPEN_APP: 'ALIAS_OPEN_APP',
    ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP'
};

const installApplication = ( application: string ) => {
    logger.verbose( 'Handling install of app...', application );
    ipcRenderer.send( 'initiateDownload', application );
};
const uninstallApplication = ( application: string ) => {
    logger.verbose( 'Handling uninstall of app...', application );
    ipcRenderer.send( 'uninstallApplication', application );
};

const openApplication = async ( application: string ) => {
    logger.verbose( 'Handling install of app...', application );

    await open( 'safe://sindresorhus.com', { app: ['SAFE Browser', '--debug'] } );
};

export const installApp = createAliasedAction(
    TYPES.ALIAS_INSTALL_APP,
    ( application ) => ( {
        // the real action
        type: TYPES.ALIAS_INSTALL_APP,
        payload: installApplication( application )
    } )
);

export const uninstallApp = createAliasedAction(
    TYPES.ALIAS_UNINSTALL_APP,
    ( application ) => ( {
        // the real action
        type: TYPES.ALIAS_UNINSTALL_APP,
        payload: uninstallApplication( application )
    } )
);

export const openApp = createAliasedAction(
    TYPES.ALIAS_OPEN_APP,
    ( application ) => ( {
        // the real action
        type: TYPES.ALIAS_OPEN_APP,
        payload: openApplication( application )
    } )
);
