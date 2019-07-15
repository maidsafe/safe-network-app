import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import { UserPreferences } from '$Definitions/application.d';
import { Stepper } from './Stepper';
import { GetStarted } from './GetStarted';
import { Intro } from './Intro';
import { BasicSettings } from './BasicSettings';

import styles from './OnBoading.css';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
    storeUserPreferences: Function;
}

export class OnBoarding extends Component<Props> {
    state = {
        currentPosition: 0
    };

    totalSteps = 3;

    completed = () => {
        this.props.storeUserPreferences( this.props.userPreferences );
    };

    onNext = () => {
        const { currentPosition } = this.state;

        if ( currentPosition < this.totalSteps - 1 ) {
            this.setState( {
                currentPosition: currentPosition + 1
            } );
        } else {
            this.completed();
        }
    };

    onBack = () => {
        const { currentPosition } = this.state;

        if ( currentPosition > 0 ) {
            this.setState( {
                currentPosition: currentPosition - 1
            } );
        }
    };

    render() {
        const { currentPosition } = this.state;
        const {
            userPreferences,
            setUserPreferences,
            pinToTray,
            autoLaunch
        } = this.props;

        let container;
        switch ( currentPosition ) {
            case 0:
                container = <GetStarted onClickGetStarted={this.onNext} />;
                break;
            case 1:
                container = <Intro />;
                break;
            case 2:
                container = (
                    <BasicSettings
                        userPreferences={userPreferences}
                        setUserPreferences={setUserPreferences}
                        pinToTray={pinToTray}
                        autoLaunch={autoLaunch}
                    />
                );
                break;
            default:
                break;
        }

        const isGetStarted = currentPosition === 0;
        return (
            <Grid container className={styles.wrap}>
                <Grid item xs={12}>
                    {container}
                </Grid>
                <Stepper
                    theme={isGetStarted ? 'white' : 'default'}
                    showButtons={!isGetStarted}
                    noElevation={isGetStarted}
                    onNext={this.onNext}
                    onBack={this.onBack}
                    steps={this.totalSteps}
                    activeStep={this.state.currentPosition}
                />
            </Grid>
        );
    }
}
