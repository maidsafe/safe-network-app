/* eslint import/prefer-default-export: off */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ClientFunction } from 'testcafe';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
