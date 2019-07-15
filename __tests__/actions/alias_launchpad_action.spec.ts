import * as launchpad from '$Actions/alias/launchpad_actions';

describe( 'Alias launchpad actions', () => {
    it( 'should have types', () => {
        expect( launchpad.TYPES ).toBeDefined();
    } );

    it( 'should store user preferences', () => {
        expect( launchpad.storeUserPreferences ).toBeDefined();
        expect( launchpad.storeUserPreferences().meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_STORE_USER_PREFERENCES
        );
    } );

    it( 'should auto launch launchpad', () => {
        expect( launchpad.autoLaunch ).toBeDefined();
        expect( launchpad.autoLaunch().meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_AUTO_LAUNCH
        );
    } );

    it( 'should pin launchpad to tray', () => {
        expect( launchpad.pinToTray ).toBeDefined();
        expect( launchpad.pinToTray( true ).meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_PIN_TO_TRAY
        );
    } );
} );
