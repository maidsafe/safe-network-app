import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Settings } from '$Components/Settings';

import {
    setUserPreferences,
    storeUserPreferences,
    autoLaunch,
    pinToTray
} from '$App/actions/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setUserPreferences,
        storeUserPreferences,
        autoLaunch,
        pinToTray
    };
    return bindActionCreators( actions, dispatch );
};

export const SettingsPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Settings );
