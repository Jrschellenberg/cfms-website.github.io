require('dotenv').config();

class ServerUtils {
  constructor() {
    if (!ServerUtils.instance) {
      // if an instance does not exist
      this.serverName = process.env.EXPRESS_BASE_API_NAME;
      this.secretCaptcha = process.env.GOOGLE_CAPTCHA_SECRET;
      
      this.twitterCredentials = {
        subdomain: "api",
        consumer_key: process.env.TWITTER_CONSUMER_KEY, // from Twitter.
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // from Twitter.
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY, // from your User (oauth_token)
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET, // from your User (oauth_token_secret)
      };

      ServerUtils.instance = this;
    }
    return ServerUtils.instance;
  }

  getRoutePath() {
    // Set router base path for local dev
    return process.env.DEV_ENV === 'true' ? `/${this.serverName}` : `/.netlify/functions/${this.serverName}/`;
  }
  getTwitterCredentials() {
    return this.twitterCredentials;
  }
  getSecretCaptcha() {
    return this.secretCaptcha;
  }

  throwError(status, message, next) {
    let err = new Error(message);
    err.status = status;
    return next(err);
  }

  rejectError(status, message) {
    let rejectError = {
      status: status,
      message: message
    };
    return rejectError;
  }

  sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
}

const instance = new ServerUtils();
export default instance; //Singleton pattern. only exposing this one instance.
