import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';
import { inRendererProcess, inBgProcess } from '$Constants';

export const addMiddlewares = ( middlewares: Array<Function> ): void => {
    middlewares.push( thunk );
    middlewares.unshift( promiseMiddleware );

    if ( inBgProcess ) {
        middlewares.push( triggerAlias );
    }

    if ( inRendererProcess ) {
        // must be first
        middlewares.unshift( forwardToMain );
    }

    if ( !inRendererProcess ) {
        // must be last
        middlewares.push( forwardToRenderer );
    }
};
