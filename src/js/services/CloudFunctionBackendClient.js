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
  getMemberInfo(id){
    return super.get(`/mailchimp/members/${id}`);
  }
  subscribeUserToMailChimp(payload, headers={}) {
    return super.post(`/mailchimp/subscribe/`, payload, headers);
  }
  unsubscribeUserFromMailChimp(id){
    return super.post(`/mailchimp/update/unsubscribed/${id}`, {}, {});
  }
  reSubscribeMailchimpUser(id){
    return super.post(`/mailchimp/update/pending/${id}`, {}, {});
  }
}

export default CloudFunctionBackendClient;
