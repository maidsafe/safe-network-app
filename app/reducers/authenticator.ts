// import { AUTH_TYPES } from '../actions/authenticator_actions';

const initialState = {
    receivedAuthUrls: []
};
export function authenticator( state = initialState, action ) {
    const payload = { action };

    switch ( action.type ) {
        default:
            return state;
    }
}
