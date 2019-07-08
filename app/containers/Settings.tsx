import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Settings } from '$Components/Settings';

import { setUserPreferences } from '$Actions/launchpad_actions';
import {
    storeUserPreferences,
    autoLaunch,
    pinToTray
} from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    console.log( 'storeUserPreferences', storeUserPreferences );
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
