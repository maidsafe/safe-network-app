import sudo from 'sudo-prompt';

import pkg from '$Package';

const WIN_SUDO_OPTIONS = {
    name: pkg.productName
    // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

export const sudoPrompt = ( command: string ): Promise<void> => {
    return new Promise( ( resolve, reject ) => {
        sudo.exec( command, WIN_SUDO_OPTIONS, function( error ) {
            if ( error ) reject( error );

            resolve();
        } );
    } );
};
