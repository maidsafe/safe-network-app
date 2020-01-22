import { I18n } from 'react-redux-i18n';

import { logger } from '$Logger';
import {
    PERMISSIONS,
    PERMISSIONS_PENDING,
    ACCOUNT_CREATE,
    ACCOUNT_LOGIN
} from '$Constants/routes.json';

export const getPageTitle = ( currentPath: string ): string => {
    let mainTitle = currentPath;

    if ( currentPath.startsWith( ACCOUNT_CREATE ) ) {
        mainTitle = ACCOUNT_CREATE;
    }

    if ( currentPath.startsWith( ACCOUNT_LOGIN ) ) {
        mainTitle = ACCOUNT_LOGIN;
    }

    if ( currentPath.startsWith( PERMISSIONS ) ) {
        mainTitle = PERMISSIONS;
    }

    if ( currentPath.startsWith( PERMISSIONS_PENDING ) ) {
        mainTitle = PERMISSIONS_PENDING;
    }

    return I18n.t( `pages.${mainTitle}` );
};
