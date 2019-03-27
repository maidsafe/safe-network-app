// import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Home } from '../components/Home';
// import {  }
function mapStateToProperties( state ) {
    return {
        // counter: state.counter
    };
}
function mapDispatchToProperties( dispatch ) {
    // return bindActionCreators( AuthenticatorActions, dispatch );
    // until we have a reducer to add here.
    return {};
}

export const HomePage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Home );
