import { h, render } from 'preact'

import App from '../twitter/App';

import './test.scss';

window.CFMS = window.CFMS || {};
window.CFMS.BUILDS = window.CFMS.BUILDS || {};

const initializeApp = (AppRoot) => {
  render(<App />, AppRoot);
}

window.CFMS.BUILDS.twitter_feed_initialization = initializeApp;