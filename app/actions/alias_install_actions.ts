import { ipcRenderer } from 'electron';

// import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { inBgProcess } from '$Constants';
import { logger } from '$Logger';

export const TYPES = {
    ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP'
};

// export const {
//     setAuthLibStatus,
//     setAuthHandle,
//     setAuthNetworkStatus,
//     addAuthRequest,
//     removeAuthRequest,
//     setReAuthoriseState,
//     setIsAuthorisedState
// } = createActions(
//     TYPES.ALIS_INSTALL_APP,
//
// );

const installApplication = ( application: string ) => {
    logger.verbose( 'Handling install of app...', application );
    ipcRenderer.send( 'initiateDownload', application );
};

export const installApp = createAliasedAction(
    TYPES.ALIAS_INSTALL_APP,
    ( application ) => ( {
        // the real action
        type: TYPES.ALIAS_INSTALL_APP,
        payload: installApplication( application )
    } )
);
