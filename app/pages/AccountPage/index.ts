import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { AccountPage as TheAccountPage } from './AccountPage';

import {
    logInToNetwork,
    createAccount,
    setAuthdWorking
} from '$Actions/alias/authd_actions';

import { AppState } from '$Definitions/application.d';

function mapStateToProperties( state: AppState ) {
    return {
        authd: state.authd
    };
}
function mapDispatchToProperties( dispatch: Dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        logInToNetwork,
        createAccount,
        setAuthdWorking
    };

    return bindActionCreators( actions, dispatch );
}

export const AccountPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( TheAccountPage );
