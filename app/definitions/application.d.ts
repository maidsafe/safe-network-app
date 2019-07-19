import { BrowserWindow } from 'electron';
import { Router } from 'react-router';

export namespace Application {
    export interface Window extends BrowserWindow {
        openDevTools: Function;
        toggleDevTools: Function;
        inspectElement: Function;
    }
}

export interface ManagedApplication {
    id: string;
    name: string;
    packageName: string;
    type: 'userApplications' | 'developmentApplications';
    repository: string;
    latestVersion?: string;
    isOpen?: boolean;
    progress?: number;
    isInstalling?: boolean;
    isUpdating?: boolean;
    isUninstalling?: boolean;
    hasUpdate?: boolean;
    lastSkippedVersion?: string;
    error?: Error | null;
}

export interface ApplicationsState {
    userApplications: Array<ManagedApplication>;
    developmentApplications: Array<ManagedApplication>;
}

export interface TheState {
    applications: ApplicationsState;
}

export interface ApplicationsAction {
    payload: ManagedApplication;
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
    packageName: string;
    type: AppType;
    repository: string;
    latestVersion?: string;
    isOpen?: boolean;
    progress?: number;
    isInstalling?: boolean;
    isUpdating?: boolean;
    isUninstalling?: boolean;
    hasUpdate?: boolean;
    lastSkippedVersion?: string;
    error?: Error | null;
}

export interface LaunchpadState {
    shouldOnboard: boolean;
    userPreferences: UserPreferences;
    notifications: { [s: string]: Notification };
    standardWindowIsVisible: boolean;
}

export interface AppManagerState {
    applicationList: { [appId: string]: App };
}

export interface AppState {
    appManager: AppManagerState;
    launchpad: LaunchpadState;
    router: Router;
}
