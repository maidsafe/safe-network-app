import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Button } from '@material-ui/core';
import { NotificationNative } from '$Components/Notifications/Notification_Native';
import { notificationTypes } from '$Constants/notifications';
import { logger } from '$Logger';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const appId: string = Math.random().toString( 36 );
    const id: string = Math.random().toString( 36 );

    const props = Object.assign(
        {
            latestNotification: {
                [id]: {
                    id,
                    type: 'NO_INTERNET',
                    icon: 'SignalWifiOffIcon',
                    priority: 'HIGH',
                    notificationType: 'Native',
                    title:
                        'No Internet connection. Your install has been paused.',
                    acceptText: 'resume',
                    denyText: 'dismiss',
                    appId
                }
            },
            acceptNotification: jest.fn(),
            denyNotification: jest.fn()
        },
        propOverrides
    );

    const wrapper = shallow( <NotificationNative {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Notifications', () => {
    it( 'render', () => {
        const { wrapper, props } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'accept notification button click', () => {
        const { wrapper, props } = shallowSetup();
        wrapper
            .find( Button )
            .filterWhere(
                ( node ) => node.props()['aria-label'] === 'AcceptNotification'
            )
            .simulate( 'click', { preventDefault() {} } );
        expect( props.acceptNotification ).toHaveBeenCalled();
    } );

    it( 'deny notification button click', () => {
        const { wrapper, props } = shallowSetup();
        wrapper
            .find( Button )
            .filterWhere(
                ( node ) => node.props()['aria-label'] === 'DenyNotification'
            )
            .simulate( 'click', { preventDefault() {} } );
        expect( props.denyNotification ).toHaveBeenCalled();
    } );
} );
