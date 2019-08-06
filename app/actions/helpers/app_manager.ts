import { mockPromise } from './launchpad';

export const fetchTheApplicationListFromGithub = () => mockPromise();
export const installApplicationById = ( appId: string ) => mockPromise();
export const uninstallApplicationById = ( appId: string ) => mockPromise();
export const updateApplicationById = ( appId: string ) => mockPromise();
export const checkForApplicationUpdateById = ( appId: string ) => mockPromise();
export const storeApplicationSkipVersion = ( appId: string ) => mockPromise();
