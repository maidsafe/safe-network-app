import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AccountPage as TheAccountPage } from './AccountPage';

import { AppState } from '$Definitions/application.d';

function mapStateToProperties( _state: AppState ) {
    return {
        // TODO: Why this unnecessary nesting?
    };
}
function mapDispatchToProperties( dispatch: Function ) {
    // until we have a reducer to add here.
    const actions = {};

    return bindActionCreators( actions, dispatch );
}

export const AccountPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( TheAccountPage );
