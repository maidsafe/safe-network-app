import { BrowserWindow } from 'electron';
import { Router } from 'react-router';

export namespace Application {
    export interface Window extends BrowserWindow {
        openDevTools: Function;
        toggleDevTools: Function;
        inspectElement: Function;
    }
}

export interface AuthDClient {
    start: Function;
    stop: Function;
    restart: Function;
    status: Function;
    allow: Function;
    deny: Function;
    subscibe: Function;
    create_acc: Function;
    log_in: Function;
    log_out: Function;
}

export interface AuthRequest {
    appId: string;
    requestId: string;
}

export interface AuthDState {
    isLoggedIn: boolean;
    error: string;
    isWorking: boolean;
    pendingRequests: Array<AuthRequest>;
}

export interface ApplicationsState {
    userApplications: Array<App>;
    developmentApplications: Array<App>;
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
    application?: App;
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
    iconPath: string;

    type: AppType;
    currentVersion?: string;
    latestVersion: string;

    isOpen?: boolean; // ?why...
    progress?: number;
    isPaused?: boolean;
    isDownloadingAndInstalling?: boolean;
    isDownloadingAndUpdating?: boolean;
    isUninstalling?: boolean;

    hasUpdate?: boolean;
    isUpdating?: boolean;
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
    authd: AuthDState;
}
