import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { applications } from '$Reducers/applications_reducer';
import { History } from 'history';

export const createRootReducer = ( history: History ): Reducer => {
    return combineReducers( {
        router: history ? connectRouter( history ) : null,
        applications
    } );
};
