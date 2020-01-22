import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Redirect, useParams, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { I18n } from 'react-redux-i18n';

import { Page } from '$Components/Page';
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
        <Page>
            <Typography variant="h5">{appId}</Typography>
            <Typography variant="body2">
                {I18n.t( `permissions.allow_message`, { appId } )}
            </Typography>
            <Grid
                container
                justify="flex-end"
                alignContent="flex-end"
                spacing={2}
            >
                <Grid item>
                    <Button
                        onClick={handleDeny}
                        aria-label="Deny Permission Request"
                    >
                        {I18n.t( `permissions.deny` )}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleAllow}
                        variant="contained"
                        aria-label="Accept Permission Request"
                    >
                        {I18n.t( `permissions.allow` )}
                    </Button>
                </Grid>
            </Grid>
        </Page>
    );
} );
