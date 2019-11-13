import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle, getByAria } from '../helpers';
import { isCI } from '$Constants';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Permission Request Flow`
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

// TODO: Setup e2e to always have authd running. (as part of app?)
// Right now authd must be setup and running manually
test( 'can navigate to login, and attempt/fail to login', async ( t ) => {
    if ( isCI ) {
        // @ts-ignore
        await clickOnMainMenuItem( ['Help', 'Update shared vault config'] );
        await t.wait( 5000 );
    }

    const loginButton = getByAria( 'Login Button' );
    const password = getByAria( 'Password Field' );
    const passphrase = getByAria( 'Passphrase Field' );
    const stayLoggedIn = getByAria( 'Keep me logged in' );
    const accept = getByAria( 'Accept Permission Request' );
    const deny = getByAria( 'Deny Permission Request' );

    await t.click( loginButton );
    await t
        .expect( password.exists )
        .ok()
        .expect( passphrase.exists )
        .ok()
        // .expect( stayLoggedIn.exists )
        // .ok()
        .typeText( password, 'x' )
        .typeText( passphrase, 'x' )
        .click( loginButton )

        .wait( 5000 ); // todo, something less brittle here

    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', 'Trigger Permission Request'] );

    await t.expect( accept.exists ).ok();
    await t.expect( deny.exists ).ok();
} );
