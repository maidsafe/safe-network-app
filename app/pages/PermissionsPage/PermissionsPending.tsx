import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { AuthRequest } from '$Definitions/application.d';
import { PERMISSIONS_PENDING } from '$Constants/routes.json';

import { logger } from '$Logger';
// import styles from './Account.css';
interface Props {
    pendingRequests: Array<AuthRequest>;
}

export const PermissionsPending = ( props: Props ) => {
    const { pendingRequests } = props;

    if ( pendingRequests && pendingRequests.length === 1 ) {
        const first = pendingRequests[0];
        return (
            <Redirect
                to={`${PERMISSIONS_PENDING}/${first.requestId}/${first.appId}`}
            />
        );
    }

    return (
        <>
            <Typography variant="h5">Permissions Pending...</Typography>
            <Typography variant="body2">A list of granted apps...</Typography>
        </>
    );
};
