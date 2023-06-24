import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgpCaptchaComponent } from './ngp-captcha.component';



@NgModule({
  declarations: [
    NgpCaptchaComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    NgpCaptchaComponent
  ]
})
export class NgpCaptchaModule { }
