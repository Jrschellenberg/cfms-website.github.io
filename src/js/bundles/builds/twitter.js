import { h, render } from 'preact'
import Settings from '../Settings/Settings';
import App from '../twitter/App';

import './test.scss';

window.CFMS = window.CFMS || {};
window.CFMS.BUILDS = window.CFMS.BUILDS || {};

const initializeApp = (AppRoot, data) => {
  Object.freeze(Settings.createInstance(data)); // Please Don't Modify this object, If you need to modify it make your own Clone!
  render(<App />, AppRoot);
}

window.CFMS.BUILDS.twitter_feed_initialization = initializeApp;
  