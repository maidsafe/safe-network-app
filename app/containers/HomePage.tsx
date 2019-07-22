import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Home } from '$Components/Home';
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
import { initialiseApp } from '$Actions/launchpad_actions';
import { AppState } from '../definitions/application.d';

function mapStateToProperties( state ) {
    return {
        launchpad: state.launchpad,
        appManagerState: state.appManager
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        initialiseApp,
        installApp,
        openApp,
        uninstallApp,
        updateInstallProgress,
        uninstallApplication,
        fetchApps
    };

    return bindActionCreators( actions, dispatch );
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
