export default class Environment {
  static netlifyBackendURL =
    process.env.NODE_ENV === 'production' ? process.env.PROD_NETLIFY_BACKEND_URL + process.env.EXPRESS_NETLIFY_BASE_API_NAME : process.env.DEV_NETLIFY_BACKEND_URL + process.env.EXPRESS_NETLIFY_BASE_API_NAME;
  
  static cloudFunctionBackendURL =
    process.env.NODE_ENV === 'production' ? process.env.PROD_CLOUDFUNCTIONS_BACKEND_URL + process.env.EXPRESS_CLOUDFUNCTIONS_BASE_API_NAME : process.env.DEV_CLOUDFUNCTIONS_NETLIFY_BACKEND_URL + process.env.EXPRESS_CLOUDFUNCTIONS_BASE_API_NAME;
  
  static isDevelopment = process.env.NODE_ENV !== 'production';
  
  static isTestEnvironemnt = process.env.NODE_ENV === 'test';
  
  static getNetlifyBackendURL() {
    return Environment.netlifyBackendURL;
  }
  static getCloudFunctionsBackendURL() {
    return Environment.cloudFunctionBackendURL;
  }
  static isDevelopment() {
    return Environment.isDevelopment;
  }
  static isProduction() {
    return !Environment.isDevelopment;
  }
  static isTestEnvironment() {
    return Environment.isTestEnvironemnt;
  }
}
