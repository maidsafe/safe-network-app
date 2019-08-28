module.exports = {
    remote: {
        app: {
            getAppPath: jest.fn()
        },
        dialog: {
            showMessageBox: jest.fn()
        },
        getGlobal: jest.fn()
    },
    nativeImage: {
        createFromPath: jest.fn()
    }
};
