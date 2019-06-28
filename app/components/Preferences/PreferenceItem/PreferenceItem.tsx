import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import { camelToTitle } from '$Utils/app_utils';

interface Props {
    name: string;
    status: boolean;
    disabled: boolean;
    onChange: Function;
}

const CustomSwitch = withStyles( {
    switchBase: {
        '&$checked': {
            color: deepOrange[700]
        },
        '&$checked + $track': {
            backgroundColor: deepOrange[700]
        }
    },
    checked: {},
    track: {}
} )( Switch );

// eslint-disable-next-line unicorn/prevent-abbreviations
export const PreferenceItem = ( props: Props ) => {
    const { name, status, disabled, onChange } = props;
    return (
        <ListItem divider>
            <ListItemText primary={camelToTitle( name )} />
            <ListItemSecondaryAction>
                <CustomSwitch
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
