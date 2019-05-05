import { FirebaseConnection } from '../../../repositories/firebase/utils';

export default class FirebaseProvider extends FirebaseConnection {
    constructor() {
        super();
        this.storageRef = this.firebase.storage().ref();
    }

    authenticate(token, cb) {
        this.firebase.auth().signInWithCustomToken(token).then((user) => {
            cb(null);
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/invalid-custom-token') {
                return cb('The token you provided is not valid.');
            } else {
                cb(error);
            }
        });
    }

    logout() {
        this.firebase.auth().signOut();
    }
    updateUser (userId, payload) {
        return this.firebase.database().ref('users/' + userId).set(payload);
    }
    
    meetingMinutes(){
        return this.firebase.storage().ref('minutes/');
    }
}