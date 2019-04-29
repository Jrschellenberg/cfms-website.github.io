import AxiosService from './AxiosService';
import Environment from '../environment/Environment';

class CloudFunctionBackendClient extends AxiosService {
  constructor() {
    const backendStoreURL = Environment.getNetlifyBackendURL();
    super({ baseURL: backendStoreURL });
  }
  
  static getInstance = () => {
    if (!CloudFunctionBackendClient.instance) {
      CloudFunctionBackendClient.instance = new CloudFunctionBackendClient();
    }
    return CloudFunctionBackendClient.instance;
  };
  
  subscribeUserToMailChimp(payload, headers={}) {
    return super.post(`/tweets/`, payload, headers);
  }
}

export default CloudFunctionBackendClient;
