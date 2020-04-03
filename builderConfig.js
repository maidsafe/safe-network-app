const thePackage = require( './package.json' );

const { platform } = process;
const allPassedArguments = process.argv;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const publishedFilePath = () => {
    const { name } = thePackage;

    if ( platform === LINUX ) {
        return `${name}-linux`;
    }
    if ( platform === WINDOWS ) {
        return `${name}-win`;
    }

    return `${name}-mac`;
};

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const getProductName = () => {
    let { productName } = thePackage;

    if ( thePackage.version.includes( '-alpha' ) ) {
        productName = `${productName} Alpha`;
    }

    if ( thePackage.version.includes( '-beta' ) ) {
        productName = `${productName} Beta`;
    }

    return productName;
};

const buildConfig = {
    appId: 'org.develar.SAFENetworkApp',
    generateUpdatesFilesForAllChannels: true,
    artifactName: `${thePackage.name}-v\${version}-\${os}-x64.\${ext}`,
    afterPack: './internals/scripts/afterPack.js',
    afterSign: './internals/scripts/afterSign.js',
    productName: getProductName(),
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
            to: 'assets',
        },
    ],
    dmg: {
        contents: [
            {
                x: 130,
                y: 220,
            },
            {
                x: 410,
                y: 220,
                type: 'link',
                path: '/Applications',
            },
        ],
    },
    win: {
        target: ['nsis', 'zip'],
        publisherName: 'MaidSafe.net Limited',
    },
    linux: {
        target: ['AppImage', 'zip'],
        category: 'Productivity',
    },
    mac: {
        target: ['dmg', 'pkg', 'zip'],
        hardenedRuntime: true,
        entitlements: 'resources/entitlements.mac.plist',
        entitlementsInherit: 'resources/entitlements.mac.plist',
    },
    directories: {
        buildResources: 'resources',
        output: 'release',
    },
    publish: [
        {
            provider: 's3',
            bucket: 'safe-network-app',
            path: `${publishedFilePath()}`,
            acl: 'public-read',
        },
    ],
};

module.exports = buildConfig;
