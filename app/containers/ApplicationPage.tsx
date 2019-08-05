import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ApplicationDetail } from '$Components/ApplicationDetail';
import {
    installApp,
    openApp,
    uninstallApp
} from '$Actions/alias_install_actions';
import {
    updateInstallProgress,
    uninstallApplication
} from '$Actions/application_actions';
import { fetchApps } from '$Actions/alias/app_manager_actions';
import { triggerSetAsTrayWindow } from '$Actions/alias/launchpad_actions';
import { getUserPreferences } from '$Actions/launchpad_actions';
import { AppState } from '../definitions/application.d';

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
        // getUserPreferences,
        installApp,
        openApp,
        uninstallApp,

        updateInstallProgress,
        uninstallApplication,

        fetchApps,

        triggerSetAsTrayWindow
    };

    return bindActionCreators( actions, dispatch );
}

export const ApplicationPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( ApplicationDetail );
