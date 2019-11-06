import { appManager, initialState } from '$Reducers/app_manager_reducer';
import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as APP_TYPES } from '$Actions/application_actions';
import { TYPES as ALIAS__TYPES } from '$Actions/alias/app_manager_actions';
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
    author: 'Maidsafe',
    size: '2MB',
    description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    updateDescription:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    packageName: 'safe-browser',
    iconPath: '/some/path/to/icon.png',
    type: 'userApplications' as AppType,
    repositoryOwner: 'joshuef',
    repositorySlug: 'safe_browser',
    currentVersion: null,
    latestVersion: '0.1.0',
    isDownloadingAndInstalling: false,
    isDownloadingAndUpdating: false,
    isUninstalling: false,
    isOpen: false,
    isUpdating: false,
    hasUpdate: false,
    lastSkippedVersion: null,
    error: null,
    progress: null,
    isInstalled: false
} );

let app1 = getApp();
let app2 = getApp();

let applicationList = {
    [app1.id]: app1,
    [app2.id]: app2
};

describe( 'app manager reducer', () => {
    beforeEach( () => {
        app1 = getApp();
        app2 = getApp();
        app2.name = 'Safe Wallet';

        applicationList = {
            [app1.id]: app1,
            [app2.id]: app2
        };
    } );

    it( 'should return the initial state', () => {
        expect( appManager( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'UPDATE_APP_INFO_IF_NEWER', () => {
        it( 'Should add apps to store when not existing', () => {
            const newApp = { ...app1, id: 'safe.browser2' };
            const nextStore = appManager(
                { applicationList },
                {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: newApp
                }
            );

            // 3 as theres the initital app state of app1, app2.....
            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 3 );

            expect( nextStore.applicationList[app1.id] ).toEqual( app1 );
        } );

        it( 'Should throw if application has no ID', () => {
            const newApp = { ...app1 };

            delete newApp.id;

            expect( () =>
                appManager( undefined, {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: newApp
                } )
            ).toThrow( ERRORS.APP_ID_NOT_FOUND );
        } );

        it( 'Should throw if application has no version', () => {
            const newApp = { ...app1 };

            delete newApp.latestVersion;

            expect( () =>
                appManager( undefined, {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: newApp
                } )
            ).toThrow( ERRORS.VERSION_NOT_FOUND );
        } );

        it( 'Should update application info to newer version, and not set current when not installed', () => {
            const updatedApp1 = { ...app1 };
            updatedApp1.latestVersion = '1.1.0';

            const nextStore = appManager(
                { applicationList },
                {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: updatedApp1
                }
            );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );

            // app1.isInstalled = undefined;
            expect( nextStore.applicationList[app1.id].id ).toEqual( app1.id );
            expect( nextStore.applicationList[app1.id].latestVersion ).toEqual(
                '1.1.0'
            );
            expect(
                nextStore.applicationList[app1.id].currentVersion
            ).toBeNull();
            expect( nextStore.applicationList[app1.id].hasUpdate ).toBeFalsy();
        } );

        it( 'When installed Should update application info to newer version, and set current version and hasUpdate', () => {
            const updatedApp1 = { ...app1 };
            applicationList[app1.id].currentVersion = '0.1.0';
            applicationList[app1.id].isInstalled = true;
            updatedApp1.latestVersion = '1.1.0';

            const nextStore = appManager(
                { applicationList },
                {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: updatedApp1
                }
            );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );

            // app1.isInstalled = undefined;
            expect( nextStore.applicationList[app1.id].id ).toEqual( app1.id );
            expect( nextStore.applicationList[app1.id].latestVersion ).toEqual(
                '1.1.0'
            );
            expect( nextStore.applicationList[app1.id].currentVersion ).toEqual(
                '0.1.0'
            );
            expect( nextStore.applicationList[app1.id].currentVersion ).toEqual(
                applicationList[app1.id].latestVersion
            );
            expect( nextStore.applicationList[app1.id].hasUpdate ).toBeTruthy();
        } );

        it( 'Should overwrite the install state from newer version info', () => {
            const newAppInfo = { ...app1, isInstalled: true };

            const nextStore = appManager(
                { applicationList },
                {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: newAppInfo
                }
            );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );
            expect( nextStore.applicationList[app1.id].isInstalled ).toBeTruthy();
        } );

        it( 'Should NOT update application newer version when lower', () => {
            const newAppInfo = { ...app1 };

            newAppInfo.name = 'LAME Browser';
            newAppInfo.latestVersion = '0.0.1';

            const nextStore = appManager(
                { applicationList },
                {
                    type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                    payload: newAppInfo
                }
            );

            expect( Object.keys( nextStore.applicationList ).length ).toEqual( 2 );
            expect( nextStore.applicationList[app1.id].name ).not.toEqual(
                'LAME Browser'
            );
            expect(
                nextStore.applicationList[app1.id].latestVersion
            ).not.toEqual( '0.0.1' );
        } );
    } );

    describe( 'INSTALL_APP', () => {
        let store = null;

        beforeEach( () => {
            store = appManager( undefined, {
                type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                payload: applicationList[app1.id]
            } );
            store = appManager( store, {
                type: `${TYPES.UPDATE_APP_INFO_IF_NEWER}`,
                payload: applicationList[app2.id]
            } );
        } );

        it( 'Should set application to installing', () => {
            const { id } = app1;
            const otherAppId = app2.id;
            const nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: { id }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeTruthy();
            expect( nextStore.applicationList[id].isUninstalling ).toBeFalsy();
            expect(
                nextStore.applicationList[id].isDownloadingAndUpdating
            ).toBeFalsy();
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( 'Should return previous store if application not found', () => {
            expect(
                appManager( store, {
                    type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                    payload: {}
                } )
            ).toEqual( store );
        } );

        it( 'Should update progress on installation', () => {
            const { id } = app1;
            const otherAppId = app2.id;
            const progress = 89;
            const nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: {
                    id,
                    progress
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].progress ).toEqual( progress );
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( 'Should reset app installation on success', () => {
            const { id } = app1;
            const otherAppId = app2.id;

            store.applicationList[id].isUninstalling = true;
            store.applicationList[id].isDownloadingAndUpdating = true;

            let nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: {
                    id
                }
            } );

            nextStore = appManager( nextStore, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_SUCCESS,
                payload: {
                    id
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
            expect( nextStore.applicationList[id].isUninstalling ).toBeTruthy();
            expect(
                nextStore.applicationList[id].isDownloadingAndUpdating
            ).toBeTruthy();
            expect( nextStore.applicationList[id].progress ).toEqual( 0 );
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( "Should return previous store if couldn't find app on app installation success", () => {
            const { id } = app1;
            const nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: {
                    id
                }
            } );
            expect(
                appManager( nextStore, {
                    type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_SUCCESS,
                    payload: {}
                } )
            ).toEqual( nextStore );
        } );

        it( 'Should stop installation on failure', () => {
            const { id } = app1;
            const otherAppId = app2.id;
            const installationError = new Error( 'Unable to install' );
            const progress = 86;
            let nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: {
                    id,
                    progress
                }
            } );
            nextStore = appManager( nextStore, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_FAILURE,
                payload: {
                    id,
                    error: installationError
                }
            } );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
            expect( nextStore.applicationList[id].progress ).toEqual( progress );
            expect( nextStore.applicationList[id].error ).not.toBeNull();
            expect( nextStore.applicationList[otherAppId] ).toEqual(
                store.applicationList[otherAppId]
            );
        } );

        it( "Should return previous store if couldn't find app on app installation failure", () => {
            const { id } = app1;
            const installationError = new Error( 'Unable to install' );

            const nextStore = appManager( store, {
                type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING,
                payload: {
                    id,
                    progress: 86
                }
            } );
            expect(
                appManager( nextStore, {
                    type: APP_TYPES.DOWNLOAD_AND_INSTALL_APP_FAILURE,
                    payload: {}
                } )
            ).toEqual( nextStore );
        } );
    } );

    describe( 'CANCEL_APP_DOWNLOAD_AND_INSTALLATION', () => {
        it( 'Should cancel app installation', () => {
            const app = getApp();
            const otherApp = getApp();
            const { id } = app;
            app.isDownloadingAndInstalling = true;
            const store = {
                applicationList: {
                    [id]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: APP_TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION,
                payload: {
                    id
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
            expect( nextStore.applicationList[id].progress ).toEqual( 0 );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on app install cancellation", () => {
            const app = getApp();
            app.isDownloadingAndInstalling = true;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app not installing', () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {
                        id
                    }
                } ).applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'PAUSE_APP_DOWNLOAD_AND_INSTALLATION', () => {
        it( 'Should pause app installation', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.isDownloadingAndInstalling = true;
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: APP_TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION,
                payload: {
                    id
                }
            } );

            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeTruthy();
            expect( nextStore.applicationList[id].progress ).toEqual( progress );
            expect( nextStore.applicationList[id] ).not.toEqual(
                store.applicationList[id]
            );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on pausing app install", () => {
            const progress = 76;
            const app = getApp();
            app.isDownloadingAndInstalling = true;
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app not installing', () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {
                        id
                    }
                } ).applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
        } );
    } );

    describe( 'RESUME_APP_DOWNLOAD_AND_INSTALLATION', () => {
        it( 'Should resume app installation', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app, isDownloadingAndInstalling: true },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: APP_TYPES.RESUME_APP_DOWNLOAD_AND_INSTALLATION,
                payload: {
                    id
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeTruthy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on retry installation", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.RESUME_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {}
                } )
            ).toEqual( store );
        } );
        it( 'Should return previous store if app already in installation', () => {
            const progress = 76;
            const app = getApp();
            app.isDownloadingAndInstalling = true;
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.RESUME_APP_DOWNLOAD_AND_INSTALLATION,
                    payload: {
                        id
                    }
                } ).applicationList[id].isDownloadingAndInstalling
            ).toBeTruthy();
        } );
    } );

    describe( 'UNINSTALL_APP', () => {
        it( 'Should uninstall app', () => {
            const progress = 76;
            const app = getApp();
            const otherApp = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: APP_TYPES.UNINSTALL_APP_PENDING,
                payload: {
                    id
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].isUninstalling ).toBeTruthy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on uninstall", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.UNINSTALL_APP_PENDING,
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
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };

            const nextStore = appManager( store, {
                type: APP_TYPES.UNINSTALL_APP_SUCCESS,
                payload: {
                    id
                }
            } );
            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].isUninstalling ).toBeFalsy();
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );
        it( "Should return previous store if couldn't find app on finishing uninstall", () => {
            const progress = 76;
            const app = getApp();
            app.progress = progress;
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app, hasUpdate: true }
                }
            };
            expect(
                appManager( store, {
                    type: APP_TYPES.UNINSTALL_APP_SUCCESS,
                    payload: {}
                } )
            ).toEqual( store );
        } );
    } );

    describe( 'APP_HAS_UPDATE', () => {
        it( 'Should set update flag for specific application', () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            const expectedStoreWithFlagSet = {
                applicationList: {
                    [id]: { ...app, hasUpdate: true }
                }
            };

            const expectedStoreWithFlagUnset = {
                applicationList: {
                    [id]: { ...app, hasUpdate: false }
                }
            };

            expect(
                appManager( store, {
                    type: TYPES.APP_HAS_UPDATE,
                    payload: {
                        id,
                        hasUpdate: true
                    }
                } )
            ).toEqual( expectedStoreWithFlagSet );
            expect(
                appManager( store, {
                    type: TYPES.APP_HAS_UPDATE,
                    payload: {
                        id,
                        hasUpdate: false
                    }
                } )
            ).toEqual( expectedStoreWithFlagUnset );
        } );

        it( 'Should do nothing if app not specified', () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.APP_HAS_UPDATE,
                    payload: {
                        hasUpdate: true
                    }
                } )
            ).toEqual( store );
        } );
    } );

    describe( 'RESET_APP_UPDATE_STATE', () => {
        it( 'Should reset app state on updated', () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app, hasUpdate: true }
                }
            };

            const expectStore = {
                applicationList: {
                    [id]: { ...app, hasUpdate: false, isUpdating: false }
                }
            };

            expect(
                appManager( store, {
                    type: TYPES.RESET_APP_UPDATE_STATE,
                    payload: {
                        id
                    }
                } )
            ).toEqual( expectStore );
        } );

        it( 'Should has no change if app has no update', () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            expect(
                appManager( store, {
                    type: TYPES.RESET_APP_UPDATE_STATE,
                    payload: { id }
                } )
            ).toEqual( store );
        } );

        it( 'Should has no change if app is not specified', () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            expect(
                appManager( store, {
                    type: TYPES.RESET_APP_UPDATE_STATE,
                    payload: {}
                } )
            ).toEqual( store );
        } );
    } );

    describe( 'SET_CURRENT_VERSION', () => {
        it( 'Should update current version and install status', () => {
            const app = getApp();

            app.isInstalled = false;

            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            const nextStore = appManager( store, {
                type: APP_TYPES.SET_CURRENT_VERSION,
                payload: {
                    ...app,
                    currentVersion: '42.1.3'
                }
            } );

            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].isInstalled ).toBeTruthy();
            expect( nextStore.applicationList[id].currentVersion ).toEqual(
                '42.1.3'
            );
        } );

        it( 'Should update latest version if current is higher version', () => {
            const app = getApp();

            app.latestVersion = '14.0.0';

            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            const nextStore = appManager( store, {
                type: APP_TYPES.SET_CURRENT_VERSION,
                payload: {
                    ...app,
                    currentVersion: '42.1.3'
                }
            } );

            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].isInstalled ).toBeTruthy();
            expect( nextStore.applicationList[id].currentVersion ).toEqual(
                '42.1.3'
            );
            expect( nextStore.applicationList[id].latestVersion ).toEqual(
                '42.1.3'
            );
        } );
        it( 'Should not update latest version if current is not higher version', () => {
            const app = getApp();

            app.latestVersion = '50.200.6';

            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };

            const nextStore = appManager( store, {
                type: APP_TYPES.SET_CURRENT_VERSION,
                payload: {
                    ...app,
                    currentVersion: '42.1.3'
                }
            } );

            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect( nextStore.applicationList[id].isInstalled ).toBeTruthy();
            expect( nextStore.applicationList[id].currentVersion ).toEqual(
                '42.1.3'
            );
            expect( nextStore.applicationList[id].latestVersion ).toEqual(
                '50.200.6'
            );
        } );
    } );

    describe( 'RESET_APP_INSTALLATION_STATE', () => {
        it( 'Should reset app state', () => {
            const app = getApp();
            const otherApp = getApp();
            const { id } = app;
            app.isDownloadingAndUpdating = true;
            app.isDownloadingAndInstalling = true;
            otherApp.isDownloadingAndInstalling = true;
            app.isUninstalling = true;
            app.progress = 89;
            otherApp.progress = 20;
            app.error = new Error( 'Invalid property' );
            const store = {
                applicationList: {
                    [id]: { ...app },
                    [otherApp.id]: { ...otherApp }
                }
            };
            const nextStore = appManager( store, {
                type: TYPES.RESET_APP_INSTALLATION_STATE,
                payload: {
                    id
                }
            } );

            expect( nextStore.applicationList[id].name ).toEqual(
                store.applicationList[id].name
            );
            expect(
                nextStore.applicationList[id].isDownloadingAndInstalling
            ).toBeFalsy();
            expect( nextStore.applicationList[id].isUninstalling ).toBeFalsy();
            expect(
                nextStore.applicationList[id].isDownloadingAndUpdating
            ).toBeFalsy();
            expect( nextStore.applicationList[id].error ).toEqual( null );
            expect( nextStore.applicationList[id].progress ).toEqual( null );
            expect( nextStore.applicationList[otherApp.id] ).toEqual(
                store.applicationList[otherApp.id]
            );
        } );

        it( "Should return previous store if couldn't find app on skipping update", () => {
            const app = getApp();
            const { id } = app;
            const store = {
                applicationList: {
                    [id]: { ...app }
                }
            };
            expect(
                appManager( store, {
                    type: TYPES.RESET_APP_INSTALLATION_STATE,
                    payload: {}
                } )
            ).toEqual( store );
        } );
    } );
} );
