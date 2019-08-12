import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Overview } from '$Components/Overview';
import {
    downloadAndInstallApp,
    pauseDownload,
    cancelDownload,
    resumeDownload,
    openApp,
    unInstallApp
} from '$Actions/alias/app_manager_actions';
import { updateDownloadProgress } from '$Actions/application_actions';
import { triggerSetAsTrayWindow } from '$Actions/alias/launchpad_actions';
import { getUserPreferences } from '$Actions/launchpad_actions';
import { AppState } from '../definitions/application.d';

function mapStateToProperties( state: AppState ) {
    return {
        appList: state.appManager.applicationList,
        isTrayWindow: state.launchpad.isTrayWindow
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        getUserPreferences,

        downloadAndInstallApp,
        pauseDownload,
        cancelDownload,
        resumeDownload,

        openApp,
        unInstallApp,

        updateDownloadProgress,

        triggerSetAsTrayWindow
    };

    return bindActionCreators( actions, dispatch );
}

export const OverviewPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Overview );
