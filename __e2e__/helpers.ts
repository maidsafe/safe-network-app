/* eslint import/prefer-default-export: off */
/* eslint import/no-extraneous-dependencies: off */
import { ClientFunction } from 'testcafe';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
