import { BrowserWindow } from 'electron';

export namespace Application {
    export interface Window extends BrowserWindow {
        openDevTools: Function;
        toggleDevTools: Function;
        inspectElement: Function;
    }
}

export interface ManagedApplication {
    name: string;
    packageName: string;
    type: 'userApplications' | 'developmentApplications';
    repository: string;
    latestVersion?: string;
    isOpen?: boolean;
    progress?: number;
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
    type: string;
    priority: string;
    appId?: string;
}

export interface LaunchpadState {
    shouldOnboard: boolean;
    userPreferences: {};
    notifications: { [s: string]: Notification };
    launchpad: {
        hasUpdate: boolean;
        newVersion: boolean;
        isUpdating: boolean;
    };
}

export interface Apps {
    id: string;
    name: string;
    isInstalling: boolean;
    isUpdating: boolean;
    isUninstalling: boolean;
    progress: number;
}

export interface AppManagerState {
    applicationList: { [appId: string]: Apps };
}
