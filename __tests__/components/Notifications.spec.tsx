import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { NotificationAlert } from '$Components/Notifications/Notification_Alert';
import { Notification } from '$Components/Notifications/Notification';
import { notificationTypes } from '$Constants/notifications';
import { NotificationsHandler } from '$Components/Notifications/NotificationsHandler';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const appId: string = Math.random().toString( 36 );
    const id: string = Math.random().toString( 36 );

    const props = {
        notifications: {
            [id]: {
                id,
                type: 'NO_INTERNET',
                icon: 'SignalWifiOffIcon',
                priority: 'HIGH',
                notificationType: 'standard',
                title: 'No Internet connection. Your install has been paused.',
                acceptText: 'resume',
                denyText: 'dismiss',
                application: {
                    id: appId
                }
            }
        },
        acceptNotification: jest.fn(),
        denyNotification: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <NotificationsHandler {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Notifications', () => {
    beforeEach( () => {
        // Set up some mocked out file info before each test
        // eslint-disable-next-line global-require, no-unused-expressions
        require( 'electron' ).remote;
    } );

    it( 'render', () => {
        const { wrapper, props } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'should have exactly 1 Notification component', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( Notification ).length ).toBe( 1 );
    } );

    it( 'should have NotificationAlert component', () => {
        const id: string = Math.random().toString( 36 );
        const appId: string = Math.random().toString( 36 );
        const { wrapper } = shallowSetup( {
            notifications: {
                [id]: {
                    id,
                    type: 'NO_INTERNET',
                    icon: 'SignalWifiOffIcon',
                    priority: 'HIGH',
                    notificationType: 'js-alert',
                    title:
                        'No Internet connection. Your install has been paused.',
                    acceptText: 'resume',
                    denyText: 'dismiss',
                    application: {
                        id: appId
                    }
                }
            }
        } );
        expect( wrapper.find( NotificationAlert ).length ).toBe( 1 );
    } );
} );
