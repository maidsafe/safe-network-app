import { createActions } from 'redux-actions';

export const TYPES = {
    RESET_APP_STATE: 'RESET_APP_STATE',
    SET_APPS: 'SET_APPS'
};

export const { resetAppState, setApps } = createActions(
    TYPES.RESET_APP_STATE,
    TYPES.SET_APPS
);
