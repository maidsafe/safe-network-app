import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';

import { LaunchpadState } from '$Definitions/application.d';
import { Stepper } from './Stepper';
import { GetStarted } from './GetStarted';
import { Intro } from './Intro';
import { BasicSettings } from './BasicSettings';
import { HOME } from '$Constants/routes.json';

interface Props {
    launchpad: LaunchpadState;
    getUserPreferences: Function;
    setUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
    storeUserPreferences: Function;
    setOnboardCompleted: Function;
    history: History;
}

const Base = styled( Grid )( {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
} );

export class OnBoarding extends Component<Props> {
    state = {
        currentPosition: 0
    };

    totalSteps = 3;

    componentWillMount() {
        this.goHomeOnCompleted();
        this.props.getUserPreferences();
    }

    componentDidUpdate() {
        this.goHomeOnCompleted();
    }

    goHomeOnCompleted = () => {
        const { launchpad, history } = this.props;

        if ( !launchpad.shouldOnboard ) {
            history.push( HOME );
        }
    };

    completed = () => {
        const {
            storeUserPreferences,
            setOnboardCompleted,
            launchpad
        } = this.props;
        storeUserPreferences( launchpad.userPreferences );
        setOnboardCompleted();
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
            launchpad,
            setUserPreferences,
            pinToTray,
            autoLaunch
        } = this.props;

        const { userPreferences } = launchpad;

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
            <Base container>
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
            </Base>
        );
    }
}
