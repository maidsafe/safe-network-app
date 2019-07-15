declare namespace NodeJS {
    interface Global {
        port: number;
        preloadFile: string;
        appDirectory: string;
        isCI: boolean;
        isRunningTestCafeProcess: boolean;
        startedRunningMock: boolean;
        shouldStartAsMockFromFlagsOrPackage: boolean;
        isRunningSpectronTestProcessingPackagedApp: boolean;
        SAFE_NODE_LIB_PATH: string;
        SPECTRON_TEST: boolean;
    }
}

declare interface NodeError extends Error {
    line: string;
    file: string;
}

// Enable import of css in typescript
declare module '*.css' {
    const content: any;
    /* eslint-disable-next-line import/no-default-export, import/export */
    export default content;
}

declare module '*.svg' {
    const content: any;
    /* eslint-disable-next-line import/no-default-export, import/export */
    export default content;
}
