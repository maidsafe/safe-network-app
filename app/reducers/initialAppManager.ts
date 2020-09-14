import { AppManagerState, App } from '../definitions/application.d';

import { fetchDefaultAppIconFromLocal } from '$Actions/alias/app_manager_actions';

export const initialAppManager: AppManagerState = {
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'Safe Browser',
            // size: '~120MB',
            // baseUrl: `https://safe-browser.s3.eu-west-2.amazonaws.com/safe-browser`,
            artifactTemplate: {
                mac: `safe-browser-<version>-mac-x64.dmg`,
                linux: `safe-browser-<version>-linux-x64.AppImage`,
                windows: `safe-browser-<version>-win-x64.exe`
            },
            author: 'Maidsafe Ltd.',
            packageName: 'safe-browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe_browser',
            latestVersion: 'v0.15.2',
            description: 'Browse the Safe Network',
            updateDescription: '',
            type: 'electron',
            iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        },
        'safe.cli': {
            id: 'safe.cli',
            name: 'Safe CLI',
            baseUrl: `https://sn_api.s3.eu-west-2.amazonaws.com`,
            artifactTemplate: {
                mac: `sn_cli-<version>-x86_64-apple-darwin.zip`,
                linux: `sn_cli-<version>-x86_64-unknown-linux-gnu.zip`,
                windows: `sn_cli-<version>-x86_64-pc-windows-msvc.zip`
            },
            binName: {
                mac: `safe`,
                linux: `safe`,
                windows: `safe.exe`
            },
            postInstall: {
                mac: `ln -s ~/.safe/sn_cli/safe /usr/local/bin/safe ; safe auth install`,
                linux: `ln -s ~/.safe/sn_cli/safe ~/bin/safe ; safe auth install`,
                windows: `setx PATH "%PATH%;%USERPROFILE%/.safe/sn_cli" /M & safe auth install`
            },
            uninstall: {
                mac: `rm /usr/local/bin/safe`,
                linux: `rm /usr/local/bin/safe`,
                windows: `echo "How to do this in windows......";`
            },
            isInstalled: false,
            // size: '~120MB',
            author: 'Maidsafe Ltd.',
            packageName: 'sn_cli',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'sn_api',
            latestVersion: '0.9.0',
            description: 'Safe Network command line interface functionality',
            updateDescription: '',
            type: 'bin' // assumes zip file for now.
            // iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        }
    }
};
