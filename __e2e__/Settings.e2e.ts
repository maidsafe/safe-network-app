// eslint-disable-next-line import/no-extraneous-dependencies
import { Selector } from 'testcafe';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle } from './helpers';

const navigateToSettingsPage = async ( t ) =>
    t.click( Selector( 'button' ).withAttribute( 'aria-label', 'Settings' ) );

fixture`Settings Page`.page( '../app/app.html' ).beforeEach( async () => {
    await waitForReact();
} );
// .afterEach( assertNoConsoleErrors );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launchpad' );
} );

test( 'can navigate to settings page', async ( t ) => {
    navigateToSettingsPage( t );
    await t.expect( getPageUrl() ).contains( '#/settings' );
} );

test( 'can toggle switch buttons', async ( t ) => {
    navigateToSettingsPage( t );

    const Preferences = Selector( 'ul' ).withAttribute(
        'aria-label',
        'Preferences'
    );
    const PreferencesItemArray = Preferences.child( 'li' );

    const AutoUpdatePreference = PreferencesItemArray.nth( 0 );

    await t
        .expect(
            AutoUpdatePreference.find( '.MuiListItemText-primary' ).textContent
        )
        .eql( 'Auto Update' )
        .click( AutoUpdatePreference.find( 'input.MuiSwitch-input' ) )
        .expect( AutoUpdatePreference.find( 'input.MuiSwitch-input' ).checked )
        .ok();
} );

test( 'can toggle back switch button from on state', async ( t ) => {
    navigateToSettingsPage( t );

    const Preferences = Selector( 'ul' ).withAttribute(
        'aria-label',
        'Preferences'
    );
    const PreferencesItemArray = Preferences.child( 'li' );

    const LaunchOnStartPreference = PreferencesItemArray.nth( 2 );

    await t
        .expect(
            LaunchOnStartPreference.find( '.MuiListItemText-primary' ).textContent
        )
        .eql( 'Launch On Start' )
        .expect( LaunchOnStartPreference.find( 'input.MuiSwitch-input' ).checked )
        .ok()
        .click( LaunchOnStartPreference.find( 'input.MuiSwitch-input' ) )
        .expect( LaunchOnStartPreference.find( 'input.MuiSwitch-input' ).checked )
        .notOk();
} );

test( 'Go back from Settings page to Home', async ( t ) => {
    navigateToSettingsPage( t );

    await t
        .expect( getPageUrl() )
        .contains( '#/settings' )
        .click( Selector( 'button' ).withAttribute( 'aria-label', 'GoBack' ) )
        .expect( getPageUrl() )
        .contains( '#/' );
} );
