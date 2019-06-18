import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { launchpadReducer as launchpad } from '$Reducers/launchpad_reducer';
import { appManager } from '$Reducers/app_manager_reducer';
import { History } from 'history';

export const createRootReducer = ( history: History ): Reducer => {
    return combineReducers( {
        router: history ? connectRouter( history ) : null,
        launchpad,
        appManager
    } );
};
