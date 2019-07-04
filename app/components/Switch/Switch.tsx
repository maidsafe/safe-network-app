import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import MuiSwitch from '@material-ui/core/Switch';

export const Switch = withStyles( {
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
} )( MuiSwitch );
