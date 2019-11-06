import * as appManager from '$Actions/alias/app_manager_actions';

describe( 'Alias application Manager actions', () => {
    it( 'should have types', () => {
        expect( appManager.TYPES ).toBeDefined();
    } );

    it( 'should fetch applications', () => {
        expect( appManager.fetchLatestAppVersions ).toBeDefined();
        expect( appManager.fetchLatestAppVersions().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS__FETCH_APPS
        );
    } );

    it( 'should install application', () => {
        expect( appManager.downloadAndInstallApp ).toBeDefined();
        expect( appManager.downloadAndInstallApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS__DOWNLOAD_AND_INSTALL_APP
        );
    } );

    it( 'should uninstall application', () => {
        expect( appManager.unInstallApp ).toBeDefined();
        expect( appManager.unInstallApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS__UNINSTALL_APP
        );
    } );

    it( 'should update application', () => {
        expect( appManager.updateApp ).toBeDefined();
        expect( appManager.updateApp().meta.trigger ).toEqual(
            appManager.TYPES.ALIAS__UPDATE_APP
        );
    } );
} );
