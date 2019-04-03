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
import { TheState } from '../definitions/application.d';

function mapStateToProperties( state: TheState ) {
    return {
        userApplications: state.applications.userApplications,
        developmentApplications: state.applications.developmentApplications
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        installApp,
        openApp,
        uninstallApp,

        updateInstallProgress,
        uninstallApplication
    };

    return bindActionCreators( actions, dispatch );
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
