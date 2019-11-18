import { TextField, withStyles } from '@material-ui/core';

export const CustomTextField = withStyles( {
    root: {
        '& .MuiFormLabel-root': {
            '&.Mui-focused': {
                color: '#0094FF'
            }
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#0094FF'
            }
        }
    }
} )( TextField );
