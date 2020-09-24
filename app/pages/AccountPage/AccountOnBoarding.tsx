import React from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import { Switch, Route, Redirect } from 'react-router';
import { styled } from '@material-ui/core/styles';

import styles from './Account.css';

import { logger } from '$Logger';
import { Stepper, StepperPage } from '$Components/Stepper';
import {
    ACCOUNT_ONBOARDING,
    ACCOUNT_ONBOARDING_PAYG,
    ACCOUNT_ONBOARDING_EARN,
    ACCOUNT,
    ACCOUNT_CREATE_PASSWORD
} from '$Constants/routes.json';

interface Props {
    history: History;
}

export class AccountOnBoarding extends React.Component<Props> {
    completed = () => {
        const { history } = this.props;

        logger.info( 'finished account on boarding' );
        // const appPreferences: AppPreferences = {
        //     shouldOnboard: false
        // };
        //
        // setAppPreferences( { shouldOnboard: false } );

        // history.push( ACCOUNT );

        // TODO: point to account again once fleshed out
        history.push( ACCOUNT_CREATE_PASSWORD );
    };

    render() {
        return (
            <Grid className={styles.Base} container>
                <Grid item xs={12}>
                    <Switch>
                        <Route
                            exact
                            path={ACCOUNT_ONBOARDING_PAYG}
                            component={() => (
                                <StepperPage
                                    title="Pay as you go with Safecoin. Not with your privacy."
                                    description="You don’t pay for services by sacrificing privacy. You pay only for what you use, in a currency called Safecoin."
                                />
                            )}
                        />
                        <Route
                            path={ACCOUNT_ONBOARDING_EARN}
                            component={() => (
                                <StepperPage
                                    title="Earn Safecoin with a Node."
                                    description="You can pay for your account by running a Node on your home computer. Contribute computer power to the network and be rewarded for it. "
                                />
                            )}
                        />
                        <Route
                            path={ACCOUNT_ONBOARDING}
                            component={() => (
                                <StepperPage
                                    title="Start your secure, private, digital life."
                                    description="Use apps, communicate with others, and store data in complete privacy with a SAFE Account."
                                />
                            )}
                        />
                    </Switch>
                </Grid>
                <Stepper
                    onFinish={this.completed}
                    steps={[
                        {
                            url: ACCOUNT_ONBOARDING
                        },
                        {
                            url: ACCOUNT_ONBOARDING_PAYG
                        },
                        {
                            url: ACCOUNT_ONBOARDING_EARN
                        }
                    ]}
                />
            </Grid>
        );
    }
}
