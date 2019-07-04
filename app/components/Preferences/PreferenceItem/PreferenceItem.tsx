import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { Switch } from '$Components/Switch';
import { camelToTitle } from '$Utils/app_utils';

interface Props {
    name: string;
    status: boolean;
    disabled: boolean;
    onChange: Function;
}

export const PreferenceItem = ( props: Props ) => {
    const { name, status, disabled, onChange } = props;
    return (
        <ListItem divider>
            <ListItemText primary={camelToTitle( name )} />
            <ListItemSecondaryAction>
                <Switch
                    edge="end"
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
