import { TYPES } from '$Actions/alias_install_actions';
import { logger } from '$Logger';

const initialState = {
    receivedAuthUrls: []
};
export function install( state = initialState, action ) {
    const payload = { action };

    switch ( action.type ) {
        case TYPES.ALIAS_INSTALL_APP: {
            logger.info( 'here we are' );
            return ['installed'];
        }
        default:
            return state;
    }
}
