import path from 'path';
import os from 'os';
import log from 'electron-log';

import {
    currentWindowId,
    environment,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningDebug,
    inBgProcess,
    isRunningTestCafeProcessingPackagedApp,
    isRunningTestCafeProcess,
    inMainProcess,
    isDryRun,
    isCI,
    LOG_FILE_NAME
} from '$Constants';

if ( log.transports ) {
    // Log level
    // error, warn, log, log, debug, silly
    // log.transports.console.level = 'silly';
    log.transports.file.level = 'silly';
    log.transports.console.level = 'silly';

    if (
        isRunningTestCafeProcess ||
        process.env.NODE_ENV === 'test' ||
        ( !isRunningDebug && isRunningPackaged )
    ) {
        log.transports.file.level = 'warn';
        log.transports.console.level = 'warn';
    }

    log.transports.file.file = path.resolve( os.tmpdir(), LOG_FILE_NAME );

    log.transports.console.format = '[{label} {h}:{i}:{s}.{ms}] › {text}';
    if ( currentWindowId ) {
        log.variables.label = `window ${currentWindowId}`;
    }
    if ( inMainProcess ) {
        log.variables.label = 'main';
        log.transports.console.format =
            '%c[{label} {h}:{i}:{s}.{ms}]%c › {text}';
    }

    if ( inBgProcess ) {
        log.variables.label = 'background';
    }

    log.transports.file.maxSize = 5 * 1024 * 1024;
}

// HACK: for jest
if (
    // ( inMainProcess && isRunningUnpacked ) ||
    isRunningDebug &&
    !isRunningTestCafeProcess
) {
    // TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
    log.info( '' );
    log.info( '' );
    log.info( '' );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( `      Started with node environment: ${environment}` );
    log.info( '       Log location:', log.transports.file.file );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( 'Running with derived constants:' );
    log.info( '' );
    log.info( 'isCI?: ', isCI );
    log.info( 'process.env.NODE_ENV: ', process.env.NODE_ENV );
    log.info( 'isDryRun?', isDryRun );
    log.info( 'isRunningDebug?', isRunningDebug );
    log.info( 'isRunningUnpacked?', isRunningUnpacked );
    log.info( 'isRunningPackaged?', isRunningPackaged );
    log.info( 'inMainProcess?', inMainProcess );
    log.info( 'isRunningTestCafeProcess?', isRunningTestCafeProcess );
    log.info(
        'isRunningTestCafeProcessingPackagedApp?',
        isRunningTestCafeProcessingPackagedApp
    );
    log.info( '' );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( '' );

    process.on( 'uncaughtException', ( error: NodeError ) => {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'whoops! there was an uncaught error:' );
        log.error( error, error.line );
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );

    process.on( 'unhandledRejection', ( error: NodeError ) => {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'Unhandled Rejection. Reason:' );
        log.error( error, '\n' );
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );
}

export const logger = log;
