import { uniqBy } from 'lodash';
import { TYPES } from '$Actions/alias/authd_actions';
import { AuthDState } from '../definitions/application.d';
// import { ERRORS } from '$Constants/errors';
import { logger } from '$Logger';

export const initialState: AuthDState = {
    isLoggedIn: false,
    error: null,
    isWorking: false,
    pendingRequests: []
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
        case TYPES.AUTHD_ALLOW_REQUEST: {
            const updatedRequestList = [...state.pendingRequests];

            if ( !payload.requestId )
                throw new Error( 'Auth request is missing "requestId" ' );

            return {
                ...state,
                pendingRequests: updatedRequestList.filter( ( request ) => {
                    return request.requestId !== payload.requestId;
                } )
            };
        }
        case TYPES.AUTHD_DENY_REQUEST: {
            const updatedRequestList = [...state.pendingRequests];

            if ( !payload.requestId )
                throw new Error( 'Auth request is missing "requestId" ' );

            return {
                ...state,
                pendingRequests: updatedRequestList.filter(
                    ( request ) => request.requestId !== payload.requestId
                )
            };
        }
        case TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST: {
            const updatedRequestList = [...state.pendingRequests];
            if ( !payload.requestId )
                throw new Error( 'Auth request is missing "requestId" ' );
            if ( !payload.appId )
                throw new Error( 'Auth request is missing "appId" ' );

            updatedRequestList.push( payload );

            const finalList = uniqBy(
                updatedRequestList,
                ( request ) => request.requestId
            );

            return {
                ...state,
                pendingRequests: finalList
            };
        }

        default:
            return state;
    }
}
