import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router';
// eslint-disable-next-line import/no-unresolved
import { ON_BOARDING, INTRO, BASIC_SETTINGS, HOME } from '$Constants/routes';
import {
    Preferences,
    AppPreferences,
    UserPreferences,
    LaunchpadState
} from '$Definitions/application.d';

import { Stepper } from './Stepper';
import { GetStarted } from './GetStarted';
import { Intro } from './Intro';
import { BasicSettings } from './BasicSettings';

interface Props {
    launchpad: LaunchpadState;
    getUserPreferences: Function;
    setUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
    storePreferences: Function;
    onboardCompleted: Function;
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
        if ( !launchpad.appPreferences.shouldOnboard ) {
            history.push( HOME );
        }
    };

    completed = () => {
        const {
            storePreferences,
            onboardCompleted,
            launchpad,
            autoLaunch,
            pinToTray
        } = this.props;

        const appPreferences: AppPreferences = {
            shouldOnboard: false
        };

        const userPreferences: UserPreferences = {
            ...launchpad.userPreferences
        };

        const preferences: Preferences = {
            userPreferences,
            appPreferences
        };

        storePreferences( preferences );

        if ( launchpad.userPreferences.launchOnStart ) {
            autoLaunch( true );
        }

        if ( launchpad.userPreferences.pinToMenuBar ) {
            pinToTray( true );
        }

        onboardCompleted();
    };

    onCurrentPosition = ( position ) => {
        const { history } = this.props;

        switch ( position ) {
            case 0:
                history.push( ON_BOARDING );
                break;
            case 1:
                history.push( INTRO );
                break;
            case 2:
                history.push( BASIC_SETTINGS );
                break;
            default:
                history.push( HOME );
        }
    };

    onNext = () => {
        const { currentPosition } = this.state;
        let position = currentPosition;
        const { history } = this.props;

        if ( currentPosition < this.totalSteps - 1 ) {
            this.setState( {
                currentPosition: currentPosition + 1
            } );

            position += 1;
            this.onCurrentPosition( position );
        } else {
            this.completed();
        }
    };

    onBack = () => {
        const { currentPosition } = this.state;
        let position = currentPosition;

        if ( currentPosition > 0 ) {
            this.setState( {
                currentPosition: currentPosition - 1
            } );
        }
        position -= 1;
        this.onCurrentPosition( position );
    };

    render() {
        const { currentPosition } = this.state;
        const {
            launchpad,
            setUserPreferences,
            pinToTray,
            autoLaunch,
            history
        } = this.props;

        const { userPreferences } = launchpad;

        const isGetStarted = currentPosition === 0;

        return (
            <Base container>
                <Grid item xs={12}>
                    <Switch>
                        <Route
                            exact
                            path={ON_BOARDING}
                            component={() => (
                                <GetStarted onClickGetStarted={this.onNext} />
                            )}
                        />
                        <Route path={INTRO} component={() => <Intro />} />
                        <Route
                            path={BASIC_SETTINGS}
                            component={() => (
                                <BasicSettings
                                    userPreferences={userPreferences}
                                    setUserPreferences={setUserPreferences}
                                    pinToTray={pinToTray}
                                    autoLaunch={autoLaunch}
                                />
                            )}
                        />
                    </Switch>
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
