import { AppManagerState, App } from '../definitions/application.d';

import { fetchDefaultAppIconFromLocal } from '$Actions/alias/app_manager_actions';

export const initialAppManager: AppManagerState = {
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'SAFE Browser',
            size: '~120MB',
            author: 'Maidsafe Ltd.',
            packageName: 'safe-browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe_browser',
            latestVersion: 'v0.15.2',
            description: 'Browse the Safe Network',
            updateDescription: '',
            type: 'userApplications',
            iconPath: fetchDefaultAppIconFromLocal( 'safe.browser' )
        }
    }
};
