import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { Redirect, useParams, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { logger } from '$Logger';
// import styles from './Account.css';
type PathParamsType = {};

type Props = RouteComponentProps<PathParamsType> & {
    allowAuthRequest: Function;
    denyAuthRequest: Function;
    history: {
        goBack: Function;
    };
};

export const PermissionRequest = withRouter( ( props: Props ) => {
    const { appId, requestId } = useParams();
    const { allowAuthRequest, denyAuthRequest, history } = props;

    const handleAllow = () => {
        allowAuthRequest( { requestId } );
        history.goBack();
    };
    const handleDeny = () => {
        denyAuthRequest( { requestId } );
        history.goBack();
    };

    return (
        <>
            <Typography variant="h5">{appId} would like permission</Typography>
            <Button
                onClick={handleAllow}
                aria-label="Accept Permission Request"
            >
                Accept
            </Button>
            <Button onClick={handleDeny} aria-label="Deny Permission Request">
                Deny
            </Button>
        </>
    );
} );
