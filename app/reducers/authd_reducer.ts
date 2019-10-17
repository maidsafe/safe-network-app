import { TYPES } from '$Actions/alias/authd_actions';
import { AuthDState } from '../definitions/application.d';

// import { ERRORS } from '$Constants/errors';
// import { logger } from '$Logger';

export const initialState: AuthDState = {
    isLoggedIn: false,
    error: null,
    isWorking: false
};

export function authd( state = initialState, action ): AuthDState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_AUTHD_WORKING: {
            return { ...state, isWorking: true };
        }
        case TYPES.LOG_IN_TO_NETWORK: {
            return {
                ...state,
                isLoggedIn: !payload.error,
                error: payload.error,
                isWorking: false
            };
        }
        case TYPES.CREATE_ACCOUNT: {
            return {
                ...state,
                isLoggedIn: !payload.error,
                error: payload.error,
                isWorking: false
            };
        }
        case TYPES.CLEAR_ERROR: {
            return { ...state, error: null };
        }
        case TYPES.LOG_OUT_OF_NETWORK: {
            return {
                ...state,
                isLoggedIn: !!payload.error,
                error: payload.error,
                isWorking: false
            };
        }

        default:
            return state;
    }
}
