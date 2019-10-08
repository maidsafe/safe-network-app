import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { I18n } from 'react-redux-i18n';
import Box from '@material-ui/core/Box';
import styles from './page.css';

interface StepperPageProps {
    title: string;
    description: string;
    image?: string;
}
export const StepperPage = ( props: StepperPageProps ) => {
    const { title, description, image } = props;

    return (
        <Paper className={styles.Base} elevation={0} aria-label="IntroPage">
            <Box className={styles.Container}>
                <Typography
                    className={styles.Title}
                    variant="h6"
                    aria-label="IntroPageTitle"
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    className={styles.Description}
                    aria-label="IntroPageSubTitle"
                >
                    {description}
                </Typography>
            </Box>
        </Paper>
    );
};
