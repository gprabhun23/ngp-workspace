import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgpCaptchaService {

  constructor() { }

  generateCaptcha(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';

    // Add a random uppercase letter
    captcha += characters.charAt(Math.floor(Math.random() * 26));

    // Add a random lowercase letter
    captcha += characters.charAt(Math.floor(Math.random() * 26) + 26);

    // Add a random number
    captcha += characters.charAt(Math.floor(Math.random() * 10) + 52);

    // Add remaining random characters
    for (let i = 0; i < 3; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Shuffle the captcha characters randomly
    const shuffledCaptcha = captcha.split('').sort(() => 0.5 - Math.random()).join('');

    return shuffledCaptcha;
  }
}
