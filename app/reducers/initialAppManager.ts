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
            baseUrl: `https://safe-api.s3.eu-west-2.amazonaws.com`,
            artifactTemplate: {
                mac: `safe-cli-<version>-x86_64-apple-darwin.zip`,
                linux: `safe-cli-<version>-unknown-linux-gnu.zip`,
                windows: `safe-cli-<version>-x86_64-pc-windows-gnu.zip`
            },
            binName: {
                mac: `safe`,
                linux: `safe`,
                windows: `safe.exe`
            },
            postInstall: {
                mac: `ln -s ~/.safe/safe-cli/safe /usr/local/bin/safe ; safe auth install`,
                linux: `ln -s ~/.safe/safe-cli/safe /usr/local/bin/safe ; safe auth install`,
                windows: `echo "How to do this in windows......";`
            },
            uninstall: {
                mac: `rm /usr/local/bin/safe`,
                linux: `rm /usr/local/bin/safe`,
                windows: `echo "How to do this in windows......";`
            },
            // size: '~120MB',
            author: 'Maidsafe Ltd.',
            packageName: 'safe-cli',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe-api',
            latestVersion: '0.7.2',
            description: 'Safe Network command line interface functionality',
            updateDescription: '',
            type: 'bin' // assumes zip file for now.
            // iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        }
    }
};
