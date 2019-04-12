require('dotenv').config();

class ServerUtils {
  constructor() {
    if (!ServerUtils.instance) {
      // if an instance does not exist
      this.serverName = process.env.EXPRESS_BASE_API_NAME;
      this.secretCaptcha = process.env.GOOGLE_CAPTCHA_SECRET;
      this.emailUserName = process.env.SENDER_EMAIL_USERNAME;
      this.emailPassword = process.env.SENDER_EMAIL_PASSWORD;
      this.recipientEmailUserName = process.env.RECIPIENT_EMAIL_ADDRESS;
      this.clientId = process.env.OAUTH_CLIENT_ID;
      this.secretId = process.env.OAUTH_SECRET_ID;
      this.refreshToken = process.env.OAUTH_REFRESH_TOKEN;
      ServerUtils.instance = this;
    }
    return ServerUtils.instance;
  }
  getRoutePath() {
    // Set router base path for local dev
    return process.env.DEV_ENV === 'true' ? `/${this.serverName}` : `/.netlify/functions/${this.serverName}/`;
  }
  getClientId() {
    return this.clientId;
  }
  getSecretId() {
    return this.secretId;
  }
  getRefreshToken() {
    return this.refreshToken;
  }
  getSecretCaptcha() {
    return this.secretCaptcha;
  }
  getEmailUserName() {
    return this.emailUserName;
  }
  getEmailPassword() {
    return this.emailPassword;
  }
  getRecipientsEmail() {
    return this.recipientEmailUserName;
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
