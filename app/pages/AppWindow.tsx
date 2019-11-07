import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { App } from '$Components/App/App';
import {
    acceptNotification,
    denyNotification,
    notificationToggleCheckBox
} from '$Actions/alias/notification_actions';
import {
    pushNotification,
    dismissNotification
} from '$Actions/launchpad_actions';
import { logOutOfNetwork } from '$Actions/alias/authd_actions';

import { logger } from '$Logger';
import {
    unInstallApp,
    downloadAndInstallApp,
    openApp,
    pauseDownload,
    cancelDownload,
    resumeDownload,
    fetchLatestAppVersions,
    updateApp
} from '$Actions/alias/app_manager_actions';
import { updateDownloadProgress } from '$Actions/application_actions';
import { triggerSetAsTrayWindow } from '$Actions/alias/launchpad_actions';

function mapStateToProperties( state ) {
    return {
        appList: state.appManager.applicationList,
        shouldOnboard: state.launchpad.appPreferences.shouldOnboard,
        isTrayWindow: state.launchpad.isTrayWindow,
        notifications: state.launchpad.notifications,
        notificationCheckBox: state.launchpad.notificationCheckBox,
        pathname: state.router.location.pathname,
        isLoggedIn: state.authd.isLoggedIn,
        pendingRequests: state.authd.pendingRequests
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        downloadAndInstallApp,
        openApp,
        updateApp,
        unInstallApp,

        // TODO: update overview menu with these new wonderful options.
        // TRY THEM OUT
        pauseDownload,
        cancelDownload,
        resumeDownload,

        updateDownloadProgress,

        fetchLatestAppVersions,

        triggerSetAsTrayWindow,

        acceptNotification,
        denyNotification,
        pushNotification,
        notificationToggleCheckBox,

        logOutOfNetwork
    };

    return bindActionCreators( actions, dispatch );
}
export const AppWindow: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( App );
