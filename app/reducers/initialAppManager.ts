import { AppManagerState, App } from '../definitions/application.d';

import { fetchDefaultAppIconFromLocal } from '$Actions/alias/app_manager_actions';

export const initialAppManager: AppManagerState = {
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'Safe Browser',
            // size: '~120MB',
            // baseUrl: `https://sn_browser.s3.eu-west-2.amazonaws.com/sn_browser`,
            artifactTemplate: {
                mac: `sn_browser-<version>-mac-x64.dmg`,
                linux: `sn_browser-<version>-linux-x64.AppImage`,
                windows: `sn_browser-<version>-win-x64.exe`
            },
            author: 'Maidsafe Ltd.',
            packageName: 'sn_browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'sn_browser',
            latestVersion: 'v0.15.2',
            description: 'Browse the Safe Network',
            updateDescription: '',
            type: 'electron',
            iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        },
        'safe.cli': {
            id: 'safe.cli',
            name: 'Safe CLI',
            baseUrl: `https://safe-api.s3.eu-west-2.amazonaws.com`,
            artifactTemplate: {
                mac: `safe-cli-<version>-x86_64-apple-darwin.zip`,
                linux: `safe-cli-<version>-x86_64-unknown-linux-gnu.zip`,
                windows: `safe-cli-<version>-x86_64-pc-windows-msvc.zip`
            },
            binName: {
                mac: `safe`,
                linux: `safe`,
                windows: `safe.exe`
            },
            postInstall: {
                mac: `ln -s ~/.safe/safe-cli/safe /usr/local/bin/safe ; safe auth install`,
                linux: `ln -s ~/.safe/safe-cli/safe ~/bin/safe ; safe auth install`,
                windows: `setx PATH "%PATH%;%USERPROFILE%/.safe/safe-cli" /M & safe auth install`
            },
            uninstall: {
                mac: `rm /usr/local/bin/safe`,
                linux: `rm /usr/local/bin/safe`,
                windows: `echo "How to do this in windows......";`
            },
            isInstalled: false,
            // size: '~120MB',
            author: 'Maidsafe Ltd.',
            packageName: 'safe-cli',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe-api',
            latestVersion: '0.9.0',
            description: 'Safe Network command line interface functionality',
            updateDescription: '',
            type: 'bin' // assumes zip file for now.
            // iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        }
    }
};
