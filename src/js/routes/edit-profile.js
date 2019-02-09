import EditProfileController from '../controllers/edit-profile';
import AuthenticationService from '../services/authentication';
import * as Config from '../config';

//Shows Member Account Information on the Members Page
export default function editProfile(ctx, next) {
    new EditProfileController(new AuthenticationService(), Config);

    next();
}
