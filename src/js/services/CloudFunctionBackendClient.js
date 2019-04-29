import AxiosService from './AxiosService';
import Environment from '../environment/Environment';

class CloudFunctionBackendClient extends AxiosService {
  constructor() {
    const backendStoreURL = Environment.getCloudFunctionsBackendURL();
    super({ baseURL: backendStoreURL });
  }
  
  static getInstance = () => {
    if (!CloudFunctionBackendClient.instance) {
      CloudFunctionBackendClient.instance = new CloudFunctionBackendClient();
    }
    return CloudFunctionBackendClient.instance;
  };
  
  subscribeUserToMailChimp(payload, headers={}) {
    return super.post(`/mailchimp/subscribe/`, payload, headers);
  }
}

export default CloudFunctionBackendClient;
