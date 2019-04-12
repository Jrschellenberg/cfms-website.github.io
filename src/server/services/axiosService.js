import axios from 'axios';

export default class AxiosService {
  constructor(options) {
    this.axios = axios.create(options);
  }
  getAxios() {
    return axios;
  }
  static post(url, payload, headers) {
    return axios.post(url, payload, headers);
  }
  static get(url, data = {}) {
    return axios.get(url, {
      params: data
    });
  }
}
