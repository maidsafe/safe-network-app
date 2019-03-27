import React, { Component } from 'react';
import { Input, Row, Col, Button } from 'antd';

import styles from './Home.css';

// interface Props {}
export const Home = ( properties ): React.ReactNode => {
    return (
        <div className={styles.container} data-tid="container">
            <h4>Log in to SAFE</h4>
            <h6>safe-auth://home/#/login</h6>
            <Col>
                <Row>
                    <Input placeholder="secret" />
                </Row>
                <Row>
                    <Input placeholder="password" />
                </Row>
                <Row>
                    <Button>Log innn</Button>
                </Row>
            </Col>
        </div>
    );
};
