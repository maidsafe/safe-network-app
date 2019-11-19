import { PropTypes } from '@material-ui/core';
import { OutlinedTextFieldProps } from '@material-ui/core/TextField';

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

const DEFAULT_COLOR: PropTypes.Color = 'primary';
const DEFAULT_TEXT_VARIANT: OutlinedTextFieldProps['variant'] = 'outlined';

const DEFAULT_THEME = {
    // GREEN for ticks etc: #6EDD00
    palette: {
        primary: {
            main: '#283593'
            // light: '#3948ab',
            // dark: '#1a227e',
            // contrastText: '#FFFFFF'
        },

        secondary: {
            main: '#FF5722'
            // light: '#ff8965',
            // dark: '#e64919',
            // contrastText: '#FFFFFF'
        },
        error: {
            main: '#E2254C'
            // light: '#ee607e',
            // dark: '#bd1a46',
            // contrastText: '#FFFFFF'
        }
    },
    // spacing: 2,
    typography: {
        fontFamily: 'SF Pro Text, "Helvetica Neue", Arial, sans-serif'
        // h5: {
        //     fontSize: '20px',
        //     lineHeight: '24px',
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR
        // },
        // h6: {
        //     fontSize: '20px',
        //     lineHeight: '24px',
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM
        // },
        // body2: {
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR,
        //     fontSize: '14px',
        //     lineHeight: '20px'
        // },
        // subtitle2: {
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM,
        //     fontSize: '14px'
        // },
        // caption: {
        //     fontSize: '12px',
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.REGULAR,
        //     color: 'rgba(0, 0, 0, 0.6)'
        // },
        // button: {
        //     fontSize: '14px',
        //     fontWeight: SF_PRO.TEXT.FONT_WEIGHT.MEDIUM
        // }
    },
    props: {
        MuiButtonBase: {
            // The default props to change
            disableRipple: true
        },
        MuiButton: {
            color: DEFAULT_COLOR
        },
        MuiTextField: {
            variant: DEFAULT_TEXT_VARIANT,
            fullWidth: true
        }
    }
    // overrides : {
    //     MuiOutlinedInput: {
    //         // notchedOutline: {
    //         //     borderColor: 'red',
    //         // },
    //     }
    // }
};

export const THEME = DEFAULT_THEME;
