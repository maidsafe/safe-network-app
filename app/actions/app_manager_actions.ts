import { createActions } from 'redux-actions';

export const TYPES = {
    RESET_APP_STATE: 'RESET_APP_STATE',
    UPDATE_APP_INFO_IF_NEWER: 'UPDATE_APP_INFO_IF_NEWER'
};

export const { resetAppState, updateAppInfoIfNewer } = createActions(
    TYPES.RESET_APP_STATE,
    TYPES.UPDATE_APP_INFO_IF_NEWER
);
