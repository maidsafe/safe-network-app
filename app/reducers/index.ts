import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { install } from './install';

export const createRootReducer = ( history ) => {
    return combineReducers( {
        router: history ? connectRouter( history ) : null,
        install
    } );
};
