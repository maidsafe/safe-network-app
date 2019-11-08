import * as fs from 'fs-extra';
import { app, Menu, shell } from 'electron';
import { Store } from 'redux';
import path from 'path';
import { push } from 'connected-react-router';
import {
    pushNotification,
    setUserPreferences,
    setAppPreferences
} from '$Actions/launchpad_actions';
import {
    resetToInitialState,
    resetAppUpdateState,
    appHasUpdate
} from '$Actions/app_manager_actions';
import { addAuthRequestToPendingList } from '$Actions/alias/authd_actions';
import { notificationTypes } from '$Constants/notifications';
import {
    isRunningTestCafeProcess,
    isHot,
    defaultPreferences,
    isRunningDebug
} from '$Constants/index';
import { updateSharedVaultConfig } from '$App/updateSharedVaultConfig';
import {
    storePreferences,
    quitApplication
} from '$Actions/alias/launchpad_actions';
import { safeAppUpdater } from './manageInstallations/safeAppUpdater';
import { Application } from './definitions/application.d';
import { logger } from '$Logger';
import pkg from '$Package';

import { PERMISSIONS_PENDING } from '$Constants/routes.json';

const subMenuHelp = {
    label: 'Help',
    submenu: [
        {
            label: 'Learn More',
            click() {
                shell.openExternal( 'http://safenetwork.tech' );
            }
        },
        {
            label: 'Documentation',
            click() {
                shell.openExternal(
                    'https://github.com/maidsafe/safe-network-app'
                );
            }
        },
        {
            label: 'Community Discussions',
            click() {
                shell.openExternal( 'https://safenetforum.org/' );
            }
        },
        {
            label: 'Search Issues',
            click() {
                shell.openExternal(
                    'https://github.com/maidsafe/safe-network-app/issues'
                );
            }
        },
        {
            label: 'Update shared vault config',
            click() {
                updateSharedVaultConfig();
            }
        }
    ]
};

const setupTestsMenu = ( store: Store ) => {
    return {
        label: 'Tests',
        submenu: [
            {
                label: 'Reset application list',
                click: () => {
                    store.dispatch( resetToInitialState() );
                }
            },
            {
                label: 'Add a No Internet Notification',
                click: () => {
                    store.dispatch(
                        pushNotification( notificationTypes.NO_INTERNET() )
                    );
                }
            },
            {
                label: 'Add a Disc Full Notification',
                click: () => {
                    const application = { id: Math.random().toString( 36 ) };
                    store.dispatch(
                        pushNotification(
                            notificationTypes.DISC_FULL( application )
                        )
                    );
                }
            },
            {
                label: 'Add a Global Failure Notification',
                click: () => {
                    const application = { id: Math.random().toString( 36 ) };
                    store.dispatch(
                        pushNotification(
                            notificationTypes.GLOBAL_FAILURE( application )
                        )
                    );
                }
            },
            {
                label: 'Add a Update Available Notification',
                click: () => {
                    const application = {
                        id: Math.random().toString( 36 ),
                        name: 'SAFE Browser'
                    };

                    const version = 'v1.0';
                    store.dispatch(
                        pushNotification(
                            notificationTypes.UPDATE_AVAILABLE(
                                application,
                                version
                            )
                        )
                    );
                }
            },
            {
                label: 'Add a Admin Pass Req Notification',
                click: () => {
                    const application = {
                        id: Math.random().toString( 36 ),
                        name: 'SAFE Browser'
                    };

                    store.dispatch(
                        pushNotification(
                            notificationTypes.ADMIN_PASS_REQ( application )
                        )
                    );
                }
            },
            {
                label: 'Add a Server Timed Out Notification',
                click: () => {
                    const application = {
                        id: Math.random().toString( 36 ),
                        name: 'SAFE Browser'
                    };

                    store.dispatch(
                        pushNotification(
                            notificationTypes.SERVER_TIMED_OUT( application )
                        )
                    );
                }
            },
            {
                label: 'Reset Preferences',
                click: () => {
                    store.dispatch( storePreferences( defaultPreferences ) );
                    store.dispatch(
                        setUserPreferences( defaultPreferences.userPreferences )
                    );
                }
            },
            {
                label: 'OnBoard App',
                click: () => {
                    store.dispatch( setAppPreferences( { shouldOnboard: true } ) );
                }
            },
            {
                label: 'Skip OnBoard App',
                click: () => {
                    store.dispatch( setAppPreferences( { shouldOnboard: false } ) );
                }
            },
            {
                label: 'Check Safe Applications Update',
                click: () => {
                    const application = {
                        id: 'safe.browser',
                        hasUpdate: true
                    };
                    store.dispatch( appHasUpdate( application ) );
                }
            },
            {
                label: 'App Update Complete',
                click: () => {
                    const application = {
                        id: 'safe.browser'
                    };
                    store.dispatch( resetAppUpdateState( application ) );
                }
            },
            {
                label: 'Trigger Permission Request',
                click: () => {
                    store.dispatch(
                        addAuthRequestToPendingList( {
                            appId: 'test app',
                            requestId: 42
                        } )
                    );

                    store.dispatch( push( PERMISSIONS_PENDING ) );
                }
            }
        ]
    };
};

export class MenuBuilder {
    private mainWindow: Application.Window;

    public store;

    constructor( mainWindow: Application.Window, store ) {
        this.mainWindow = mainWindow;
        this.store = store;
    }

    public buildMenu(): Menu {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true' ||
            isRunningDebug
        ) {
            this.setupDevelopmentEnvironment();
        }

        let template: Array<{}>;

        if ( process.platform === 'darwin' ) {
            template = this.buildDarwinTemplate();
        } else {
            template = this.buildDefaultTemplate();
        }

        const menu = Menu.buildFromTemplate( template );
        Menu.setApplicationMenu( menu );

        return menu;
    }

    private setupDevelopmentEnvironment(): void {
        this.mainWindow.webContents.on( 'context-menu', ( _event, properties ) => {
            const { x, y } = properties;

            Menu.buildFromTemplate( [
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement( x, y );
                    }
                }
            ] ).popup( { window: this.mainWindow } );
        } );
    }

    private buildDarwinTemplate(): Array<{}> {
        const { store } = this;
        const subMenuAbout = {
            label: 'Safe Network App',
            submenu: [
                {
                    label: 'About Safe Network App',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: 'Hide Safe Network App',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        this.store.dispatch( quitApplication() );
                    }
                }
            ]
        };
        const subMenuEdit = {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:'
                },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                }
            ]
        };
        const subMenuViewDevelopment = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuWindow = {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:'
                },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' }
            ]
        };

        const subMenuTests = setupTestsMenu( store );

        return [
            subMenuAbout,
            // subMenuEdit,
            ...( process.env.NODE_ENV === 'development'
                ? [subMenuViewDevelopment]
                : [] ),
            subMenuWindow,
            subMenuHelp,
            ...( isRunningTestCafeProcess || isRunningDebug || isHot
                ? [subMenuTests]
                : [] )
        ];
    }

    private buildDefaultTemplate(): Array<{}> {
        const { store } = this;

        const subMenuFile = {
            label: '&File',
            submenu: [
                {
                    label: '&Open',
                    accelerator: 'Ctrl+O'
                },
                {
                    label: '&Close',
                    accelerator: 'Ctrl+W',
                    click: () => {
                        this.mainWindow.close();
                    }
                }
            ]
        };

        const subMenuView = {
            label: '&View',
            submenu:
                process.env.NODE_ENV === 'development'
                    ? [
                        {
                            label: '&Reload',
                            accelerator: 'Ctrl+R',
                            click: () => {
                                this.mainWindow.webContents.reload();
                            }
                        },
                        {
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click: () => {
                                this.mainWindow.setFullScreen(
                                    !this.mainWindow.isFullScreen()
                                );
                            }
                        },
                        {
                            label: 'Toggle &Developer Tools',
                            accelerator: 'Alt+Ctrl+I',
                            click: () => {
                                this.mainWindow.toggleDevTools();
                            }
                        }
                    ]
                    : [
                        {
                            label: 'Toggle &Full Screen',
                            accelerator: 'F11',
                            click: () => {
                                this.mainWindow.setFullScreen(
                                    !this.mainWindow.isFullScreen()
                                );
                            }
                        }
                    ]
        };

        const subMenuTests = setupTestsMenu( store );

        const templateDefault = [
            subMenuFile,
            subMenuView,
            subMenuHelp,
            ...( isRunningTestCafeProcess || isRunningDebug || isHot
                ? [subMenuTests]
                : [] )
        ];

        return templateDefault;
    }
}
