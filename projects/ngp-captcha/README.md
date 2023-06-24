# ngp-captcha

ngp-captcha is an Angular package that provides a simple and customizable captcha generator for your Angular applications. It enables you to easily add captcha functionality to your forms to prevent automated submissions.

## Features

- Generate a random captcha string with customizable length.
- Support for different types of characters, including uppercase letters, lowercase letters, and numbers.
- Customizable appearance and styling options.
- Seamless integration with Angular forms and validation.
- Accessibility-friendly design.
- Lightweight and easy to use.

## Installation

Install the ngp-captcha package via npm:

```shell
npm install ngp-captcha


Usage
Import the NgpCaptchaModule in your Angular module (e.g., app.module.ts):
typescript
Copy code
import { NgpCaptchaModule } from 'ngp-captcha';

@NgModule({
  imports: [
    NgpCaptchaModule
  ],
  // ...
})
export class AppModule { }
Add the ngp-captcha component to your template:
html
Copy code
<ngp-captcha [length]="6" (captchaChange)="onCaptchaChange($event)"></ngp-captcha>
Handle the captcha change event in your component:
typescript
Copy code
onCaptchaChange(captcha: string): void {
  // Handle the generated captcha
  console.log(captcha);
}
For more details and advanced usage options, please refer to the documentation.

Contributing
Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a GitHub issue or pull request.

License
This package is released under the MIT License.

vbnet
Copy code

Replace `link-to-documentation` with the actual link to your documentation, and `link-to-license` with the link to your license file. Make sure to include the appropriate information specific to your ngp-captcha package.

Copy this code and paste it into the README.md file of your GitHub repository. Make any n
