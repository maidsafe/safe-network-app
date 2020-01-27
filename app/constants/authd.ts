import path from 'path';
import os from 'os';

export const AUTHD_LOCATION = path.resolve(
    os.homedir(),
    '/.safe/authd/safe-authd'
);
