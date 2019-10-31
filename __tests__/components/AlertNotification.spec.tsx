import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { NotificationAlert } from '$Components/Notifications/Notification_Alert';
import { notificationTypes } from '$Constants/notifications';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const id: string = Math.random().toString( 36 );

    const props = {
        latestNotification: {
            [id]: {
                id,
                type: 'NO_INTERNET',
                icon: 'SignalWifiOffIcon',
                priority: 'HIGH',
                notificationType: 'standard',
                title: 'No Internet connection. Your install has been paused.',
                acceptText: 'resume',
                denyText: 'dismiss'
            }
        },
        acceptNotification: jest.fn(),
        denyNotification: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <NotificationAlert {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Alert Notifications', () => {
    beforeEach( () => {
        // Set up some mocked out file info before each test
        // eslint-disable-next-line global-require, no-unused-expressions
        require( 'electron' ).remote;
    } );

    it( 'render', () => {
        const { wrapper, props } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );
} );
