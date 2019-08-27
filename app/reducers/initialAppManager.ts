import { AppManagerState, App } from '../definitions/application.d';
import { fetchDefaultAppIconFromLocal } from '$Actions/alias/app_manager_actions';

export const initialAppManager: AppManagerState = {
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'SAFE Browser',
            size: '2MB',
            author: 'Maidsafe Ltd.',
            iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' ),
            packageName: 'safe-browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe_browser',
            latestVersion: '0.0.4',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            updateDescription:
                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            type: 'userApplications'
        },
        'electron.boiler': {
            id: 'electron.boiler',
            name: 'Electron Boilerplate',
            size: '2MB',
            author: 'Joshuef Ltd.',
            packageName: 'ElectronTypescriptBoiler',
            iconPath: fetchDefaultAppIconFromLocal( 'electron.boiler' ),
            repositoryOwner: 'joshuef',
            repositorySlug: 'electron-typescript-react-boilerplate',
            latestVersion: '0.0.4',
            description:
                'Placeholder dummy app to test out updating things....',
            updateDescription: 'Nothing interesting until pulled from s3.',
            type: 'userApplications'
        }
    }
};
