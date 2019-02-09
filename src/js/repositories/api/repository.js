import request from 'request-promise';

export default class ApiRepository {
    constructor(Model, endpoint) {
        this.Model = Model;
        this.endpoint = endpoint;
    }

    get(uid = '') {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return console.log('Error: no access token found.');
        var options = {
            uri: `https://cfms.us.webtask.io/api/${this.endpoint}/${uid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        return request(options).then(data => new this.Model(data));
    }

    getAll() {

    }
}
