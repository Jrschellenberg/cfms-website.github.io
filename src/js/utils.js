import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import * as Config from './config';

let instance = null;

export default class Utils {
  constructor() {
    if (instance) return instance;
    Vex.registerPlugin(VexDialog);
    Vex.defaultOptions.className = Config.vex;
    this.vex = Vex;
    instance = this;
  }

  showAlert(title, description) {
    const titleTemplate = `<h3><strong>${title}</strong></h3>`;
    const descriptionTemplate = `<p>${description}</p>`;
    const message = description ? titleTemplate + descriptionTemplate : titleTemplate;
    this.vex.dialog.alert({
      unsafeMessage: message,
    });
  }

  showSigninModal(cb) {
    const self = this;
    this.vex.dialog.open({
      unsafeMessage: '<h3><strong>Log in to cfms.org</strong></h3>',
      input:
        "<div class='vex-custom-field-wrapper'><label for='email'>EMAIL ADDRESS</label><div class='vex-custom-input-wrapper'><input name='email' id='login-email' type='email' placeholder='Enter your email' /></div></div><div class='vex-custom-field-wrapper'><label for='password'>PASSWORD</label><div class='vex-custom-input-wrapper'><input id='login-password' name='password' type='password' value='' placeholder='Enter your password'/></div><div id='new-account-link'><a href='/new-account.html'>Create a New Account</a></div><div id='forgot-password'><a href='/forgot-password.html'>Forgot your Password?</a></div></div>",
      beforeClose: function() {
        if (!this.value) return true;
        else if (!this.value.email || !this.value.password) {
          let form = $(this.form);
          let emailField = form.find("input[name='email']");
          let passwordField = form.find("input[name='password']");
          if (!this.value.email) emailField.addClass('error-field');
          if (!this.value.password) passwordField.addClass('error-field');
          return false;
        }
        $('body').append("<div id='loading-overlay' class='loading'>Loading&#8230;</div>");
        cb(this.value.email, this.value.password, profile => {
          $('#loading-overlay').remove();
          self.showAlert('Signed in', `Welcome back ${profile.given_name} ${profile.family_name}.`);
        });
        return true;
      },
    });
  }
  isPageEnglish() {
    if (window.location.href.indexOf('/fr/') == -1) {
      return true;
    } else {
      return false;
    }
  }

  createButton(path, title, className) {
    let button =
      '<div class="url preview"><p><a style="cursor: pointer;" src="' +
      path +
      '" class="' +
      className +
      '">' +
      title +
      '</a></p></div>';
    return button;
  }

  createWithIdButton(path, title, idName, className) {
    let button =
      '<div class="url preview"><p><a style="cursor: pointer;" src="' +
      path +
      '" id="' +
      idName +
      '" class="' +
      className +
      '">' +
      title +
      '</a></p></div>';
    return button;
  }

  adminDisplayVexDialog(htmlInput, message, callback) {
    vex.dialog
      .open({
        message: message,
        input: [htmlInput].join(''),
        buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Add' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Back' }),
        ],
        callback: function(data) {
          // This executes when a button is pressed
          if (!data) {
            // Executes if back button pressed
            callback(null);
          } else {
            // Executes if Add button pressed
            callback(data);
          }
        },
      })
      .on('change', '#uploadFile', e => {
        // This is an event handler dynamically attached only when modal is clicked!.
        var label = e.target.nextElementSibling,
          labelVal = label.innerHTML,
          fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else fileName = e.target.value.split('\\').pop();

        if (fileName) label.querySelector('span').innerHTML = fileName;
        else label.innerHTML = labelVal;
      });
  }

  displayVexAlert(message) {
    vex.dialog.alert('<h3><strong>' + message + '</strong></h3>');
  }

  sanatizeInput(input) {
    let output = input
      .replace(/<script[^>]*?>.*?<\/script>/gi, '')
      .replace(/<[\/\!]*?[^<>]*?>/gi, '')
      .replace(/<style[^>]*?>.*?<\/style>/gi, '')
      .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
    return output;
  }

  // A custom promise for if a user is sure to continue or not.
  vexConfirm() {
    return new Promise((resolve, reject) => {
      vex.dialog.confirm({
        message: 'Are you sure?',
        callback: value => {
          if (value) {
            resolve(true); // if user selects yes, promise resolves true
          } else {
            reject(false);
          }
        }, // end vex confirm callback
      });
    });
  }
}
