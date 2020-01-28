import path from 'path';
import os from 'os';

import { isRunningOnWindows } from '$Constants';

let relativeExecLocation = '.safe/authd/safe-authd';

if ( isRunningOnWindows ) {
    relativeExecLocation = `${relativeExecLocation}.exe`;
}
export const AUTHD_LOCATION = path.resolve( os.homedir(), relativeExecLocation );
