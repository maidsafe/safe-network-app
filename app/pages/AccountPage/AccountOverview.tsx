import React from 'react';
import { Grid, List, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

// import { Redirect, Route, Switch } from 'react-router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import { logger } from '$Logger';
import styles from './Account.css';

import { ACCOUNT_CREATE, ACCOUNT_CREATE_REDEEM } from '$Constants/routes.json';

interface Props {
    history: { push: Function };
}

export const ProtoAccountOverview = ( props: Props ) => {
    const { history } = props;

    return (
        <div>
            <Card // TODO move to css
                style={{ maxWidth: 250 }}
            >
                <CardActionArea
                    onClick={() => {
                        logger.info( 'Get an invite clicked' );
                        // history.push( ACCOUNT );
                    }}
                >
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h3"
                            // component="h2"
                        >
                            Get An Invite
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            Request an invite from a friend....
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card
                // TODO move to css
                style={{ maxWidth: 250 }}
            >
                <CardActionArea
                    onClick={() => {
                        logger.info( 'Redeeem an invite clicked' );
                        // history.push( ACCOUNT );
                    }}
                >
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h3"
                            // component="h2"
                        >
                            Request an invite
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            Ask the community for an invite to get started
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card // TODO move to css
                style={{ maxWidth: 250 }}
            >
                <CardActionArea
                    onClick={() => {
                        logger.info( 'Earn account invite clicked' );
                        // history.push( ACCOUNT_CREATE_PASSWORD );
                    }}
                >
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h3"
                            // component="h2"
                        >
                            Earn one Yourself
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            use your computer to earn safecoins
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Typography
                aria-label="IAlreadyHaveInvite"
                variant="body2"
                onClick={() => {
                    logger.info( 'Already have invite clicked' );
                    history.push( ACCOUNT_CREATE_REDEEM );
                }}
            >
                I already have an invite
            </Typography>
        </div>
    );
};

export const AccountOverview = withRouter( ProtoAccountOverview );
