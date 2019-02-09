import MembersController from "./members";
import Utils from '../utils';

export default class EditProfileController extends MembersController {
    constructor(authenticationService, config) {
        super(authenticationService);
        this.config = config;
        this.utils = new Utils();
        this.initWidget();
    }

    initWidget() {
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
                }

                // { label: "BirthDay", type:"date", attribute:"birthday" },

                // { label: "Type", type:"select", attribute:"account_type",
                //     options:[
                //         { value: "type_1", text:"Type 1"},
                //         { value: "type_2", text:"Type 2"},
                //         { value: "type_3", text:"Type 3"}
                //     ]
                // }
            ]);

            editProfileWidget.init(this.auth.accessToken);


            editProfileWidget.on('save', (data) => {
                this.auth.updateUserMetadata(data.user_metadata);
                this.utils.showAlert("Profile Updated", "Your profile has been successfully updated.");
            });
        }
    }
}