/* example using https://github.com/dougmoscrop/serverless-http */
//import '@babel/polyfill';
import serverless from 'serverless-http';
import expressApp from './app';

// Initialize express app
const app = expressApp();

// Export lambda handler
exports.handler = serverless(app);
