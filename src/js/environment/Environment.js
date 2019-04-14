export default class Environment {
  static backendURL =
    process.env.NODE_ENV === 'production' ? process.env.PROD_BACKEND_URL + process.env.EXPRESS_BASE_API_NAME : process.env.DEV_BACKEND_URL + process.env.EXPRESS_BASE_API_NAME;
  
  static isDevelopment = process.env.NODE_ENV !== 'production';
  
  static isTestEnvironemnt = process.env.NODE_ENV === 'test';
  
  static getBackendURL() {
    return Environment.backendURL;
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