import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';

export const MenuItemWrapper = ( props ) => {
    const { children } = props;

    return (
        <MenuItem
            dense
            onClick={props.onClick}
            className={props.className}
            aria-label={props['aria-label']}
        >
            <Typography variant="body2">{children}</Typography>
        </MenuItem>
    );
};
