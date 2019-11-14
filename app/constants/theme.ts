const SF_PRO = {
    TEXT: {
        FONT_WEIGHT: {
            HEAVY: 800,
            BOLD: 700,
            SEMIBOLD: 600,
            MEDIUM: 500,
            REGULAR: 400,
            LIGHT: 200,
            ULTRATHIN: 100
        }
    }
};

const DEFAULT_THEME = {
    // GREEN for ticks etc: #6EDD00
    palette: {
        primary: {
            main: '#4054B2',
            light: '#0094FF'
            // light: '#E4E6F1',
            // main: string;
            // dark?: string;
            // contrastText?: string;
        },

        secondary: { main: '#FF5722' },
        error: {
            main: '#E2254C'
        }
    },
    // spacing: 2,
    typography: {
        fontFamily: 'SF Pro Text, "Helvetica Neue", Arial, sans-serif',
        h5: {
            fontSize: '20px',
            lineHeight: '24px',
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR
        },
        h6: {
            fontSize: '20px',
            lineHeight: '24px',
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM
        },
        body2: {
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR,
            fontSize: '14px',
            lineHeight: '20px'
        },
        subtitle2: {
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM,
            fontSize: '14px'
        },
        caption: {
            fontSize: '12px',
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR,
            color: 'rgba(0, 0, 0, 0.6)'
        },
        button: {
            fontSize: '14px',
            fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM
        }
    },
    props: {
        MuiButtonBase: {
            //     // The default props to change
            disableRipple: true
            //     // variant: 'contained'
        }
        // ,
        // Button: {
        //     variant: 'contained',
        // }
    }
};

export const THEME = DEFAULT_THEME;
