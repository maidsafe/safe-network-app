import React, { Component } from 'react';
import { Input, Row, Col, Button, Tag } from 'antd';
import * as childProcess from 'child_process';

import styles from './Home.css';

const AUTHENTICATOR_PORT_NUMBER = 41805;

export class Home extends Component {
    constructor( properties ) {
        super( properties );
        this.state = {
            secret: '',
            password: '',
            authDaemon: null,
            loggingIn: false,
            loggedIn: false
        };
    }

    login = () => {
        this.setState( {
            loggingIn: true
        } );

        const cliCmd = '/opt/safe/safe_auth';
        const cliArguments = ['--pretty', '--daemon', AUTHENTICATOR_PORT_NUMBER];
        const environmentVars = {
            env: {
                SAFE_AUTH_SECRET: this.state.secret,
                SAFE_AUTH_PASSWORD: this.state.password
            }
        };

        if ( !this.state.authDaemon ) {
            const authDaemon = childProcess.spawn( cliCmd, cliArguments, environmentVars );

            const handleStdoutData = ( data ) => {
                this.setState( {
                    loggingIn: false,
                    loggedIn: true,
                    authDaemon
                } );
            };

            const handleStderrData = ( data ) => {
                this.setState( {
                    loggingIn: false,
                    loggedIn: false,
                    authDaemon: null
                } );
            };
            const handleClose = ( code ) => {
                /* console.log(
                    `Authenticator daemon process exited with code ${code}`
                ); */
                this.setState( {
                    authDaemon: null,
                    loggedIn: false
                } );
            };

            authDaemon.stdout.on( 'data', handleStdoutData.bind( this ) );
            authDaemon.stderr.on( 'data', handleStderrData.bind( this ) );
            authDaemon.on( 'close', handleClose.bind( this ) );
        }
    };

    handleSecretChange = ( event ) => {
        this.setState( { secret: event.target.value } );
    };

    handlePasswordChange = ( event ) => {
        this.setState( { password: event.target.value } );
    };

    render() {
        return (
            <div className={styles.container} data-tid="container">
                <h4>Log in to SAFE</h4>
                <br />
                <Col>
                    <Row>
                        <Input.Password
                            disabled={this.state.loggedIn}
                            onChange={this.handleSecretChange}
                            placeholder="secret"
                            value={this.state.secret}
                        />
                    </Row>
                    <Row>
                        <Input.Password
                            disabled={this.state.loggedIn}
                            onChange={this.handlePasswordChange}
                            onPressEnter={this.login}
                            placeholder="password"
                            value={this.state.password}
                        />
                    </Row>
                    <Row>
                        <Button
                            disabled={
                                this.state.loggedIn ||
                                ( this.state.secret.length === 0 &&
                                    this.state.password.length === 0 )
                            }
                            loading={this.state.loggingIn}
                            onClick={this.login}
                        >
                            Log in
                        </Button>
                    </Row>
                    <Row>
                        <br />
                        <Tag color={this.state.loggedIn ? 'green' : 'red'}>
                            {this.state.loggedIn
                                ? 'Logged-In!!!'
                                : 'Logged out'}
                        </Tag>
                    </Row>
                </Col>
            </div>
        );
    }
}
