import React from 'react';
import { CAPTCHA_SITE_KEY } from '../../constants';
import ReCAPTCHA from 'react-google-recaptcha';

const Recaptcha: React.SFC<{ onChange: (token: string) => void }> = ({ onChange }) => (
  <div className="recaptcha">
    <ReCAPTCHA sitekey={CAPTCHA_SITE_KEY} onChange={onChange} badge="inline" />
  </div>
);

export default Recaptcha;
