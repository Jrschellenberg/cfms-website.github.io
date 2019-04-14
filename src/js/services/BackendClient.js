import AxiosService from './axiosService';
import Environment from '../environment/Environment';

class BackendClient extends AxiosService {
  constructor() {
    const backendStoreURL = Environment.getBackendURL();
    super({ baseURL: backendStoreURL });
  }
  
  static getInstance = () => {
    if (!BackendClient.instance) {
      BackendClient.instance = new BackendClient();
    }
    return BackendClient.instance;
  };
  
  getTweets(handle = 'cfmsfemc', count = 3) {
    return super.get(`/tweets/${handle}?count=${count}`);
  }
}

export default BackendClient;