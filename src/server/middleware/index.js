import ServerUtils from '../utils/serverUtils';
import AxiosService from '../services/axiosService';

export const passCaptcha = (req, res, next) => {
  isPassCaptcha(req)
    .then(() => next())
    .catch(next);
};

const isPassCaptcha = req => {
  return new Promise((resolve, reject) => {
    const captchaResponse = req.body['recaptchaToken'];
    if (captchaResponse === undefined || captchaResponse === '' || captchaResponse === null) {
      reject(ServerUtils.rejectError(422, 'Please Select captcha'));
    }

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${ServerUtils.getSecretCaptcha()}&response=${captchaResponse}`;
    AxiosService.get(verifyUrl)
      .then(response => {
        const body = response.data;
        if (body.success !== undefined && !body.success) {
          reject(ServerUtils.rejectError(400, 'Captcha URL potentially malformed, Please try again.'));
        }
        resolve();
      })
      .catch(err => {
        reject(
          ServerUtils.rejectError(400, `Captcha URL potentially malformed, Please try again. Error from Link ${err}`)
        );
      });
  });
};
