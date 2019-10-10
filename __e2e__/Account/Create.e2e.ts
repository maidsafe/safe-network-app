import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle, getByAria } from '../helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Account Create Flow`
    .page( '../../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', `Skip OnBoard App`] );
    } )
    .afterEach( async ( t ) => {
        await assertNoConsoleErrors( t );
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', 'Reset application list'] );
    } );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

test( 'can navigate through create account onboarding', async ( t ) => {
    await t.click( Selector( '#CreateAccountCard' ) );

    const nextStep = getByAria( 'NextStepButton' );
    const backStep = getByAria( 'BackStepButton' );

    await t
        .expect(
            Selector( 'h6' ).withText( 'Start your secure, private, digital life.' )
                .exists
        )
        .ok();

    await t.click( nextStep );

    await t
        .expect(
            Selector( 'h6' ).withText(
                'Pay as you go with Safecoin. Not with your privacy.'
            ).exists
        )
        .ok();

    await t.click( nextStep );

    await t
        .expect( Selector( 'h6' ).withText( 'Earn Safecoin with a Vault.' ).exists )
        .ok();

    // we can go back a screen
    await t.click( backStep );

    await t
        .expect(
            Selector( 'h6' ).withText(
                'Pay as you go with Safecoin. Not with your privacy.'
            ).exists
        )
        .ok();

    await t.click( nextStep );
    await t.click( nextStep );
    await t.expect( getByAria( 'IAlreadyHaveInvite' ).exists ).ok();
} );
