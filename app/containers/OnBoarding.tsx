import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OnBoarding } from '$Components/OnBoarding';

import {
    setUserPreferences,
    getUserPreferences,
    setOnboardCompleted
} from '$Actions/launchpad_actions';
import {
    storeUserPreferences,
    pinToTray,
    autoLaunch
} from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        launchpad: state.launchpad
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setUserPreferences,
        getUserPreferences,
        storeUserPreferences,
        pinToTray,
        autoLaunch,
        setOnboardCompleted
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( OnBoarding );
