import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    triggerSetAsTrayWindow,
    autoLaunch,
    quitApplication
} from '$Actions/alias/launchpad_actions';
import { Settings } from '$Components/Settings';

import {
    setUserPreferences,
    getUserPreferences
} from '$Actions/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences,
        appPreferences: state.launchpad.appPreferences,
        isTrayWindow: state.launchpad.isTrayWindow
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setUserPreferences,
        getUserPreferences,
        triggerSetAsTrayWindow,
        quitApplication,
        autoLaunch
    };
    return bindActionCreators( actions, dispatch );
};

export const SettingsPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Settings );
