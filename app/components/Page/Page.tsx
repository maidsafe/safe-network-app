import React, { ReactNodeArray, ReactNode } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import styles from './page.css';

export const Page = ( props: {
    children: ReactNodeArray | ReactNode;
    // paddedSides?: bosolean;
} ) => {
    const { children } = props;

    return (
        <Grid
            container
            direction="column"
            // className={`${styles.pageContainer} ${
            //     noPaddedSides ? styles.noPaddedSides : ''
            // }`}
        >
            {children}
        </Grid>
    );
};
