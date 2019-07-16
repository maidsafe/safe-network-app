import React from 'react';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const Base = styled( Paper )( {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${'assets/images/on_boarding_popup_bg.png'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
} );

const Container = styled( Box )( {
    padding: '0 24px',
    textAlign: 'center'
} );

const Title = styled( Typography )( {
    marginBottom: '16px'
} );

export const Intro = () => {
    return (
        <Base elevation={0}>
            <Container>
                <Title variant="h5">One Place for All SAFE Apps</Title>
                <Typography>
                    A one-stop shop to access all SAFE Apps and manage instant
                    app updates.
                </Typography>
            </Container>
        </Base>
    );
};
