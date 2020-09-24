import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs-extra';

import { logger } from '$Logger';

const { platform } = process;

const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

const CONFIG_FILE = 'node_connection_info.config';
// https://sn-node-config.s3.eu-west-2.amazonaws.com/shared-node/node_connection_info.config
const CONFIG_LINK = `https://sn-node-config.s3.eu-west-2.amazonaws.com/shared-node/${CONFIG_FILE}`;
let targetFolder = '.config/sn_node/';

const homedir = require( 'os' ).homedir();

if ( platform === MAC_OS ) {
    targetFolder = 'Library/Preferences/net.MaidSafe.sn_node/';
}

// if (platform === LINUX) {
// }

if ( platform === WINDOWS ) {
    targetFolder = 'AppData/Roaming/MaidSafe/sn_node/config/';
}

const targetPath = path.resolve( homedir, targetFolder, CONFIG_FILE );

const getContent = function( url ) {
    logger.info( 'Getting content from:', url );
    // return new pending promise
    return new Promise( ( resolve, reject ) => {
        // select http or https module, depending on reqested url
        const library = url.startsWith( 'https' ) ? https : http;
        const request = library.get( url, ( response ) => {
            // handle http errors
            logger.info( 'status:', response.statusCode );

            if ( response.statusCode > 299 && response.statusCode < 400 ) {
                logger.info( 'handling redirect' );

                if ( response.headers.location ) {
                    resolve( getContent( response.headers.location ) );
                } else {
                    reject(
                        new Error(
                            `Failed to load page, redirect w/o target given. Status code: ${response.statusCode}`
                        )
                    );
                }
            }

            if ( response.statusCode < 200 || response.statusCode > 299 ) {
                reject(
                    new Error(
                        `Failed to load page, status code: ${response.statusCode}`
                    )
                );
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on( 'data', ( chunk ) => body.push( chunk ) );
            // we are done, resolve promise with those joined chunks
            response.on( 'end', () => resolve( body.join( '' ) ) );
        } );
        // handle connection errors of the request
        request.on( 'error', ( error ) => reject( error ) );
    } );
};

export const updateSharedNodeConfig = async () => {
    logger.info( 'Downloading to:', targetPath );

    const config = await getContent( CONFIG_LINK );

    logger.info( 'Config downloaded...' );

    fs.writeFile( targetPath, config, function( error ) {
        if ( error ) {
            logger.error( 'Error writing file', error );
        }

        logger.info( 'The file was saved!' );
    } );
};
