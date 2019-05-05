import MembersController from "./members";
import Utils from '../utils';
import CloudFunctionBackendClient from '../services/CloudFunctionBackendClient';

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
                // { label: "Name", type:"text", attribute:"name",
                //     validation: function(name){
                //         return (name.length > 10 ? 'The name is too long' : null);
                //     }
                // },

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
                { label: "Email", type:"text", attribute:"email",
                    validation: function(email) {
                        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                            return null
                        }
                        return "Please check the email address provided."
                    }
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
    
            // TODO: Instead of Storing the Hash, Just do it yourself on this end using md5. Too much Data moving around.
            
            let isSubscribe = true;
            
            const clickFunction = this.debounce(() => {
               isSubscribe = !isSubscribe;
               console.log(isSubscribe);
            });
            document.querySelector('.checkbox-container').addEventListener('click', clickFunction);
            
            console.log(this.auth.user.user_metadata);
            
            editProfileWidget.on('save', async(data) => {
                try{
                    let oldSubscribe;
                    if(this.auth.user.user_metadata && this.auth.user.user_metadata.mailchimp_id){
                        const memberInfo = await this.cloudFunctionBackendClient.getMemberInfo(this.auth.user.user_metadata.mailchimp_id);
                        if(memberInfo && memberInfo.data && memberInfo.data.status && memberInfo.data.status === 200){
                            oldSubscribe = memberInfo.data.data.status;
                            console.log("TAGS ARE", memberInfo);
                        }
                        else {
                            oldSubscribe = 'unsubscribed'
                        }
                    }
                    else{
                        oldSubscribe = 'unsubscribed'
                    }
                    
                    console.log("OLD SUBSCRIBE IS ", oldSubscribe);
                    
                    const newSubscribe = isSubscribe.toString();
                    
                    const firstName = data.user_metadata.given_name;
                    const lastName = data.user_metadata.family_name;
                    const email = data.user_metadata.email;
    
    
    
                    if(isSubscribe && !data.user_metadata.mailchimp_id){
                        const payload = {
                            firstName: firstName,
                            lastName: lastName,
                            email: email
                        };
                        const resp = await this.cloudFunctionBackendClient.subscribeUserToMailChimp(payload); // Asynchronous call to a Backend
                        console.log(resp);
                        if(resp && resp.data && resp.data.status && resp.data.status === 200){
                            data.user_metadata.mailchimp_id = resp.data.data.id;
                            data.user_metadata.is_subscribed_mail_chimp = newSubscribe;
                        }
                    }
                    else if(isSubscribe && data.user_metadata.mailchimp_id && (oldSubscribe === "unsubscribed" || oldSubscribe === "pending")){ // ReSubscribe them
                        console.log("hit resubscribe");
                        
                        const resp = await this.cloudFunctionBackendClient.reSubscribeMailchimpUser(data.user_metadata.mailchimp_id); // Asynchronous call to a Backend
                        if(resp && resp.data && resp.data.status && resp.data.status === 200){
                            data.user_metadata.is_subscribed_mail_chimp = newSubscribe;
                        }
                        
                    }
                    else if(!isSubscribe && data.user_metadata.mailchimp_id && oldSubscribe === 'subscribed'){ // UnsubScribe Them
                        console.log('Hit Unsubscribe');
                        
                        const resp = await this.cloudFunctionBackendClient.unsubscribeUserFromMailChimp(data.user_metadata.mailchimp_id); // Asynchronous call to a Backend
                        if(resp && resp.data && resp.data.status && resp.data.status === 200){
                            data.user_metadata.is_subscribed_mail_chimp = newSubscribe;
                        }
                    }
    
                    data.user_metadata.is_subscribed_mail_chimp = "false";
    
                    
                }
                catch(e){
                    console.error("Error occured while trying to update Mailchimp API!", e);
                }
                
                console.log("data is ", data.user_metadata);
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