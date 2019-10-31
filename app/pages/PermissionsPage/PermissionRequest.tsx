import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { Redirect, useParams } from 'react-router-dom';

// import { logger } from '$Logger';
// import styles from './Account.css';

// interface Props {
//     appName : string,
//     appId: string
// }
export const PermissionRequest = () => {
    const { appName, requestId } = useParams();

    return (
        <>
            <Typography variant="h5">
                {appName} would like permission
            </Typography>
            <Button aria-label="Accept Permission Request">Accept</Button>
            <Button aria-label="Deny Permission Request">Deny</Button>
        </>
    );
};
