import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Home } from '$Components/Home';
import {
    getUserPreferences,
    checkShouldOnboard
} from '$Actions/launchpad_actions';

function mapStateToProperties( state ) {
    return {
        shouldOnboard: state.launchpad.shouldOnboard
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        getUserPreferences,
        checkShouldOnboard
    };

    return bindActionCreators( actions, dispatch );
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
