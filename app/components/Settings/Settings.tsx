import React from 'react';

import { Preferences } from '$Components/Preferences';
import { UserPreferences } from '$Definitions/application.d';

import styles from './Settings.css';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export const Settings = ( props: Props ) => {
    const { userPreferences, setUserPreferences } = props;
    return (
        <div className={styles.wrap}>
            <Preferences
                userPreferences={userPreferences}
                onChange={setUserPreferences}
            />
        </div>
    );
};
