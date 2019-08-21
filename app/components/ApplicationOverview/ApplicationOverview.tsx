import React from 'react';
import { Link } from 'react-router-dom';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Avatar,
    Fab,
    Typography
} from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import FolderIcon from '@material-ui/icons/Folder';
import { MeatballMenu } from '$Components/MeatballMenu';
// import { logger } from '$Logger';
import { AppStateButton } from '$Components/AppStateButton';
import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
    application: App;
}

export class ApplicationOverview extends React.PureComponent<Props> {
    render() {
        const { application } = this.props;

        return (
            <React.Fragment>
                <ListItem className={styles.list}>
                    <ListItemAvatar>
                        {application.iconUrl ? (
                            <Avatar src={application.iconUrl} />
                        ) : (
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        )}
                    </ListItemAvatar>
                    <Link to={`/application/${application.id}`}>
                        <ListItemText
                            primary={application.name}
                            secondary={application.error}
                            secondaryTypographyProps={{
                                color: 'error'
                            }}
                        />
                    </Link>
                    <ListItemSecondaryAction className={styles.actions}>
                        <AppStateButton
                            {...this.props}
                            key="list-secondary-action-1"
                        />
                        <MeatballMenu
                            {...this.props}
                            key="list-secondary-action-2"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    }
}
