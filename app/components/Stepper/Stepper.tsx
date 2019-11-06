import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, styled } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import { RouteComponentProps } from 'react-router';

import { logger } from '$Logger';

import {
    ON_BOARDING,
    ON_BOARDING_BASIC_SETTINGS,
    ON_BOARDING_INTRO,
    HOME
} from '$Constants/routes.json';

const defaultTheme = {
    root: {
        backgroundColor: '#fff'
    },
    dot: {
        backgroundColor: indigo[100],
        margin: '0 4px'
    },
    dotActive: {
        backgroundColor: indigo[800]
    }
};

const whiteTheme = {
    root: {
        backgroundColor: 'transparent'
    },
    dot: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        margin: '0 4px'
    },
    dotActive: {
        backgroundColor: '#fff'
    }
};

// Whatever you expect in 'this.props.match.params.*'
type PathParamsType = {};

type StepperProps = RouteComponentProps<PathParamsType> & {
    showButtons?: boolean;
    noElevation?: boolean;
    onFinish: Function;
    theme?: 'default' | 'white';
    location: {
        pathname: string;
    };
    history: {
        push: Function;
        goBack: Function;
    };
    steps: Array<{
        url: string;
        nextText?: string;
    }>;
};

export const Stepper = withRouter( ( properties: StepperProps ) => {
    const {
        history,
        location,
        showButtons,
        theme,
        steps,
        noElevation,
        onFinish
    } = properties;

    const NavButton = styled( Button )( {
        color: indigo[800],
        visibility: showButtons ? 'visible' : 'hidden'
    } );

    const currentIndex = steps.findIndex(
        ( step ) => step.url === location.pathname
    );
    const nextButtonText = steps[currentIndex].nextText || 'Next';
    const NextButton = (
        <NavButton
            size="small"
            aria-label="NextStepButton"
            onClick={() => {
                const nextStepIndex = currentIndex + 1;

                // next step is 0 indexed, length starts at 1.
                if ( nextStepIndex === steps.length ) {
                    return onFinish();
                }

                const nextStep = steps[nextStepIndex];
                const nextUrl = nextStep.url;

                return history.push( nextUrl );
            }}
        >
            {nextButtonText}
        </NavButton>
    );
    const BackButton = (
        <NavButton
            size="small"
            aria-label="BackStepButton"
            onClick={() => {
                history.goBack();
            }}
        >
            Back
        </NavButton>
    );

    const StyledStepper = withStyles(
        theme === 'white' ? whiteTheme : defaultTheme
    )( MobileStepper );

    return (
        <StyledStepper
            elevation={noElevation ? 0 : 4}
            variant="dots"
            steps={steps.length}
            position="bottom"
            activeStep={currentIndex}
            nextButton={NextButton}
            backButton={BackButton}
        />
    );
} );

Stepper.defaultProps = {
    showButtons: true,
    theme: 'default',
    noElevation: false
};
