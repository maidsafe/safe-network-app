import { BrowserWindow } from 'electron';

export namespace Application {
    export interface Window extends BrowserWindow {
        openDevTools: Function;
        toggleDevTools: Function;
        inspectElement: Function;
    }
}
