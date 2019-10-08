import React, { Component } from 'react';
import { Provider, Store } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { notificationTypes } from '$Constants/notifications';
import { Routes } from '../Routes';
import { logger } from '$Logger';
import {
    pushNotification,
    dismissNotification
} from '$Actions/launchpad_actions';
import {
    pauseAllDownloads,
    resumeAllDownloads
} from '$Actions/alias/app_manager_actions';

interface RootProps {
    store: Store;
    history: any;
}

export class Root extends React.PureComponent<RootProps> {
    render() {
        const { store, history } = this.props;
        // Event Listener to check if app is online or offline
        // eslint-disable-next-line no-undef
        window.addEventListener( 'offline', () => {
            const { applicationList } = store.getState().appManager;
            const notified = Object.keys( applicationList ).find( ( appId ) => {
                const application = applicationList[appId];
                if (
                    application.isDownloadingAndInstalling &&
                    !application.isPaused
                ) {
                    store.dispatch(
                        pushNotification(
                            notificationTypes.NO_INTERNET_APP_IS_INSTALLING()
                        )
                    );
                    store.dispatch( pauseAllDownloads( applicationList ) );
                }
                return (
                    application.isDownloadingAndInstalling &&
                    !application.isPaused
                );
            } );
        } );

        // eslint-disable-next-line no-undef
        window.addEventListener( 'online', () => {
            const { notifications } = store.getState().launchpad;
            const { applicationList } = store.getState().appManager;
            const notificationId = Object.keys( notifications ).find( ( id ) => {
                return notifications[id].type === 'NO_INTERNET_INSTALLING_APP';
            } );
            if ( notificationId ) {
                store.dispatch( dismissNotification( { id: notificationId } ) );
                store.dispatch( resumeAllDownloads( applicationList ) );
            }
        } );

        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}
