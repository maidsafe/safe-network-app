/* eslint import/prefer-default-export: off */
import { ClientFunction } from 'testcafe';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
