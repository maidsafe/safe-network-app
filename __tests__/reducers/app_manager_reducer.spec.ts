import { appManager, initialState } from '$Reducers/app_manager_reducer';
import { TYPES } from '$Actions/app_manager_actions';
import { generateRandomString } from '../../app/utils/app_utils';

describe( 'app manager reducer', () => {
    it( 'should return the initial state', () => {
        expect( appManager( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'FETCH_APPS', () => {
        it( 'Should add apps to store on fetch success', () => {
            const applicationList = [
                {
                    id: generateRandomString(),
                    name: 'Safe Browser',
                    isInstalling: false,
                    isUpdating: false,
                    isUninstalling: false,
                    lastSkippedVersion: null,
                    error: null,
                    progress: null
                },
                {
                    id: generateRandomString(),
                    name: 'Safe Wallet',
                    isInstalling: false,
                    isUpdating: false,
                    isUninstalling: false,
                    lastSkippedVersion: null,
                    error: null,
                    progress: null
                }
            ];
            const newStore = appManager( undefined, {
                type: `${TYPES.FETCH_APPS}_SUCCESS`,
                payload: {
                    applicationList
                }
            } );
            expect( Object.keys( newStore.applicationList ).length ).toEqual( 2 );
        } );
        it( 'Should throw if application has no ID', () => {
            const applicationList = [
                {
                    id: generateRandomString(),
                    name: 'Safe Browser',
                    isInstalling: false,
                    isUpdating: false,
                    isUninstalling: false,
                    lastSkippedVersion: null,
                    error: null,
                    progress: null
                },
                {
                    name: 'Safe Wallet',
                    isInstalling: false,
                    isUpdating: false,
                    isUninstalling: false,
                    lastSkippedVersion: null,
                    error: null,
                    progress: null
                }
            ];
            expect( () =>
                appManager( undefined, {
                    type: `${TYPES.FETCH_APPS}_SUCCESS`,
                    payload: {
                        applicationList
                    }
                } )
            ).toThrow();
        } );
    } );

    describe( 'INSTALL_APP', () => {
        const applicationList = [
            {
                id: generateRandomString(),
                name: 'Safe Browser',
                isInstalling: false,
                isUpdating: false,
                isUninstalling: false,
                lastSkippedVersion: null,
                error: null,
                progress: null
            },
            {
                id: generateRandomString(),
                name: 'Safe Wallet',
                isInstalling: false,
                isUpdating: false,
                isUninstalling: false,
                lastSkippedVersion: null,
                error: null,
                progress: null
            }
        ];
        let newStore = null;

        beforeEach( () => {
            newStore = appManager( undefined, {
                type: `${TYPES.FETCH_APPS}_SUCCESS`,
                payload: { applicationList }
            } );
        } );

        it( 'Should set application to installing', () => {
            const appId = applicationList[0].id;
            expect(
                appManager( newStore, {
                    type: `${TYPES.INSTALL_APP}_PENDING`,
                    payload: { appId }
                } ).applicationList[appId].isInstalling
            ).toBeTruthy();
        } );

        it( 'Should throw if appId not found', () => {
            expect( () =>
                appManager( newStore, {
                    type: `${TYPES.INSTALL_APP}_PENDING`,
                    payload: {}
                } )
            ).toThrow();
        } );

        it( 'Should update progress on installation', () => {
            const appId = applicationList[0].id;
            expect(
                appManager( newStore, {
                    type: `${TYPES.INSTALL_APP}_PENDING`,
                    payload: { appId, progress: 89 }
                } ).applicationList[appId].progress
            ).toEqual( 89 );
        } );

        it( 'Should reset app installation on success', () => {
            const appId = applicationList[0].id;
            let nextStore = appManager( newStore, {
                type: `${TYPES.INSTALL_APP}_PENDING`,
                payload: { appId }
            } );

            nextStore = appManager( nextStore, {
                type: `${TYPES.INSTALL_APP}_SUCCESS`,
                payload: { appId }
            } );
            expect( nextStore.applicationList[appId].progress ).toEqual( 100 );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
        } );

        it( "Should throw if couldn't find app on app installation success", () => {
            const appId = applicationList[0].id;
            const nextStore = appManager( newStore, {
                type: `${TYPES.INSTALL_APP}_PENDING`,
                payload: { appId }
            } );
            expect( () =>
                appManager( nextStore, {
                    type: `${TYPES.INSTALL_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toThrow();
        } );

        it( 'Should stop installation on failure', () => {
            const appId = applicationList[0].id;
            const installationError = new Error( 'Unable to install' );

            let nextStore = appManager( newStore, {
                type: `${TYPES.INSTALL_APP}_PENDING`,
                payload: { appId, progress: 86 }
            } );
            nextStore = appManager( nextStore, {
                type: `${TYPES.INSTALL_APP}_FAILURE`,
                payload: { appId, error: installationError }
            } );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
            expect( nextStore.applicationList[appId].error ).not.toBeNull();
        } );

        it( "Should throw if couldn't find app on app installation failure", () => {
            const appId = applicationList[0].id;
            const installationError = new Error( 'Unable to install' );

            const nextStore = appManager( newStore, {
                type: `${TYPES.INSTALL_APP}_PENDING`,
                payload: { appId, progress: 86 }
            } );
            expect( () =>
                appManager( nextStore, {
                    type: `${TYPES.INSTALL_APP}_FAILURE`,
                    payload: {}
                } )
            ).toThrow();
        } );
    } );

    describe( 'CANCEL_APP_INSTALLATION', () => {
        it( 'Should cancel app installation', () => {
            const appId = generateRandomString();
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.CANCEL_APP_INSTALLATION,
                payload: { appId }
            } );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
        } );

        it( "Should throw if couldn't find app on app install cancellation", () => {
            const appId = generateRandomString();
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.CANCEL_APP_INSTALLATION,
                    payload: {}
                } )
            ).toThrow();
        } );
        it( 'Should return previous store if app not installing', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.CANCEL_APP_INSTALLATION,
                    payload: { appId }
                } ).applicationList[appId].isInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'PAUSE_APP_INSTALLATION', () => {
        it( 'Should pause app installation', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.PAUSE_APP_INSTALLATION,
                payload: { appId }
            } );

            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( progress );
        } );

        it( "Should throw if couldn't find app on pausing app install", () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.PAUSE_APP_INSTALLATION,
                    payload: {}
                } )
            ).toThrow();
        } );
        it( 'Should return previous store if app not installing', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.PAUSE_APP_INSTALLATION,
                    payload: { appId }
                } ).applicationList[appId].isInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'RETRY_APP_INSTALLATION', () => {
        it( 'Should retry app installation', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RETRY_APP_INSTALLATION,
                    payload: { appId }
                } ).applicationList[appId].isInstalling
            ).toBeTruthy();
        } );
        it( "Should throw if couldn't find app on retry installation", () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.RETRY_APP_INSTALLATION,
                    payload: {}
                } )
            ).toThrow();
        } );
        it( 'Should return previous store if app already in installation', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RETRY_APP_INSTALLATION,
                    payload: { appId }
                } ).applicationList[appId].isInstalling
            ).toBeTruthy();
        } );
    } );

    describe( 'UNINSTALL_APP', () => {
        it( 'Should uninstall app', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: `${TYPES.UNINSTALL_APP}_PENDING`,
                    payload: { appId }
                } ).applicationList[appId].isUninstalling
            ).toBeTruthy();
        } );
        it( "Should throw if couldn't find app on uninstall", () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: `${TYPES.UNINSTALL_APP}_PENDING`,
                    payload: {}
                } )
            ).toThrow();
        } );
        it( 'Should finish app uninstallation', () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: true,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect(
                appManager( store, {
                    type: `${TYPES.UNINSTALL_APP}_SUCCESS`,
                    payload: { appId }
                } ).applicationList[appId].isUninstalling
            ).toBeFalsy();
        } );
        it( "Should throw if couldn't find app on finishing uninstall", () => {
            const appId = generateRandomString();
            const progress = 76;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: `${TYPES.UNINSTALL_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toThrow();
        } );
    } );

    describe( 'UPDATE_APP', () => {
        it( 'Should update app', () => {
            const appId = generateRandomString();
            const progress = 20;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            const nextStore = appManager( store, {
                type: `${TYPES.UPDATE_APP}_PENDING`,
                payload: { appId, progress }
            } );

            expect( nextStore.applicationList[appId].isUpdating ).toBeTruthy();
            expect( nextStore.applicationList[appId].progress ).toEqual( progress );
        } );
        it( "Should throw if couldn't find app on updating", () => {
            const appId = generateRandomString();
            const progress = 20;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: `${TYPES.UPDATE_APP}_PENDING`,
                    payload: {}
                } )
            ).toThrow();
        } );
        it( 'Should finish app updating', () => {
            const appId = generateRandomString();
            const progress = 20;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            const nextStore = appManager( store, {
                type: `${TYPES.UPDATE_APP}_SUCCESS`,
                payload: { appId, progress }
            } );

            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 100 );
        } );

        it( "Should throw if couldn't find app on finishing update", () => {
            const appId = generateRandomString();
            const progress = 80;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: true,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: `${TYPES.UPDATE_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toThrow();
        } );

        it( 'Should stop updating on failure', () => {
            const appId = generateRandomString();
            const progress = 80;
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: true,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress
                    }
                }
            };
            const nextStore = appManager( store, {
                type: `${TYPES.UPDATE_APP}_FAILURE`,
                payload: {
                    appId,
                    progress,
                    error: new Error( 'Failed to update' )
                }
            } );
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
            expect( nextStore.applicationList[appId].error ).not.toBeNull();
        } );
    } );

    describe( 'SKIP_APP_UPDATE', () => {
        it( 'Should skip app from updating', () => {
            const appId = generateRandomString();
            const newVersion = '0.12.0';
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.SKIP_APP_UPDATE,
                    payload: { appId, version: newVersion }
                } ).applicationList[appId].lastSkippedVersion
            ).toEqual( newVersion );
        } );

        it( "Should throw if couldn't find app on skipping update", () => {
            const appId = generateRandomString();
            const newVersion = '0.12.0';
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.SKIP_APP_UPDATE,
                    payload: { version: newVersion }
                } )
            ).toThrow();
        } );
        it( 'Should throw if version to skip not found', () => {
            const appId = generateRandomString();
            const newVersion = '0.12.0';
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: false,
                        isUpdating: false,
                        isUninstalling: false,
                        lastSkippedVersion: null,
                        error: null,
                        progress: null
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.SKIP_APP_UPDATE,
                    payload: { appId }
                } )
            ).toThrow();
        } );
    } );

    describe( 'RESET_APP_STATE', () => {
        it( 'Should reset app state', () => {
            const appId = generateRandomString();
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: true,
                        isUninstalling: true,
                        lastSkippedVersion: null,
                        progress: 89,
                        error: new Error( 'Invalid property' )
                    }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.RESET_APP_STATE,
                payload: { appId }
            } );

            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].isUninstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].error ).toEqual( null );
            expect( nextStore.applicationList[appId].progress ).toEqual( null );
        } );

        it( "Should throw if couldn't find app on skipping update", () => {
            const appId = generateRandomString();
            const store = {
                applicationList: {
                    [appId]: {
                        id: appId,
                        name: 'Safe Browser',
                        isInstalling: true,
                        isUpdating: true,
                        isUninstalling: true,
                        lastSkippedVersion: null,
                        progress: 89,
                        error: new Error( 'Invalid property' )
                    }
                }
            };
            expect( () =>
                appManager( store, {
                    type: TYPES.RESET_APP_STATE,
                    payload: {}
                } )
            ).toThrow();
        } );
    } );
} );
