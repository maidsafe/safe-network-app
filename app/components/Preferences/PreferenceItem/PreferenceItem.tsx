import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import styles from './PreferenceItem.css';

import { camelToTitle } from '$Utils/app_utils';

interface Props {
    name: string;
    status: boolean;
    disabled: boolean;
    isLastItem: boolean;
    onChange: Function;
}

export const PreferenceItem = ( props: Props ) => {
    const { name, status, disabled, onChange, isLastItem } = props;
    return (
        <ListItem divider={!isLastItem}>
            <ListItemText
                className={styles.PrimaryText}
                primary={camelToTitle( name )}
                primaryTypographyProps={{
                    variant: 'body2'
                }}
            />
            <ListItemSecondaryAction>
                <Switch
                    edge="end"
                    color="primary"
                    onChange={() => {
                        onChange( name, !status );
                    }}
                    checked={status}
                    disabled={disabled}
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
};
