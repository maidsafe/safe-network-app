import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BasicSettings } from '$Components/BasicSettings';

import {
    setUserPreferences,
    storeUserPreferences,
    pinToTray,
    autoLaunch
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
        pinToTray,
        autoLaunch
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( BasicSettings );
