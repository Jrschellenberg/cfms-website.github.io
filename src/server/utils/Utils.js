require('dotenv').config();

export default class Utils {
  
  static isTestEnvironment() {
    return process.env.ENV === 'test';
  }
  static isProductionEnvironment() {
    return process.env.ENV === 'production';
  }
  
  static getCorsOptions() {
    if(Utils.isProductionEnvironment()){
      return  {
        origin: process.env.CORS_ORIGIN,
        optionsSuccessStatus: 200
      }
    }
    return {};
  }
  
  static rejectError(status, message){
    let rejectError = {
      status: status,
      message: message
    };
    return rejectError;
  }
}
