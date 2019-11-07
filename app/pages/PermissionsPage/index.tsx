import { bindActionCreators } from 'redux';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';

import { connect, Dispatch } from 'react-redux';
// import { PermissionsPage as ThePermissionsPage } from './PermissionsPage';
import { logger } from '$Logger';

import {
    allowAuthRequest,
    denyAuthRequest
} from '$Actions/alias/authd_actions';

import { AppState, AuthDState, AuthRequest } from '$Definitions/application.d';

import { PermissionsPending } from '$Pages/PermissionsPage/PermissionsPending';
import { PermissionsGranted } from '$Pages/PermissionsPage/PermissionsGranted';
import { PermissionRequest } from '$Pages/PermissionsPage/PermissionRequest';

// import styles from './Account.css';

import {
    PERMISSIONS,
    PERMISSIONS_PENDING,
    PERMISSIONS_GRANTED,
    PERMISSIONS_REQUEST,
    ACCOUNT_LOGIN
} from '$Constants/routes.json';
import { notificationTypes } from '../../constants/notifications';

interface Props {
    isLoggedIn: boolean;
    pendingRequests: Array<AuthRequest>;
    allowAuthRequest: Function;
    denyAuthRequest: Function;
}

export const ProtoPermissionsPage = ( props: Props ) => {
    if ( !props.isLoggedIn ) {
        return <Redirect to={ACCOUNT_LOGIN} />;
    }

    logger.info( 'PERMS PAAAAAGGGEE' );

    return (
        <Switch>
            <Route path={PERMISSIONS_GRANTED} component={PermissionsGranted} />
            <Route
                path={PERMISSIONS_REQUEST}
                render={() => (
                    <PermissionRequest
                        allowAuthRequest={props.allowAuthRequest}
                        denyAuthRequest={props.denyAuthRequest}
                    />
                )}
            />
            <Route
                path={PERMISSIONS_PENDING}
                render={() => (
                    <PermissionsPending
                        pendingRequests={props.pendingRequests}
                    />
                )}
            />
            <Route
                exact
                path={PERMISSIONS}
                render={() => <PermissionsGranted />}
            />
        </Switch>
    );
};

function mapStateToProperties( state: AppState ) {
    return {
        isLoggedIn: state.authd.isLoggedIn,
        pendingRequests: state.authd.pendingRequests
    };
}
function mapDispatchToProperties( dispatch: Dispatch ) {
    // until we have a reducer to add here.
    const actions = {
        allowAuthRequest,
        denyAuthRequest
    };

    return bindActionCreators( actions, dispatch );
}

export const PermissionsPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( ProtoPermissionsPage );
