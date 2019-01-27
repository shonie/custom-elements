import { configure } from '@storybook/html';

const req = require.context('../src', true, /.stories.js$/);

configure(() => req.keys().forEach(filename => req(filename)), module);
