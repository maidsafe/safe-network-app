import * as React from 'react';

interface Props {
    children: React.ReactChild;
}
export const App = ( properties ) => {
    const { children } = properties;
    return <React.Fragment>{children}</React.Fragment>;
};
