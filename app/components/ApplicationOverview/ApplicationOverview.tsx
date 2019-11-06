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
import { AppIcon } from '$Components/AppIcon';
// import { logger } from '$Logger';
import { AppStateButton } from '$Components/AppStateButton';
import { getAppStatusText } from '$Utils/app_utils';
import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resetAppInstallationState: Function;
    pushNotification: Function;
    resumeDownload: Function;
    updateApp: Function;
    downloadAndInstallApp: Function;
    application: App;
    history: {
        push: Function;
    };
}

export class ApplicationOverview extends React.PureComponent<Props> {
    render() {
        const { application, history } = this.props;

        const progressText = getAppStatusText( application );
        const secondaryText = application.error || progressText;

        return (
            <>
                <ListItem
                    className={styles.list}
                    button
                    aria-label={`List ${application.name}`}
                    onClick={() => {
                        history.push( `/application/${application.id}` );
                    }}
                >
                    <ListItemAvatar>
                        <AppIcon url={application.iconPath} />
                    </ListItemAvatar>
                    <ListItemText
                        className={styles.listText}
                        primary={application.name}
                        primaryTypographyProps={{
                            variant: secondaryText ? 'caption' : 'body2'
                        }}
                        secondary={secondaryText}
                        secondaryTypographyProps={{
                            color: application.error
                                ? 'error'
                                : 'textSecondary',
                            variant: 'body2'
                        }}
                    />
                    <ListItemSecondaryAction className={styles.actions}>
                        <AppStateButton
                            unInstallApp={this.props.unInstallApp}
                            openApp={this.props.openApp}
                            downloadAndInstallApp={
                                this.props.downloadAndInstallApp
                            }
                            pauseDownload={this.props.pauseDownload}
                            resetAppInstallationState={
                                this.props.resetAppInstallationState
                            }
                            pushNotification={this.props.pushNotification}
                            resumeDownload={this.props.resumeDownload}
                            updateApp={this.props.updateApp}
                            application={application}
                            key="list-secondary-action-1"
                        />
                        <MeatballMenu
                            unInstallApp={this.props.unInstallApp}
                            openApp={this.props.openApp}
                            downloadAndInstallApp={
                                this.props.downloadAndInstallApp
                            }
                            pauseDownload={this.props.pauseDownload}
                            cancelDownload={this.props.cancelDownload}
                            resumeDownload={this.props.resumeDownload}
                            updateApp={this.props.updateApp}
                            application={application}
                            key="list-secondary-action-2"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </>
        );
    }
}
