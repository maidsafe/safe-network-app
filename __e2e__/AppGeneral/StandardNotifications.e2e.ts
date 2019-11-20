// eslint-disable-next-line jest/no-identical-title
import { ClientFunction, Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle } from '../helpers';

const Notifications = {
    updateAvailable: {
        name: 'Update Available',
        title: 'Update Available!',
        acceptButtonExists: true
    },
    noInternet: {
        name: 'No Internet',
        title: 'Oh no! Your internet connection is down!',
        acceptButtonExists: false
    },
    discFull: {
        name: 'Disc Full',
        title:
            'Disk is full. Your install has been paused. Free up some space and resume.',
        acceptButtonExists: true
    },
    adminPassRequest: {
        name: 'Admin Pass Req',
        title:
            'Your Administrator Password is required to finish installing SAFE Browser.',
        acceptButtonExists: true
    },
    serverTimedOut: {
        name: 'Server Timed Out',
        title:
            'Download Server has timed out. Installation of SAFE Browser has been paused.',
        acceptButtonExists: true
    }
};

const numberOfNotification = Object.keys( Notifications );

fixture`Check App Notification`
    .page( '../../app/app.html' )
    .beforeEach( async () => {
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', `Skip OnBoard App`] );
        await waitForReact();
    } );

// eslint-disable-next-line array-callback-return
numberOfNotification.forEach( ( type ) => {
    test( `Check ${Notifications[type].name} notification`, async ( t ) => {
        // @ts-ignore
        await clickOnMainMenuItem( [
            'Tests',
            `Add a ${Notifications[type].name} Notification`
        ] );

        await t.expect( Selector( `.MuiPaper-root` ).exists ).ok();

        await t
            .expect(
                Selector( 'div' ).withAttribute( 'aria-label', 'NotificationIcon' )
                    .exists
            )
            .ok();

        await t
            .expect(
                Selector( 'p' ).withAttribute( 'aria-label', 'NotificationTitle' )
                    .exists
            )
            .ok();

        const notificationTitle = await Selector( 'p' ).withAttribute(
            'aria-label',
            'NotificationTitle'
        ).innerText;

        await t.expect( notificationTitle ).contains( Notifications[type].title );

        if ( Notifications[type].acceptButtonExists )
            await t
                .expect(
                    Selector( 'button' ).withAttribute(
                        'aria-label',
                        'AcceptNotification'
                    ).exists
                )
                .ok();

        await t
            .expect(
                Selector( 'button' ).withAttribute(
                    'aria-label',
                    'DenyNotification'
                ).exists
            )
            .ok();

        if ( Notifications[type].acceptButtonExists ) {
            await t
                .expect(
                    Selector( 'button' ).withAttribute(
                        'aria-label',
                        'AcceptNotification'
                    ).exists
                )
                .ok();

            // @ts-ignore
            await clickOnMainMenuItem( [
                'Tests',
                `Add a ${Notifications[type].name} Notification`
            ] );
        }

        await t
            .expect(
                Selector( 'button' ).withAttribute(
                    'aria-label',
                    'DenyNotification'
                ).exists
            )
            .ok();
    } );
} );
