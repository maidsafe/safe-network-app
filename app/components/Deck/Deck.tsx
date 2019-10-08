import React, { Component } from 'react';
import { Grid, List, Typography } from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { logger } from '$Logger';
import styles from './Deck.css';
import { ACCOUNT_ONBOARDING } from '$Constants/routes.json';
import { notificationTypes } from '../../constants/notifications';

interface Props {
    history: {
        push: Function;
    };
}

const ProtoDeck = ( props: Props ) => {
    const { history } = props;

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
        >
            <Typography variant="body2">Getting Started</Typography>
            <Card // TODO move to css
                style={{ maxWidth: 250 }}
            >
                <CardActionArea
                    onClick={() => {
                        logger.info( 'CLICKED ON CREATE ACCOUNT' );
                        history.push( ACCOUNT_ONBOARDING );
                    }}
                >
                    <CardMedia
                        // TODO move to css
                        style={{ height: 300 }}
                        // className={}
                        image="https://picsum.photos/250/300"
                        title="Get involved circle"
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="body2"
                            component="span"
                        >
                            Get Involved
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h3"
                            // component="h2"
                        >
                            Create Account
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            Store files, create a site, use Safecoin and more,
                            with a SAFE Network Account.
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export const Deck = withRouter( ProtoDeck );
