import React from 'react';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import Star from '@material-ui/icons/Star';

// eslint-disable-next-line unicorn/prevent-abbreviations
export const Home = ( props ) => {
    const { history } = props;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box>
                    <Toolbar>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="Back"
                            onClick={() => {
                                history.push( 'settings' );
                            }}
                        >
                            <Settings fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="Back"
                            onClick={() => {
                                history.push( 'onBoarding' );
                            }}
                        >
                            <Star fontSize="inherit" />
                        </IconButton>
                    </Toolbar>
                </Box>
            </Grid>
        </Grid>
    );
};
