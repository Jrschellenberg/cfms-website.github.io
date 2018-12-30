import { FirebaseConnection } from '../repositories/firebase/utils';

class LeadershipAwardUserController extends FirebaseConnection {
    constructor(authenticationService) {
        super();
        this.auth = authenticationService;
        this.process();
        this.activateFileUploadSupport();
        this.submitApplication();
    }

    process() {
    	// console.log("Access token is...");
    	// console.log(this.auth.accessToken);
    	if(this.auth.user) { //Is this user logged in?
		    var controller = this;
		    //Have they even saved any files?
		    var refPath = 'leadership-award/' + window.config.leadership_award_year + '/' + controller.auth.userId;
		    controller.firebase.database().ref(refPath).once('value').then((snapshot) => {
			    //If they have, load information.
			    if (snapshot.exists()) {
				    var application = snapshot;
				    //Loads the submitted application if one exists
				    if (application.child('submitted').exists()) {
					    controller.loadSubmission();
				    }
				    //Otherwise displays saved files
				    else {
					    //refPath = refPath + '/' + controller.auth.userId;
                        if (application.child('completeApplication').exists())
                           controller.loadPrevFile(refPath, 'complete-application', application.val().completeApplication);
					    // if (application.child('personalStatement').exists())
						 //    controller.loadPrevFile(refPath, 'personal-statement', application.val().personalStatement);
					    // if (application.child('curriculumVitae').exists())
						 //    controller.loadPrevFile(refPath, 'curriculum-vitae', application.val().curriculumVitae);
					    // if (application.child('letterGoodStanding').exists())
						 //    controller.loadPrevFile(refPath, 'letter-good-standing', application.val().letterGoodStanding);
					    // if (application.child('reference1').exists())
						 //    controller.loadPrevFile(refPath, 'reference-1', application.val().reference1);
					    // if (application.child('reference2').exists())
						 //    controller.loadPrevFile(refPath, 'reference-2', application.val().reference2);

					    var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
					    for (var i = 0; i < beforeSubmissionElements.length; i++)
						    beforeSubmissionElements[i].style.display = 'block';
					    var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
					    for (var i = 0; i < afterSubmissionElements.length; i++)
						    afterSubmissionElements[i].style.display = 'none';
				    }
			    }
			    else {
				    var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
				    for (var i = 0; i < beforeSubmissionElements.length; i++)
					    beforeSubmissionElements[i].style.display = 'block';
				    var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
				    for (var i = 0; i < afterSubmissionElements.length; i++)
					    afterSubmissionElements[i].style.display = 'none';
			    }
		    });
	    }
	    else{
    		console.log("You need to be signed in, sorry");
	    }

    } //End process()
	activateFileUploadSupport(){
    if(this.auth.user) {
	    //File upload support
	    var fileUploaders = document.getElementsByClassName('awardApplicationUpload'), i;
	    for (var i = 0; i < fileUploaders.length; i++) {
		    fileUploaders[i].addEventListener('change', this.handleFileSelect.bind(this), false);
	    }
    }
    else{
    	console.log("user is not signed in, error!");
    }
	}

  submitApplication(){
		if(this.auth.user) {
			var controller = this;
			window.submitApplication = function () {
				//Email Verification
				var emailAddress = document.getElementById('email-address').value;
				if (emailAddress.length < 4) {
					vex.dialog.alert('<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>');
					return;
				}

				//CMA Membership verification
				// var cmaMembershipID = document.getElementById('cma-membership').value;
				// if (cmaMembershipID.length !== 6 || !controller.isInt(cmaMembershipID)) {
				// 	vex.dialog.alert('<h3><strong>Invalid CMA Membership ID</strong></h3><p>Your CMA Membership ID should be a 6 digit number.</p>');
				// 	return;
				// }
				//Ensures that every necessary file is present
				var refPath = 'leadership-award/' + window.config.leadership_award_year +'/' + controller.auth.userId;
				controller.firebase.database().ref(refPath).once('value').then(function (snapshot) {
					if (!snapshot.child('completeApplication').exists()
						// !snapshot.child('personalStatement').exists()
						// || !snapshot.child('curriculumVitae').exists()
						// || !snapshot.child('letterGoodStanding').exists()
						// || !snapshot.child('reference1').exists()
						// || !snapshot.child('reference2').exists()
					) {
						vex.dialog.alert('<h3><strong>Missing Supporting Document</strong></h3><p>You are missing a supporting document.</p>');
						return;
					}

					//Twitter Handle sanitization
					var twitterHandle = document.getElementById('twitter-handle').value;
					if (twitterHandle.charAt(0) !== '@')
						twitterHandle = '@' + twitterHandle;
					if (twitterHandle.length === 1 && twitterHandle.charAt(0) === '@')
						twitterHandle = '';

					//Meeting Attendance conversion to yes/no.
					var meetingAttendance = document.getElementById('attend-cfms-meeting').value;
					if (meetingAttendance.charAt(0) === 'Y')
						meetingAttendance = "Yes";
					else
						meetingAttendance = "No";

					//Saves the submission data into the database
					controller.firebase.database().ref(refPath).update({
						submitted: true,
						name: document.getElementById('account-name').textContent,
						medicalSchool: document.getElementById('account-school').textContent,
						graduationYear: document.getElementById('account-grad-year').textContent,
						emailAddress: emailAddress,
						// cmaMembershipID: cmaMembershipID,
						twitterHandle: twitterHandle,
						meetingAttendance: meetingAttendance,
						dateSubmitted: controller.getTimeEST(),
                        linkCompleteApplication: document.getElementById('complete-application-link').childNodes[0].href,
						// linkPersonalStatement: document.getElementById('personal-statement-link').childNodes[0].href,
						// linkCurriculumVitae: document.getElementById('curriculum-vitae-link').childNodes[0].href,
						// linkLetterGoodStanding: document.getElementById('letter-good-standing-link').childNodes[0].href,
						// linkReference1: document.getElementById('reference-1-link').childNodes[0].href,
						// linkReference2: document.getElementById('reference-2-link').childNodes[0].href,
					});
					//Displays success dialog
					vex.dialog.alert('<h3><strong>Application Submitted</strong></h3><p>Congratulations! You have successfully submitted your application.</p>');
					//Loads the submission fields
					controller.loadSubmission();
				}); //End firebase call.
			} //End submitApplication
		}
		else{
			console.log("user not signed in, it errored in submitapplication");
		}
  }
	loadSubmission (){
  	var controller = this;
		var storageRef = controller.firebase.storage().ref();
		//Loads user-associated data
        if (this.auth.user) {
            let profile = this.auth.user;
            var firstName = profile.given_name;
            var lastName = profile.family_name;
            document.getElementById('submitted-name').textContent = firstName + ' ' + lastName;
            document.getElementById('submitted-school').textContent = profile.user_metadata.medical_school;
            document.getElementById('submitted-grad-year').textContent = profile.user_metadata.graduation_year;
        }
        else {
            document.getElementById('submitted-name').textContent = '';
            document.getElementById('submitted-school').textContent = '';
            document.getElementById('submitted-grad-year').textContent = '';
        }
        document.getElementById('submitted-name').textContent = firstName + ' ' + lastName;
        document.getElementById('submitted-school').textContent = snapshot.val().medicalSchool;
        document.getElementById('submitted-grad-year').textContent = snapshot.val().graduationYear;
		//Loads other submitted data
		refPath = 'leadership-award/' + window.config.leadership_award_year + '/' + this.auth.userId;
		controller.firebase.database().ref(refPath).once('value').then(function(snapshot) {
			if (!snapshot.child('submitted').exists())
				return;
			let submittedEmail = document.getElementById('submitted-email');
			let accountEmail;
			if (this.auth.user)
				accountEmail = (snapshot.val().emailAddress) ? snapshot.val().emailAddress : this.auth.user.email;
			else
				accountEmail = snapshot.val().emailAddress;
			submittedEmail.textContent = snapshot.val().emailAddress = accountEmail;
			submittedEmail.href = 'mailto:' + accountEmail;
			// document.getElementById('submitted-cma-id').textContent = snapshot.val().cmaMembershipID;
			var twitterHandle = snapshot.val().twitterHandle;
			if (twitterHandle === '')
				document.getElementById('submitted-twitter-handle').textContent = 'Not given';
			else
				document.getElementById('submitted-twitter-handle').innerHTML = '<a href="https://twitter.com/' + twitterHandle.substring(1) + '" target="_blank">' + twitterHandle + '</a>';
			document.getElementById('submitted-attending-sgm').textContent = snapshot.val().meetingAttendance;
			document.getElementById('submitted-date-time').textContent = snapshot.val().dateSubmitted;

            //Loads submitted files
            storageRef.child(refPath + '/complete-application/' + snapshot.val().completeApplication).getDownloadURL().then(function(url) {
                document.getElementById('submitted-complete-application').href = url;
            }).catch(function(error) {
                // File doesn't exist
            });

			// //Loads submitted files
			// storageRef.child(refPath + '/personal-statement/' + snapshot.val().personalStatement).getDownloadURL().then(function(url) {
			// 	document.getElementById('submitted-personal-statement').href = url;
			// }).catch(function(error) {
			// 	// File doesn't exist
			// });
			// storageRef.child(refPath + '/curriculum-vitae/' + snapshot.val().curriculumVitae).getDownloadURL().then(function(url) {
			// 	document.getElementById('submitted-curriculum-vitae').href = url;
			// }).catch(function(error) {
			// 	// File doesn't exist
			// });
			// storageRef.child(refPath + '/letter-good-standing/' + snapshot.val().letterGoodStanding).getDownloadURL().then(function(url) {
			// 	document.getElementById('submitted-letter-good-standing').href = url;
			// }).catch(function(error) {
			// 	// File doesn't exist
			// });
			// storageRef.child(refPath + '/reference-1/' + snapshot.val().reference1).getDownloadURL().then(function(url) {
			// 	document.getElementById('submitted-reference-1').href = url;
			// }).catch(function(error) {
			// 	// File doesn't exist
			// });
			// storageRef.child(refPath + '/reference-2/' + snapshot.val().reference2).getDownloadURL().then(function(url) {
			// 	document.getElementById('submitted-reference-2').href = url;
			// }).catch(function(error) {
			// 	// File doesn't exist
			// });
		});

		//Hides the submission form and displays the application
		var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
		for (var i = 0; i < beforeSubmissionElements.length; i ++)
			beforeSubmissionElements[i].style.display = 'none';
		var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
		for (var i = 0; i < afterSubmissionElements.length; i ++)
			afterSubmissionElements[i].style.display = 'block';
	} //End loadSubmission

	loadPrevFile (refPath, id, fileName){
		console.log(refPath);
		console.log("hitting loadPrevFile");
    var controller = this;
    var storageRef = controller.firebase.storage().ref();
		//Set the button to show the file name
		var input = document.getElementById(id);
		var label = input.nextElementSibling;
		label.querySelector( 'span' ).innerHTML = fileName;

		//Set the URL to display by the button
		storageRef.child(refPath + '/' + id + '/' + fileName).getDownloadURL().then(function(url) {
			console.log("found prev file!");
			controller.setFileLink (id, url);
		}).catch(function(error) {
			// File doesn't exist
		});
	}
	/**
	 * Sets the file link from the target id to the correct url
	 */
	setFileLink (id, url){
		document.getElementById(id+'-link').innerHTML = '<a href="' +  url + '" target="_blank">View File</a>';
	}
	// isInt (cmaMembershipID){
	// 	for (var i = 0; i < cmaMembershipID.length; i++){
	// 		var currentChar = cmaMembershipID.charAt(i);
	// 		if (currentChar < '0' || currentChar > '9')
	// 			return false;
	// 	}
	// 	return true;
	// } //end isInt

	getTimeEST(){
		//EST
		let offset = -4.0; //Changed this to -4, when offset = 1 = greenwich time therefore since Est is -5, 1-5 = -4
		//OR if that doesn't make since EST is 4 hours behind UTC time not 5, therefore -4
		let clientDate = new Date();
		let utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
		let serverDate = new Date(utc + (3600000*offset));
		return (serverDate.toLocaleString());
	}

	handleFileSelect(evt) {
		console.log("handle file select event firing!!");
		//Uncomment this when ready for testing!
		let controller = this;
		var storageRef = controller.firebase.storage().ref();
		evt.stopPropagation();
		evt.preventDefault();
		var file = evt.target.files[0];
		var metadata = {
			'contentType': file.type
		};

		//Deletes the previous version of file, if it exists
		//--------------------------------------------
		var refPath = 'leadership-award/' + window.config.leadership_award_year +'/' + this.auth.userId;
		controller.firebase.database().ref(refPath).once('value').then(function(snapshot) {
			var deletePath = refPath + '/' + evt.target.id + '/';
			switch(evt.target.id) {
                case 'complete-application':
                	if (snapshot.child('completeApplication').exists())
                		controller.deleteFile (deletePath + snapshot.val().completeApplication);
                	break;
				// case 'personal-statement':
				// 	if (snapshot.child('personalStatement').exists())
				// 		controller.deleteFile (deletePath + snapshot.val().personalStatement);
				// 	break;
				// case 'curriculum-vitae':
				// 	if (snapshot.child('curriculumVitae').exists())
				// 		controller.deleteFile (deletePath + snapshot.val().curriculumVitae);
				// 	break;
				// case 'letter-good-standing':
				// 	if (snapshot.child('letterGoodStanding').exists())
				// 		controller.deleteFile (deletePath + snapshot.val().letterGoodStanding);
				// 	break;
				// case 'reference-1':
				// 	if (snapshot.child('reference1').exists())
				// 		controller.deleteFile (deletePath + snapshot.val().reference1);
				// 	break;
				// case 'reference-2':
				// 	if (snapshot.child('reference2').exists())
				// 		controller.deleteFile (deletePath + snapshot.val().reference2);
				// 	break;
			}

			//Add the new version of the file
			//--------------------------------------------
		}).then (function() {
			// Push to child path.
			// [START oncomplete]
			refPath = 'leadership-award/' + window.config.leadership_award_year + '/' + controller.auth.userId + '/' + evt.target.id;
			storageRef.child(refPath + '/' + file.name).put(file, metadata).then(function(snapshot) {
				var url = snapshot.metadata.downloadURLs[0];
				controller.setFileLink (evt.target.id, url);
			}).catch(function(error) {
				// [START onfailure]
				vex.dialog.alert('<h3><strong>Upload failed</strong></h3><p>' + error + '</p>');
				// [END onfailure]
			});
			// [END oncomplete]

			//Copies filenames of uploaded files onto database
			//--------------------------------------------
		}).then (function(){
			refPath = 'leadership-award/' + window.config.leadership_award_year + '/' + controller.auth.userId;
			switch(evt.target.id) {
                case 'complete-application':
                	controller.firebase.database().ref(refPath).update({
                		completeApplication:file.name
                	})
                	break;
				// case 'personal-statement':
				// 	controller.firebase.database().ref(refPath).update({
				// 		personalStatement:file.name
				// 	})
				// 	break;
				// case 'curriculum-vitae':
				// 	controller.firebase.database().ref(refPath).update({
				// 		curriculumVitae:file.name
				// 	})
				// 	break;
				// case 'letter-good-standing':
				// 	controller.firebase.database().ref(refPath).update({
				// 		letterGoodStanding:file.name
				// 	})
				// 	break;
				// case 'reference-1':
				// 	controller.firebase.database().ref(refPath).update({
				// 		reference1:file.name
				// 	})
				// 	break;
				// case 'reference-2':
				// 	controller.firebase.database().ref(refPath).update({
				// 		reference2:file.name
				// 	})
				// 	break;
			}
		});
	} //End handle fileSelect
	/**
	 * Deletes files with a given path
	 */
	deleteFile (filePath){
		var storageRef = this.firebase.storage().ref();
		storageRef.child(filePath).delete().then(function() {
			//File deleted successfully
		}).catch(function(error){
			console.log("DELETE " + error);
			return error;
		});
	}
}
class LeadershipAwardAdminController extends FirebaseConnection {
    constructor(authenticationService) {
        super();
        this.auth = authenticationService;
        this.process();
    }

    process() {
        //Confirm that present user is an admin.
        if (!this.auth.user.isAdmin) return console.log("Error: Must be an admin to view this resource.");

        //Iterates through each submitted application
        var query = this.firebase.database().ref('leadership-award/' + window.config.leadership_award_year).orderByKey();
        //[!- START QUERY]
        query.once("value").then((snapshot) => {
            var applicationsHTML = '';
            var noApplicants = 0;
            snapshot.forEach(function (childSnapshot) {
                //If a member has submitted an application
                if (childSnapshot.child('submitted').exists()) {
                    noApplicants++;
                    var submission = childSnapshot;
                    applicationsHTML += '<blockquote><div class="flex-wrapper award-application"><div class="left-col"><h4 class="review-header"><strong>Applicant</strong></h4>';
                    applicationsHTML += '<label>Name</label><div class="review-text-field">';
                    applicationsHTML += submission.val().name + '</div>';
                    applicationsHTML += '<label>Medical School</label><div class="review-text-field">';
                    applicationsHTML += submission.val().medicalSchool + '</div>';
                    applicationsHTML += '<label>Graduating Year</label><div class="review-text-field">';
                    applicationsHTML += submission.val().graduationYear + '</div>';
                    applicationsHTML += '<label>Email Address</label><div class="review-text-field">';
                    applicationsHTML += submission.val().emailAddress + '</div>';
                    // applicationsHTML += '<label>CMA Membership ID</label><div class="review-text-field">';
                    // applicationsHTML += submission.val().cmaMembershipID + '</div>';
                    applicationsHTML += '<label>Twitter Handle</label><div class="review-text-field">';
                    var twitterHandle = submission.val().twitterHandle;
                    if (twitterHandle === '')
                        applicationsHTML += 'Not given</div>';
                    else
                        applicationsHTML += '<a href="https://twitter.com/' + twitterHandle.substring(1) + '" target="_blank">' + twitterHandle + '</a></div>';
                    applicationsHTML += '<label>Attending the CFMS SGM?</label><div class="review-text-field">';
                    applicationsHTML += submission.val().meetingAttendance + '</div>';
                    applicationsHTML += '</div><div class="right-col"><h4 class="review-header"><strong>Attached Files</strong></h4><ul>';
                    applicationsHTML += '<li><a href="' + submission.val().linkCompleteApplication + '" target="_blank">Supporting Documents</a></li>';
                    // applicationsHTML += '<li><a href="' + submission.val().linkPersonalStatement + '" target="_blank">Personal Statement</a></li>';
                    // applicationsHTML += '<li><a href="' + submission.val().linkCurriculumVitae + '" target="_blank">Resume/Curriculum Vitae</a></li>';
                    // applicationsHTML += '<li><a href="' + submission.val().linkLetterGoodStanding + '" target="_blank">Proof of Good Standing</a></li>';
                    // applicationsHTML += '<li><a href="' + submission.val().linkReference1 + '" target="_blank">Reference Letter #1</a></li>';
                    // applicationsHTML += '<li><a href="' + submission.val().linkReference2 + '" target="_blank">Reference Letter #2</a></li>';
                    applicationsHTML += '</ul><h4><strong>Date Submitted</strong></h4>';
                    applicationsHTML += '<div class="review-text-field" style="font-weight:normal">' + submission.val().dateSubmitted + '</div>';
                    applicationsHTML += '</ul></div></div></blockquote>';
                }
            });
            //Write the HTML for the submissions
            if (noApplicants !== 0)
                document.getElementById('submitted-applications-list').innerHTML = applicationsHTML;
            else
                document.getElementById('submitted-applications-list').innerHTML = '<blockquote><h3><strong>No Submitted Applications Yet</strong></h3><ul><li>It\'s only a matter of time!</li></ul></blockquote>'
        });
            //[!- END QUERY]
    }
}
export { LeadershipAwardUserController, LeadershipAwardAdminController };
