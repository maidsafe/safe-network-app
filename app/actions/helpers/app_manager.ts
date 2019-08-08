import { ipcRenderer } from 'electron';
import open from 'open';
import { isDryRun } from '$Constants';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

import { mockPromise } from './launchpad';

export const fetchTheApplicationListFromGithub = () => mockPromise();
// export const installApplicationById = ( application : App ) => {
//         ipcRenderer.send( 'initiateDownload', application );
// };
export const uninstallApplicationById = ( application: App ) => mockPromise();
export const updateApplicationById = ( application: App ) => mockPromise();
export const checkForApplicationUpdateById = ( application: App ) =>
    mockPromise();
export const storeApplicationSkipVersion = ( application: App ) => mockPromise();

//
// export const TYPES = {
//     ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP',
//     ALIAS_OPEN_APP: 'ALIAS_OPEN_APP',
//     ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP'
// };
//
// const installApplication = ( application: App ) => {
// };
// const uninstallApplication = ( application: App ) => {
//     ipcRenderer.send( 'uninstallApplication', application );
// };
//
// const openApplication = async ( application: App ) => {
//     if ( isDryRun ) {
//         logger.info( `DRY RUN: Would have opened ${application.name}` );
//         return;
//     }
//
//     await open( 'safe://sindresorhus.com', { app: ['SAFE Browser', '--debug'] } );
// };
//
// export const installApp = createAliasedAction(
//     TYPES.ALIAS_INSTALL_APP,
//     ( application: App ) => ( {
//         // the real action
//         type: TYPES.ALIAS_INSTALL_APP,
//         payload: installApplication( application )
//     } )
// );
//
// export const uninstallApp = createAliasedAction(
//     TYPES.ALIAS_UNINSTALL_APP,
//     ( application: App ) => ( {
//         // the real action
//         type: TYPES.ALIAS_UNINSTALL_APP,
//         payload: uninstallApplication( application )
//     } )
// );
//
// export const openApp = createAliasedAction(
//     TYPES.ALIAS_OPEN_APP,
//     ( application: App ) => ( {
//         // the real action
//         type: TYPES.ALIAS_OPEN_APP,
//         payload: openApplication( application )
//     } )
// );
