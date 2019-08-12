import { BrowserWindow } from 'electron';
import { Router } from 'react-router';

export namespace Application {
    export interface Window extends BrowserWindow {
        openDevTools: Function;
        toggleDevTools: Function;
        inspectElement: Function;
    }
}

export interface ApplicationsState {
    userApplications: Array<App>;
    developmentApplications: Array<App>;
}

export interface TheState {
    applications: ApplicationsState;
}

export interface ApplicationsAction {
    payload: App;
    meta: {};
    type: string;
}

export interface Notification {
    id: string;
    type: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    appId?: string;
}

export interface UserPreferences {
    autoUpdate: boolean;
    pinToMenuBar: boolean;
    launchOnStart: boolean;
    showDeveloperApps: boolean;
    warnOnAccessingClearnet: boolean;
}

export interface AppPreferences {
    shouldOnboard: boolean;
}

export interface Preferences {
    userPreferences: UserPreferences;
    appPreferences: AppPreferences;
    id?: number;
}

export type AppType = 'userApplications' | 'developmentApplications';

export interface App {
    id: string;
    name: string;
    author: string;
    size: string;
    description: string;
    updateDescription: string;
    packageName: string;
    repositoryOwner: string;
    repositorySlug: string;

    type: AppType;
    latestVersion?: string;

    isOpen?: boolean; // ?why...
    progress?: number;
    isInstalling?: boolean;
    isUpdating?: boolean;
    isUninstalling?: boolean;

    isDownloading?: boolean;

    hasUpdate?: boolean;
    lastSkippedVersion?: string;
    error?: Error | null;

    isInstalled?: boolean;
    installFailed?: boolean;
}

export interface LaunchpadState {
    appPreferences: AppPreferences;
    userPreferences: UserPreferences;
    notifications: { [s: string]: Notification };
    isTrayWindow: boolean;
    notificationCheckBox: boolean;
}

export interface AppManagerState {
    applicationList: { [id: string]: App };
}

export interface AppState {
    appManager: AppManagerState;
    launchpad: LaunchpadState;
    router: Router;
}
