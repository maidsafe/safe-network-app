import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Home } from '$Components/Home';
import { installApp } from '$Actions/alias_install_actions';

function mapStateToProperties( state ) {
    return {
        // counter: state.counter
    };
}
function mapDispatchToProperties( dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        installApp
    };
    return bindActionCreators( actions, dispatch );
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
