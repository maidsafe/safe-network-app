import { TYPES } from '$Actions/alias/authd_actions';
import { AuthDState } from '../definitions/application.d';

// import { ERRORS } from '$Constants/errors';
// import { logger } from '$Logger';

export const initialState: AuthDState = {
    isLoggedIn: false,
    error: null
};

export function authd( state = initialState, action ): AuthDState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.LOG_IN_TO_NETWORK: {
            return { ...state, ...payload };
        }
        case TYPES.CREATE_ACCOUNT: {
            return { ...state, ...payload };
        }
        case TYPES.CLEAR_ERROR: {
            return { ...state, error: null };
        }
        case TYPES.LOG_OUT_OF_NETWORK: {
            return { ...state, ...payload };
        }

        default:
            return state;
    }
}
