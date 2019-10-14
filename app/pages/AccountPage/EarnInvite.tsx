import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';

// import { logger } from '$Logger';
// import styles from './Account.css';

export const EarnInvite = () => {
    return (
        <>
            <Typography variant="h5">Earn an invite</Typography>
            <Typography variant="body2">Run a vault...</Typography>

            <Grid container>
                <Typography>
                    <Button
                    // onClick={}
                    >
                        Run a Vault
                    </Button>
                </Typography>
                <Button
                    // onClick={}
                    aria-label="Redeem Invite"
                >
                    I already have an invite
                </Button>
            </Grid>
        </>
    );
};
