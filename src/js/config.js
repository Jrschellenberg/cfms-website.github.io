export const firebase = {
    apiKey: "AIzaSyCRaJStQDuZ0nrn0b59kzYphlAkJ62flo8",
    authDomain: "amber-heat-9132.firebaseapp.com",
    databaseURL: "https://amber-heat-9132.firebaseio.com",
    storageBucket: "amber-heat-9132.appspot.com",
    messagingSenderId: "466232039218"
};

export const vex = 'vex-theme-default';

export const auth0 = {
    domain: "cfms.auth0.com",
    clientID: "DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ",
    scope: "openid",
    audience: "https://cfms.auth0.com/api/v2/",
    _disableDeprecationWarnings: true
};

export const logout = {
    returnTo: 'http://cfms.org',
    client_id: 'DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ'
};

export const dev_logout = {
    returnTo: '',
    client_id: 'DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ'
};

export const lock = {
    auth: {
        redirectUrl: 'http://localhost:4000/members',
        responseType: 'token'
    },
    theme: {
        logo: '/images/cfms-logo.svg'
    },
    languageDictionary: {
        title: 'CFMS'
    },
    signUpLink: '/new-account.html'
};