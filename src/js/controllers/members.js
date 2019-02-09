export default class MembersController {
    constructor(authenticationService) {
        this.auth = authenticationService;
        this.process();
    }

    process() {
        if (this.auth.user) {
            this.profile = this.auth.user;
            this.firstName = this.profile.given_name;
            this.lastName = this.profile.family_name;
            this.school = this.profile.user_metadata.medical_school;
            this.grad = this.profile.user_metadata.graduation_year;
            document.getElementById('account-name').textContent = this.firstName + ' ' + this.lastName;
            document.getElementById('account-school').textContent = this.school;
            document.getElementById('account-grad-year').textContent = this.grad;
            let accountEmail = document.getElementById('account-email');
            this.email = this.profile.email;
            accountEmail.textContent = this.email;
            accountEmail.href = 'mailto:' + this.email;
        }
        else {
            document.getElementById('account-name').textContent = '';
            document.getElementById('account-school').textContent = '';
            document.getElementById('account-grad-year').textContent = ''
            var accountEmail = document.getElementById('account-email');
            accountEmail.textContent = '';
            accountEmail.href = '';
        }
    }
}