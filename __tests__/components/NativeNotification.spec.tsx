import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Button } from '@material-ui/core';
import { Notification } from '$Components/Notifications/Notification';
import { notificationTypes } from '$Constants/notifications';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const id: string = Math.random().toString( 36 );

    const props = {
        latestNotification: {
            id,
            type: 'NO_INTERNET',
            icon: 'SignalWifiOffIcon',
            priority: 'HIGH',
            notificationType: 'standard',
            title: 'No Internet connection. Your install has been paused.',
            acceptText: 'resume',
            denyText: 'dismiss'
        },
        acceptNotification: jest.fn(),
        denyNotification: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <Notification {...props} /> );

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
            .simulate( 'click' );
        expect( props.acceptNotification ).toHaveBeenCalled();
    } );

    it( 'deny notification button click', () => {
        const { wrapper, props } = shallowSetup();
        wrapper
            .find( Button )
            .filterWhere(
                ( node ) => node.props()['aria-label'] === 'DenyNotification'
            )
            .simulate( 'click' );
        expect( props.denyNotification ).toHaveBeenCalled();
    } );
} );
