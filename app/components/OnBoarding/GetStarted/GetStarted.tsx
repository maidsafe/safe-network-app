import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { I18n } from 'react-redux-i18n';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';

// @ts-ignore
import styles from './GetStarted.css';

import Logo from '$App/assets/images/logo.svg';

interface Props {
    onClickGetStarted: Function;
}

export const GetStarted = ( properties ) => {
    const { onClickGetStarted, history } = properties;
    return (
        <Paper className={styles.Base} aria-label="GetStarted" square>
            <Box className={styles.LogoBase}>
                <img src={Logo} alt="Launchpad logo" />
            </Box>
            <Box className={styles.Container}>
                <Typography
                    className={styles.Title}
                    variant="h5"
                    aria-label="GetStartedTitle"
                >
                    {I18n.t( `onboarding.title.getStarted` )}
                </Typography>
                <Typography
                    className={styles.desc}
                    aria-label="GetStartedSubTitle"
                    variant="body2"
                >
                    {I18n.t( `onboarding.subTitle.getStarted` )}
                </Typography>
                <Fab
                    className={styles.GetStartedButton}
                    variant="extended"
                    color="secondary"
                    aria-label="GetStarted"
                    onClick={() => {
                        onClickGetStarted();
                    }}
                >
                    {I18n.t( `onboarding.button.getStarted` )}
                </Fab>
            </Box>
        </Paper>
    );
};
