import chalk from 'chalk';
import detectPort from 'detect-port';

( function CheckPortInUse() {
    const port = process.env.PORT || '1232';

    detectPort( port, ( error, availablePort ) => {
        if ( port !== String( availablePort ) ) {
            throw new Error(
                chalk.whiteBright.bgRed.bold(
                    `Port "${port}" on "localhost" is already in use. Please use another port. ex: PORT=4343 yarn dev`
                )
            );
        } else {
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit( 0 );
        }
    } );
} )();
