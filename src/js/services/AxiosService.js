import axios from 'axios';

export default class AxiosService {
  constructor(options) {
    this.axios = axios.create(options);
  }
  getAxios() {
    return this.axios;
  }
  post(url, payload, headers) {
    return this.axios.post(url, payload, headers);
  }
  get(url, data = {}) {
    return this.axios.get(url, {
      params: data,
    });
  }
}