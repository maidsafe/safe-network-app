import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OnBoarding } from '$Components/OnBoarding';

import {
    setUserPreferences,
    setAppPreferences,
    getUserPreferences
} from '$Actions/launchpad_actions';

import {
    autoLaunch,
    triggerSetAsTrayWindow
} from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences,
        appPreferences: state.launchpad.appPreferences,
        isTrayWindow: state.launchpad.isTrayWindow
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setAppPreferences,
        setUserPreferences,
        getUserPreferences,
        autoLaunch,
        triggerSetAsTrayWindow
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( OnBoarding );
