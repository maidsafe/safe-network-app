import { appManager, initialState } from '$Reducers/app_manager_reducer';
import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as APP_TYPES } from '$Actions/application_actions';
import { TYPES as ALIAS_TYPES } from '$Actions/alias/app_manager_actions';
import { generateRandomString } from '$Utils/app_utils';
import { ERRORS } from '$Constants/errors';
import {
    App,
    // TODO: Correctly configure eslint so that following disable isn't necessary
    AppType // eslint-disable-line import/named
} from '$Definitions/application.d';

const getApp = (): App => ( {
    id: generateRandomString(),
    name: 'Safe Browser',
    packageName: 'safe-browser',
    type: 'userApplications' as AppType,
    repositoryOwner: 'joshuef',
    repositorySlug: 'safe_browser',
    latestVersion: '0.1.0',
    isInstalling: false,
    isUpdating: false,
    isUninstalling: false,
    isOpen: false,
    hasUpdate: false,
    lastSkippedVersion: null,
    error: null,
    progress: null
} );

let app1 = getApp();
let app2 = getApp();

let applicationList = {
    app1,
    app2
};

describe( 'app manager reducer', () => {
    beforeEach( () => {
        app1 = getApp();
        app2 = getApp();
        app2.name = 'Safe Wallet';

        applicationList = {
            app1,
            app2
        };
    } );

    it( 'should return the initial state', () => {
        expect( appManager( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'SET_APPS', () => {
        it( 'Should add apps to store', () => {
            const nextStore = appManager( undefined, {
                type: `${TYPES.SET_APPS}`,
                payload: applicationList
            } );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );
            expect( nextStore.applicationList[app1.id] ).toEqual( app1 );
            expect( nextStore.applicationList[app2.id] ).toEqual( app2 );
        } );

        it( 'Should throw if application has no ID', () => {
            applicationList.app1.name = 'Safe Browser';
            delete applicationList.app1.id;

            expect( () =>
                appManager( undefined, {
                    type: `${TYPES.SET_APPS}`,
                    payload: applicationList
                } )
            ).toThrow( ERRORS.APP_ID_NOT_FOUND );
        } );
    } );

    describe( 'SET_NEXT_RELEASE_DESCRIPTION', () => {
        it( 'Should update app next release description', () => {
            const startStore = appManager( undefined, {
                type: `${TYPES.SET_APPS}`,
                payload: applicationList
            } );

            const nextStore = appManager( startStore, {
                type: `${APP_TYPES.SET_NEXT_RELEASE_DESCRIPTION}`,
                payload: {
                    appId: app1.id,
                    updateDescription: 'Woooo new things!'
                }
            } );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );
            expect( nextStore.applicationList[app1.id] ).not.toEqual( app1 );
            expect( nextStore.applicationList[app2.id] ).toEqual( app2 );
        } );

        it( 'Should throw if application has no ID', () => {
            applicationList.app1.name = 'Safe Browser';
            delete applicationList.app1.id;

            expect( () =>
                appManager( undefined, {
                    type: `${TYPES.SET_APPS}`,
                    payload: applicationList
                } )
            ).toThrow( ERRORS.APP_ID_NOT_FOUND );
        } );
    } );

    describe( 'INSTALL_APP', () => {
        let store = null;

        beforeEach( () => {
            store = appManager( undefined, {
                type: `${TYPES.SET_APPS}`,
                payload: applicationList
            } );
        } );

        it( 'Should set application to installing', () => {
            const appId = app1.id;
            const otherAppId = app2.id;
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: { appId }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isInstalling ).toBeTruthy();
            expect( nextStore.applicationList[appId].isUninstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( 'Should return previous store if application not found', () => {
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                    payload: {}
                } )
            ).toEqual( store );
        } );

        it( 'Should update progress on installation', () => {
            const appId = app1.id;
            const otherAppId = app2.id;
            const progress = 89;
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: {
                    appId,
                    progress
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].progress ).toEqual( progress );
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( 'Should reset app installation on success', () => {
            const appId = app1.id;
            const otherAppId = app2.id;

            store.applicationList[appId].isUninstalling = true;
            store.applicationList[appId].isUpdating = true;

            let nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: {
                    appId
                }
            } );

            nextStore = appManager( nextStore, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_SUCCESS`,
                payload: {
                    appId
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect(
                nextStore.applicationList[appId].isUninstalling
            ).toBeTruthy();
            expect( nextStore.applicationList[appId].isUpdating ).toBeTruthy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 100 );
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( "Should return previous store if couldn't find app on app installation success", () => {
            const appId = app1.id;
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: {
                    appId
                }
            } );
            expect(
                appManager( nextStore, {
                    type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toEqual( nextStore );
        } );

        it( 'Should stop installation on failure', () => {
            const appId = app1.id;
            const otherAppId = app2.id;
            const installationError = new Error( 'Unable to install' );

            let nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: {
                    appId,
                    progress: 86
                }
            } );
            nextStore = appManager( nextStore, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_FAILURE`,
                payload: {
                    appId,
                    error: installationError
                }
            } );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
            expect( nextStore.applicationList[appId].error ).not.toBeNull();
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( "Should return previous store if couldn't find app on app installation failure", () => {
            const appId = app1.id;
            const installationError = new Error( 'Unable to install' );

            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`,
                payload: {
                    appId,
                    progress: 86
                }
            } );
            expect(
                appManager( nextStore, {
                    type: `${ALIAS_TYPES.ALIAS_INSTALL_APP}_FAILURE`,
                    payload: {}
                } )
            ).toEqual( nextStore );
        } );
    } );

    describe( 'CANCEL_APP_INSTALLATION', () => {
        it( 'Should cancel app installation', () => {
            const app = getApp();
            const otherApp = getApp();
            const appId = app.id;
            app.isInstalling = true;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.CANCEL_APP_INSTALLATION,
                payload: {
                    appId
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on app install cancellation", () => {
            const app = getApp();
            app.isInstalling = true;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.CANCEL_APP_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app not installing', () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.CANCEL_APP_INSTALLATION,
                    payload: {
                        appId
                    }
                } ).applicationList[appId].isInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'PAUSE_APP_INSTALLATION', () => {
        it( 'Should pause app installation', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.isInstalling = true;
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.PAUSE_APP_INSTALLATION,
                payload: {
                    appId
                }
            } );

            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( progress );
            expect( nextStore.applicationList[appId] ).not.toEqual(
                store.applicationList[appId]
            );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on pausing app install", () => {
            const progress = 76;
            const app = getApp();
            app.isInstalling = true;
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.PAUSE_APP_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app not installing', () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.PAUSE_APP_INSTALLATION,
                    payload: {
                        appId
                    }
                } ).applicationList[appId].isInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'RETRY_APP_INSTALLATION', () => {
        it( 'Should retry app installation', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.RETRY_APP_INSTALLATION,
                payload: {
                    appId
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isInstalling ).toBeTruthy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on retry installation", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RETRY_APP_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app already in installation', () => {
            const progress = 76;
            const app = getApp();
            app.isInstalling = true;
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RETRY_APP_INSTALLATION,
                    payload: {
                        appId
                    }
                } ).applicationList[appId].isInstalling
            ).toBeTruthy();
        } );
    } );

    describe( 'UNINSTALL_APP', () => {
        it( 'Should uninstall app', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_PENDING`,
                payload: {
                    appId
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect(
                nextStore.applicationList[appId].isUninstalling
            ).toBeTruthy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on uninstall", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_PENDING`,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should finish app uninstallation', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            app.isUninstalling = true;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };

            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_SUCCESS`,
                payload: {
                    appId
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isUninstalling ).toBeFalsy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on finishing uninstall", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toEqual( store );
        } );
    } );

    describe( 'UPDATE_APP', () => {
        it( 'Should update app', () => {
            const progress = 20;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_UPDATE_APP}_PENDING`,
                payload: {
                    appId,
                    progress
                }
            } );

            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isUpdating ).toBeTruthy();
            expect( nextStore.applicationList[appId].progress ).toEqual( progress );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on updating", () => {
            const progress = 20;
            const app = getApp();
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_UPDATE_APP}_PENDING`,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should finish app updating', () => {
            const progress = 20;
            const app = getApp();
            const otherApp = getApp();
            app.isUpdating = true;
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_UPDATE_APP}_SUCCESS`,
                payload: {
                    appId,
                    progress
                }
            } );

            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 100 );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on finishing update", () => {
            const progress = 80;
            const app = getApp();
            app.progress = progress;
            app.isUpdating = true;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_UPDATE_APP}_SUCCESS`,
                    payload: {}
                } )
            ).toEqual( store );
        } );

        it( 'Should stop updating on failure', () => {
            const progress = 80;
            const app = getApp();
            const otherApp = getApp();
            app.isUpdating = true;
            app.progress = progress;
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_UPDATE_APP}_FAILURE`,
                payload: {
                    appId,
                    progress,
                    error: new Error( 'Failed to update' )
                }
            } );
            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].progress ).toEqual( 0 );
            expect( nextStore.applicationList[appId].error ).not.toBeNull();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
    } );

    describe( 'SKIP_APP_UPDATE', () => {
        it( 'Should skip app from updating', () => {
            const newVersion = '0.12.0';
            const app = getApp();
            const otherApp = getApp();
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: `${ALIAS_TYPES.ALIAS_SKIP_APP_UPDATE}_PENDING`,
                payload: {
                    appId,
                    version: newVersion
                }
            } );

            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].lastSkippedVersion ).toEqual(
                newVersion
            );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on skipping update", () => {
            const newVersion = '0.12.0';
            const app = getApp();
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_SKIP_APP_UPDATE}_PENDING`,
                    payload: {
                        version: newVersion
                    }
                } )
            ).toEqual( store );
        } );
        it( 'Should throw if version to skip not found', () => {
            const newVersion = '0.12.0';
            const app = getApp();
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect( () =>
                appManager( store, {
                    type: `${ALIAS_TYPES.ALIAS_SKIP_APP_UPDATE}_PENDING`,
                    payload: {
                        appId
                    }
                } )
            ).toThrow( ERRORS.VERSION_NOT_FOUND );
        } );
    } );

    describe( 'RESET_APP_STATE', () => {
        it( 'Should reset app state', () => {
            const app = getApp();
            const otherApp = getApp();
            const appId = app.id;
            app.isUpdating = true;
            app.isInstalling = true;
            otherApp.isInstalling = true;
            app.isUninstalling = true;
            app.progress = 89;
            otherApp.progress = 20;
            app.error = new Error( 'Invalid property' );
            const store = {
                applicationList: {
                    [appId]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.RESET_APP_STATE,
                payload: {
                    appId
                }
            } );

            expect( nextStore.applicationList[appId].name ).toEqual(
                store.applicationList[appId].name
            );
            expect( nextStore.applicationList[appId].isInstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].isUninstalling ).toBeFalsy();
            expect( nextStore.applicationList[appId].isUpdating ).toBeFalsy();
            expect( nextStore.applicationList[appId].error ).toEqual( null );
            expect( nextStore.applicationList[appId].progress ).toEqual( null );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on skipping update", () => {
            const app = getApp();
            const appId = app.id;
            const store = {
                applicationList: {
                    [appId]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RESET_APP_STATE,
                    payload: {}
                } )
            ).toEqual( store );
        } );
    } );
} );
