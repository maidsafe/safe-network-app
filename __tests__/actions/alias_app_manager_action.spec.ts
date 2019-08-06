import * as appManager from '$Actions/alias/app_manager_actions';

describe( 'Alias application Manager actions', () => {
    it( 'should have types', () => {
        expect( appManager.TYPES ).toBeDefined();
    } );

    it( 'should fetch applications', () => {
        expect( appManager.fetchTheApplicationList ).toBeDefined();
        expect( appManager.fetchTheApplicationList().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_FETCH_APPS
        );
    } );

    it( 'should install application', () => {
        expect( appManager.installApp ).toBeDefined();
        expect( appManager.installApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_INSTALL_APP
        );
    } );

    it( 'should uninstall application', () => {
        expect( appManager.uninstallApp ).toBeDefined();
        expect( appManager.uninstallApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_UNINSTALL_APP
        );
    } );

    it( 'should check application has update available', () => {
        expect( appManager.checkAppHasUpdate ).toBeDefined();
        expect( appManager.checkAppHasUpdate().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_CHECK_APP_HAS_UPDATE
        );
    } );

    it( 'should update application', () => {
        expect( appManager.updateApp ).toBeDefined();
        expect( appManager.updateApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_UPDATE_APP
        );
    } );

    it( 'should skip application update', () => {
        expect( appManager.skipAppUpdate ).toBeDefined();
        expect( appManager.skipAppUpdate().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_SKIP_APP_UPDATE
        );
    } );

    it( 'should update launchpad', () => {
        expect( appManager.updateLaunchpadApp ).toBeDefined();
        expect( appManager.updateLaunchpadApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_UPDATE_APP
        );
    } );

    it( 'should skip launchpad update', () => {
        expect( appManager.skipLaunchpadAppUpdate ).toBeDefined();
        expect( appManager.skipLaunchpadAppUpdate().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS_SKIP_APP_UPDATE
        );
    } );
} );
