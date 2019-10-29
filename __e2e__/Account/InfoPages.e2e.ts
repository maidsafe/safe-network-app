import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle, getByAria } from '../helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Account Info Pages`
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

// TODO: reenable all once this flow is reinstated
test( 'can navigate to get invite', async ( t ) => {
    await t.click( Selector( '#CreateAccountCard' ) );

    const nextStep = getByAria( 'NextStepButton' );
    // const backStep = getByAria( 'BackStepButton' );
    // const getInviteCard = getByAria( 'Get Invite' );
    //
    // await t.click( nextStep );
    // await t.click( nextStep );
    // await t.click( nextStep );
    //
    // await t.expect( getInviteCard.exists ).ok();
    // await t.click( getInviteCard );
    //
    // await t.expect( Selector( 'h5' ).withText( 'Get an invite' ).exists ).ok();
} );

// test( 'can navigate to requst invite', async ( t ) => {
//     await t.click( Selector( '#CreateAccountCard' ) );
//
//     const nextStep = getByAria( 'NextStepButton' );
//     const backStep = getByAria( 'BackStepButton' );
//     const requestInviteCard = getByAria( 'Request Invite' );
//
//     await t.click( nextStep );
//     await t.click( nextStep );
//     await t.click( nextStep );
//
//     await t.expect( requestInviteCard.exists ).ok();
//     await t.click( requestInviteCard );
//
//     await t.expect( Selector( 'h5' ).withText( 'Request an invite' ).exists ).ok();
// } );
//
// test( 'can navigate to earn invite', async ( t ) => {
//     await t.click( Selector( '#CreateAccountCard' ) );
//
//     const nextStep = getByAria( 'NextStepButton' );
//     const backStep = getByAria( 'BackStepButton' );
//     const earnInviteCard = getByAria( 'Earn Invite' );
//
//     await t.click( nextStep );
//     await t.click( nextStep );
//     await t.click( nextStep );
//
//     await t.expect( earnInviteCard.exists ).ok();
//     await t.click( earnInviteCard );
//
//     await t.expect( Selector( 'h5' ).withText( 'Earn an invite' ).exists ).ok();
// } );
