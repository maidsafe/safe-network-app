// eslint-disable-next-line import/no-extraneous-dependencies
import { Selector } from 'testcafe';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForReact } from 'testcafe-react-selectors';

import { getPageTitle, getPageUrl, updatePreferences } from './helpers';

const clickGetStartedButton = async ( t ) => {
    await t
        .wait( 1000 )
        .click( Selector( 'button' ).withAttribute( 'aria-label', 'GetStarted' ) );
};

const clickNavBackButton = async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'NavBackButton' )
    );
};

const clickNavNextButton = async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'NavNextButton' )
    );
};

fixture`On Boarding Page`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
    } )
    .afterEach( async () => {
        await updatePreferences( {
            appPreferences: {
                shouldOnboard: true
            }
        } );
    } );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launchpad' );
} );

test( 'load on-boarding if not completed', async ( t ) => {
    await t.expect( getPageUrl() ).contains( '#/onBoarding' );
} );

test( 'click Get Started button to navigate to Intro page', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();
} );

test( 'click back button to go back to Get started from Intro', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();

    await clickNavBackButton( t );

    await t
        .expect( Selector( 'div' ).withAttribute( 'aria-label', 'GetStarted' ) )
        .ok();
} );

test( 'click next button to go to Basic settings from Intro', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();

    await clickNavNextButton( t );

    await t
        .expect( Selector( 'div' ).withAttribute( 'aria-label', 'BasicSettings' ) )
        .ok();
} );

test( 'click next button from Basic Settings to complete on-boarding', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();

    await clickNavNextButton( t );

    await t
        .expect( Selector( 'div' ).withAttribute( 'aria-label', 'BasicSettings' ) )
        .ok();

    await clickNavNextButton( t );

    await t.expect( getPageUrl() ).contains( '#/' );
} );
