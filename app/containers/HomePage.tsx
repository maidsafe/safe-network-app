import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Home } from '$Components/Home';
import { checkShouldOnboard } from '$Actions/launchpad_actions';

function mapStateToProperties( state ) {
    return {
        launchpad: state.launchpad
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        checkShouldOnboard
    };

    return bindActionCreators( actions, dispatch );
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
