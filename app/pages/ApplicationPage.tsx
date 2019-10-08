import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ApplicationDetail } from '$Components/ApplicationDetail';

import { updateDownloadProgress } from '$Actions/application_actions';
import {
    downloadAndInstallApp,
    pauseDownload,
    cancelDownload,
    resumeDownload,
    openApp,
    updateApp,
    unInstallApp,
    fetchLatestAppVersions
} from '$Actions/alias/app_manager_actions';
import { triggerSetAsTrayWindow } from '$Actions/alias/launchpad_actions';
import { AppState } from '../definitions/application.d';
import { pushNotification } from '$Actions/launchpad_actions';
import { resetAppInstallationState } from '$Actions/app_manager_actions';

function mapStateToProperties( state: AppState ) {
    return {
        // TODO: Why this unnecessary nesting?
        appList: state.appManager.applicationList,
        isTrayWindow: state.launchpad.isTrayWindow
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        downloadAndInstallApp,
        pushNotification,
        openApp,
        unInstallApp,

        // TODO: update overview menu with these new wonderful options.
        // TRY THEM OUT
        pauseDownload,
        cancelDownload,
        resumeDownload,

        updateApp,

        updateDownloadProgress,

        fetchLatestAppVersions,

        triggerSetAsTrayWindow,
        resetAppInstallationState
    };

    return bindActionCreators( actions, dispatch );
}

export const ApplicationPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( ApplicationDetail );
