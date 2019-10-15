import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';
import { inRendererProcess, inBgProcess } from '$Constants';

export const addMiddlewares = ( middlewares: Array<Function> ): void => {
    middlewares.push( thunk );

    if ( inBgProcess ) {
        middlewares.push( triggerAlias );
    }

    // must be after trigger alias
    middlewares.push( promiseMiddleware );

    if ( inRendererProcess ) {
        // must be first
        middlewares.unshift( forwardToMain );
    }

    if ( !inRendererProcess ) {
        // must be last
        middlewares.push( forwardToRenderer );
    }
};
