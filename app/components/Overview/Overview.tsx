import React, { Component } from 'react';
import { logger } from '$Logger';

import styles from './Overview.css';
import { AppManagerState } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    appManagerState: AppManagerState;
    fetchApps: Function;
    triggerSetStandardWindowVisibility: Function;
    standardWindowIsVisible: boolean;
}

export class Overview extends Component<Props> {
    constructor( props ) {
        // eslint-disable-line unicorn/prevent-abbreviations
        super( props );
        const { fetchApps } = this.props;
        fetchApps();
    }

    loadApps = () => {
        const {
            appManagerState,
            uninstallApp,
            installApp,
            openApp
        } = this.props;
        return Object.values( appManagerState.applicationList ).map(
            ( theApplication ) => (
                <ApplicationOverview
                    key={theApplication.name}
                    {...theApplication}
                    application={theApplication}
                    installApp={installApp}
                    uninstallApp={uninstallApp}
                    openApp={openApp}
                />
            )
        );
    };

    render() {
        const {
            triggerSetStandardWindowVisibility,
            standardWindowIsVisible
        } = this.props;
        return (
            <div className={styles.container} data-tid="container">
                <button
                    type="button"
                    className={styles['btn--upper-right']}
                    key="overview__switch-button"
                    onClick={() =>
                        triggerSetStandardWindowVisibility(
                            !standardWindowIsVisible
                        )
                    }
                >
                    Switch
                </button>
                {this.loadApps()}
            </div>
        );
    }
}
