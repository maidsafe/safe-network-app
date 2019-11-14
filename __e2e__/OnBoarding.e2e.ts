import { Selector } from 'testcafe';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageTitle, getPageUrl } from './helpers';

const clickGetStartedButton = async ( t ) => {
    await t
        .wait( 1000 )
        .click( Selector( 'button' ).withAttribute( 'aria-label', 'GetStarted' ) );
};

const clickNavNextButton = async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'NextStepButton' )
    );
};

const clickNavBackButton = async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'BackStepButton' )
    );
};

fixture`On Boarding Page`.page( '../app/app.html' ).beforeEach( async () => {
    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', `OnBoard App`] );

    await waitForReact();
} );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Network App' );
} );

test( 'load on-boarding if not completed', async ( t ) => {
    await t.expect( getPageUrl() ).contains( '#/on-boarding' );
} );

test( 'check getStarted page Title', async ( t ) => {
    await t
        .expect(
            Selector( 'h5' ).withAttribute( 'aria-label', 'GetStartedTitle' )
                .innerText
        )
        .eql( 'SAFE Network App' );
} );

test( 'check getStarted page SubTitle', async ( t ) => {
    await t
        .expect(
            Selector( 'p' ).withAttribute( 'aria-label', 'GetStartedSubTitle' )
                .innerText
        )
        .eql( 'All the apps you need to try the SAFE Network' );
} );

test( 'check get started page Button Text', async ( t ) => {
    await t
        .expect(
            Selector( 'button' ).withAttribute( 'aria-label', 'GetStarted' )
                .innerText
        )
        .eql( 'GET STARTED' );
} );

test( 'click Get Started button to navigate to Intro page', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();
} );

test( 'check Intro page Title', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();

    await t
        .expect(
            Selector( 'h6' ).withAttribute( 'aria-label', 'IntroPageTitle' )
                .innerText
        )
        .eql( 'One Place for All SAFE Apps' );
} );

test( 'check Intro page SubTitle', async ( t ) => {
    await clickGetStartedButton( t );

    await t.expect( Selector( 'div' ).withAttribute( 'aria-label', 'Intro' ) ).ok();

    await t
        .expect(
            Selector( 'p' ).withAttribute( 'aria-label', 'IntroPageSubTitle' )
                .innerText
        )
        .eql(
            'A one-stop shop to access all SAFE Apps and manage instant app updates.'
        );
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
