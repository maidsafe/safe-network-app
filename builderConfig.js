const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, consistent-return
const publishedFilePath = () => {
    if ( platform === OSX ) {
        return `safe-network-app-mac`;
    }
    if ( platform === LINUX ) {
        return `safe-network-app-linux`;
    }
    if ( platform === WINDOWS ) {
        return `safe-network-app-win`;
    }
};

const buildConfig = {
    afterPack: './internals/scripts/afterPack.js',
    productName: 'SAFE Network App',
    appId: 'org.develar.SAFENetworkApp',
    files: [
        './package.json',
        'app/dist',
        'app/tray-icon.png',
        'app/app.html',
        'app/bg.html',
        'app/main.prod.js',
        'app/main.prod.js.map',
        {
            from: 'app/assets',
            to: 'assets'
        }
    ],
    artifactName: `safe-network-app-v\${version}-\${os}-x64.\${ext}`,
    dmg: {
        contents: [
            {
                x: 130,
                y: 220
            },
            {
                x: 410,
                y: 220,
                type: 'link',
                path: '/Applications'
            }
        ]
    },
    win: {
        target: ['nsis', 'msi']
    },
    mac: {
        target: ['dmg', 'pkg', 'zip']
    },
    linux: {
        target: ['AppImage', 'zip'],
        category: 'Productivity'
    },
    directories: {
        buildResources: 'resources',
        output: 'release'
    },
    publish: [
        {
            provider: 's3',
            bucket: 'safe-network-app',
            path: `${publishedFilePath()}`,
            acl: 'public-read'
        }
    ]
};

module.exports = buildConfig;
