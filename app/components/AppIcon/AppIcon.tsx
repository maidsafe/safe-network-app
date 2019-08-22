import React from 'react';
import { Avatar } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';

interface Props {
    url?: string;
    fontSize?: 'large' | 'small' | 'default';
    className?: string;
}

export class AppIcon extends React.PureComponent<Props> {
    render() {
        const { url = '', fontSize = 'default', className = '' } = this.props;

        if ( url ) {
            return <Avatar className={className} src={url} />;
        }

        return (
            <Avatar className={className}>
                <FolderIcon fontSize={fontSize} />
            </Avatar>
        );
    }
}
