import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { authenticator } from './authenticator';

export const createRootReducer = ( history ) => {
    return combineReducers( {
        router: history ? connectRouter( history ) : null,
        authenticator
    } );
};
