import MembersController from "./members";
import Utils from '../utils';
import CloudFunctionBackendClient from '../services/CloudFunctionBackendClient';
import md5 from 'md5';

export default class EditProfileController extends MembersController {
    constructor(authenticationService, config) {
        super(authenticationService);
        this.config = config;
        this.utils = new Utils();
        this.cloudFunctionBackendClient = CloudFunctionBackendClient.getInstance();
        this.initWidget();
    }

    async initWidget() {
        if (this.auth.user) {
            let editProfileWidget = new Auth0EditProfileWidget('editProfileContainer', { domain: this.config.auth0.domain }, [
              
                { label: "Medical School", type:"select", attribute:"medical_school",
                    options: [
                        { value: "University of British Columbia", text: "University of British Columbia"},
                        { value: "University of Alberta", text: "University of Alberta"},
                        { value: "University of Calgary", text: "University of Calgary"},
                        { value: "University of Saskatchewan", text: "University of Saskatchewan"},
                        { value: "University of Manitoba", text: "University of Manitoba"},
                        { value: "Northern Ontario School of Medicine", text: "Northern Ontario School of Medicine"},
                        { value: "Western University", text: "Western University"},
                        { value: "McMaster University", text: "McMaster University"},
                        { value: "University of Toronto", text: "University of Toronto"},
                        { value: "Queen's University", text: "Queen's University"},
                        { value: "University of Ottawa", text: "University of Ottawa"},
                        { value: "McGill University", text: "McGill University"},
                        { value: "Dalhousie University", text: "Dalhousie University"},
                        { value: "Université de Moncton Campus", text: "Universit&eacute; de Moncton Campus"},
                        { value: "Memorial University of Newfoundland", text: "Memorial University of Newfoundland"},
                        { value: "Université Laval", text: "Universit&eacute; Laval"}
                    ]
                },
                { label: "Graduation Year", type:"select", attribute:"graduation_year",
                    options: [
                        { value: 2019, text:"2019"},
                        { value: 2020, text:"2020"},
                        { value: 2021, text:"2021"},
                        { value: 2022, text:"2022"},
                        { value: 2023, text:"2023"},
                        { value: 2024, text:"2024"}
                    ]
                },
    
                { id:"customName", type:"custom", attribute:"is_subscribed_mail_chimp", render: function(value) {
                        return `<label class="checkbox-container">Subscribe email to CFMS Monthly Update?
                                    <input id="account-subscribe-to-email" type="checkbox" ng-model="account-subscribe-to-email" checked="checked"
                                           name="account-subscribe-to-email"/>
                                    <span class="checkmark"></span>
                                </label>`;
                    },
                },
            ]);
            editProfileWidget.init(this.auth.accessToken);
            
            let isSubscribe = true;
            const clickFunction = this.debounce(() => {
               isSubscribe = !isSubscribe;
            });
            document.querySelector('.checkbox-container').addEventListener('click', clickFunction);
            
            const email = this.auth.user.email;
            const mailchimpId = email ? md5(email.toLowerCase()) : '';

            
            editProfileWidget.on('save', async(data) => {
                try{
                    const firstName = data.user_metadata.given_name;
                    const lastName = data.user_metadata.family_name;
                    let oldSubscribe;

                    const memberInfo = await this.cloudFunctionBackendClient.getMemberInfo(mailchimpId);
                    if(memberInfo && memberInfo.data && memberInfo.data.status && memberInfo.data.status === 200){
                        oldSubscribe = memberInfo.data.data.status;
                    }
                    else {
                        oldSubscribe = 'notSubscribed'
                    }
                    
                    if(isSubscribe && oldSubscribe === 'notSubscribed'){
                        const payload = {
                            firstName: firstName,
                            lastName: lastName,
                            email: email
                        };
                        this.cloudFunctionBackendClient.subscribeUserToMailChimp(payload); // Asynchronous call to a Backend
                    }
                    else if(isSubscribe && mailchimpId && (oldSubscribe === "unsubscribed" || oldSubscribe === "pending")){ // ReSubscribe them
                        this.cloudFunctionBackendClient.reSubscribeMailchimpUser(mailchimpId); // Asynchronous call to a Backend
                    }
                    else if(!isSubscribe && mailchimpId && oldSubscribe === 'subscribed'){ // UnsubScribe Them
                        this.cloudFunctionBackendClient.unsubscribeUserFromMailChimp(mailchimpId); // Asynchronous call to a Backend
                    }
                }
                catch(e){
                    console.error("Error occured while trying to update Mailchimp API!", e);
                }
                this.auth.updateUserMetadata(data.user_metadata);
                this.utils.showAlert("Profile Updated", "Your profile has been successfully updated.");
            });
        }
    }
    
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}
