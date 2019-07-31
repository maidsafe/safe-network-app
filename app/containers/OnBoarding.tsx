import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OnBoarding } from '$Components/OnBoarding';

import {
    setUserPreferences,
    getUserPreferences,
    onboardCompleted
} from '$Actions/launchpad_actions';
import {
    storePreferences,
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
        storePreferences,
        pinToTray,
        autoLaunch,
        onboardCompleted
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( OnBoarding );
