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

    await t.setTestSpeed( 0.5 );

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

    // TODO : Reenable this flow check once reinstated

    // await t.click( nextStep );

    // await t.click( nextStep );
    // await t.expect( getByAria( 'IAlreadyHaveInvite' ).exists ).ok();
} );

test( 'can create an account', async ( t ) => {
    await t.click( Selector( '#CreateAccountCard' ) );

    const passphrase = getByAria( 'Create Passphrase Field' );
    const password = getByAria( 'Create Password Field' );
    const savePassword = getByAria( 'Save Password' );
    const savePassphrase = getByAria( 'Save Passphrase' );
    const invite = getByAria( 'Redeem Invite Field' );
    const redeem = getByAria( 'Redeem Invite' );
    const nextStep = getByAria( 'NextStepButton' );

    await t.click( nextStep );
    await t.click( nextStep );
    await t.click( nextStep );

    // await t.click( getByAria( 'IAlreadyHaveInvite' ) );

    await t
        // TODO: reenable once we have redemption
        // .expect( redeem.exists )
        // .ok()
        // .click( redeem )
        .expect( password.exists )
        .ok()
        .click( savePassword )
        .expect( passphrase.exists )
        .ok();
    // .click( savePassphrase )
} );
