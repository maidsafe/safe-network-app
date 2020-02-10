import { Store } from 'redux';

import { pushNotification } from '$Actions/launchpad_actions';
import { notificationTypes } from '$Constants/notifications';

export const addNotification = ( store: Store ) => {
    if ( process.env.NODE_ENV !== 'production' && process.env.NOTIFICATION ) {
        const randomAppId: string = Math.random().toString( 36 );
        const application = {
            id: randomAppId,
            name: 'Safe Browser',
            version: 'v1.0'
        };

        store.dispatch(
            pushNotification(
                notificationTypes[process.env.NOTIFICATION]( application )
            )
        );
    }
};
