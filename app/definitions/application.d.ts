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
    type: 'userApplications' | 'developmentApplications';
    currentVersion?: string;
    isOpen?: boolean;
    progress?: number;
}

export interface ApplicationsState {
    userApplications: Array<ManagedApplication>;
    developmentApplications: Array<ManagedApplication>;
}

export interface TheState {
    applications : ApplicationsState
}

export interface ApplicationsAction {
    payload: ManagedApplication;
    meta: {};
    type: string;
}
