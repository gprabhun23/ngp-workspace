import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { NgpCaptchaService } from './ngp-captcha.service';

@Component({
  selector: 'lib-ngp-captcha',
  template: `
    <canvas
      #canvasEl
      [width]="imageWidth"
      [height]="imageHeight"
      style="display: none;"
    ></canvas>
    <div *ngIf="ShowCaptcha">
      <div class="row">
        <div class="col-md-12">
          <img
            [src]="base64Image"
            *ngIf="base64Image"
            style="border:1px solid black"
            [width]="imageWidth"
            [height]="imageHeight"
          />
          <span matSuffix class="icon-refresh" (click)="renewCaptcha()"></span>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-md-12">
          <input
              matInput
              placeholder="Enter captcha as shown above"
              [(ngModel)]="enteredCaptchaText" (ngModelChange)="compareCaptchaText()"
              class="w-100"
              maxlength="6"
            />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ngp-captcha.component.scss'],
})
export class NgpCaptchaComponent implements AfterViewInit {
  @ViewChild('canvasEl', { static: false }) canvasEl!: ElementRef;
  public base64Image = '';
  private context!: CanvasRenderingContext2D | null;
  @Input('Text') captchaText = '';
  @Input('DataSource') DataSource: any[] = [];
  @Input('ImageHeight') imageHeight: string = '50';
  @Input('ImageWidth') imageWidth: string = '150';
  @Input('ShowCaptcha') ShowCaptcha: boolean = false;
  @Output() onCaptchaChange: EventEmitter<any> = new EventEmitter();
  enteredCaptchaText = '';
  isCaptchaMatching = false;
  constructor(
    private npgCaptchaService: NgpCaptchaService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.captchaText = this.npgCaptchaService.generateCaptcha();
    this.onSignatureSelection('25px');
    this.cdRef.detectChanges();
  }

  applyStyles(data: any) {
    const obj = {
      'font-family': data.FontFamily,
    };
    return obj;
  }

  compareCaptchaText() {
    if (this.captchaText === this.enteredCaptchaText) {
      this.isCaptchaMatching = true;
      this.onCaptchaChange.emit(true);
    } else {
      this.onCaptchaChange.emit(false);
    }
  }

  onSignatureSelection(FontSize: string) {
    this.captchaImageGenerator(FontSize);
  }

  private captchaImageGenerator(fontSize: string) {
    const arbitraryRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const randomRotation = (degrees = 4) =>
      (arbitraryRandom(-degrees, degrees) * Math.PI) / 180;
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    if(this.context){
      this.context.font = fontSize + ' Montserrat-Regular';
      this.context.textBaseline = 'middle';
      this.context.textAlign = 'center';
      this.context.imageSmoothingQuality = 'high';
      this.context.imageSmoothingEnabled = true;
      this.context.lineWidth = 15;
      this.context.fillStyle = 'black';
      this.context.rotate(randomRotation());
      const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
      const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;
      this.context.fillText(this.captchaText, x, y);
      if (this.context) {
        this.base64Image = (
          this.canvasEl.nativeElement as HTMLCanvasElement
        ).toDataURL('image/png');
        const canvasWidth = (this.canvasEl.nativeElement as HTMLCanvasElement)
          .width;
        const canvasHeight = (this.canvasEl.nativeElement as HTMLCanvasElement)
          .height;
        this.context.clearRect(0, 0, canvasWidth, canvasHeight); // this.captchaAsBase64.emit(this.base64Image);
      }
    }
  }

  renewCaptcha() {
    this.captchaText = this.npgCaptchaService.generateCaptcha();
    this.onSignatureSelection('25px');
    this.enteredCaptchaText = '';
    this.cdRef.detectChanges();
  }
}
