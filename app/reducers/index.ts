import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { launchpadReducer as launchpad } from '$Reducers/launchpad_reducer';
import { appManager } from '$Reducers/app_manager_reducer';

export const createRootReducer = ( history: History ): Reducer => {
    return combineReducers( {
        router: history ? connectRouter( history ) : null,
        launchpad,
        appManager
    } );
};
