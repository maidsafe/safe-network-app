import { TYPES } from '$Actions/application_actions';

import { TYPES as INSTALL_TYPES } from '$Actions/alias_install_actions';

// import { logger } from '$Logger';
import {
    ApplicationsState,
    ApplicationsAction
} from '../definitions/application.d';

const initialState: ApplicationsState = {
    userApplications: [],
    developmentApplications: []
};

export function applications( state = initialState, action: ApplicationsAction ) {
    const { payload } = action;

    switch ( action.type ) {
        // here to ensure alias triggers.
        // TODO: Question: Should we bother with this alias just to trigger main
        // in the end?
        case INSTALL_TYPES.ALIAS_OPEN_APP:
        case INSTALL_TYPES.ALIAS_UNINSTALL_APP:
        case INSTALL_TYPES.ALIAS_INSTALL_APP: {
            return state;
        }

        case TYPES.UPDATE_INSTALL_PROGRESS: {
            const updatedApplication = payload;
            const applicationType = updatedApplication.type;
            const newState = { ...state };
            const targetAppsArray = newState[applicationType];

            const index = targetAppsArray.findIndex( ( app ) => {
                return app.name === updatedApplication.name;
            } );

            newState[applicationType] = [...targetAppsArray];
            newState[applicationType][index] = {
                ...newState[applicationType][index],
                ...updatedApplication
            };

            return newState;
        }
        case TYPES.ADD_APPLICATION: {
            const newState = { ...state };

            newState[payload.type] = [
                ...newState[payload.type],
                { ...payload }
            ];

            return newState;
        }
        default:
            return state;
    }
}
