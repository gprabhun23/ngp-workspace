import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ngp-rich-text-editor',
  template: `<div class="cntrl-mb">

  <div>

    <button (click)="onChangeStyle('span-i')" style="font-style: italic;" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable" *ngIf="isItalicRequired" tabindex="-1">
      I
    </button>

    <button (click)="onChangeStyle('span-sup')" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable" *ngIf="isSuperScriptRequired" tabindex="-1">
      x²
    </button>

    <button (click)="onChangeStyle('span-sub')" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable" *ngIf="isSubScriptRequired" tabindex="-1">
      x₂
    </button>

    <button (click)="onChangeStyle('span-0')" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable">
      ⌫
    </button>

    <button (click)="onChangeStyle('span-r')" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable" *ngIf="isRegisteredRequired" tabindex="-1">
      ®
    </button>

    <button (click)="onChangeStyle('span-tm')" class="icon-cls small-icon-button mr-2"
      [disabled]="!iscontenteditable" *ngIf="isTradeMarkRequired" tabindex="-1">
      ™
    </button>

  </div>

  <div [contentEditable]="iscontenteditable" class="editable" #rtbcontent [innerHTML]="innerhtmltext"
    [style.width.%]="width" tabindex="0" (keypress)="onKeyPress()" (input)="onContentChange($event)"
    (blur)="onBlur($event)" (focus)="onfocus($event)"
    [ngStyle]="(innerhtmltext.changingThisBreaksApplicationSecurity == '' || innerhtmltext.changingThisBreaksApplicationSecurity == null) ? { border: '1px solid red' } : { border: '1px solid #ccc' }">

  </div>
  <span></span>
  <p *ngIf="
      innerhtmltext.changingThisBreaksApplicationSecurity == '' ||
      innerhtmltext.changingThisBreaksApplicationSecurity == null
    " class="mat-form-field mat-error">
    Please enter {{ description }}
  </p>
</div>
`,
  styleUrls: ['./npg-rich-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NgpRichTextEditorComponent),
    },
  ],
})
export class NgpRichTextEditorComponent implements OnInit {
  @ViewChild('rtbcontent', { static: false }) elRef!: ElementRef;
  @Output() valueChange = new EventEmitter();
  @Input() value = '';
  @Input() description = '';
  iscontenteditable = true;
  innerhtmltext: any;
  @Input() isItalicRequired: boolean = false;
  @Input() isSuperScriptRequired: boolean = false;
  @Input() isSubScriptRequired: boolean = false;
  @Input() isRegisteredRequired: boolean = false;
  @Input() isTradeMarkRequired: boolean = false;
  @Input() width: number = 40;
  @Input() maxLength: number = 500;
  showButtons: boolean = false;
  private rtecontentSub$ = new Subject<string | undefined>();
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.rtecontentSub$
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((filterValue: string | undefined) => {
        if(filterValue!=undefined){
          if (filterValue == '' || filterValue == '<br>') {
            this.elRef.nativeElement.innerHTML =
              this.elRef.nativeElement.textContent;
          }
          let htmlcontent = this.elRef.nativeElement.innerHTML;
          this.setEndOfContenteditable(this.elRef.nativeElement);
          this.valueChange.emit(htmlcontent);
        }

      });
  }

  onChangeStyle(style: string) {
    if (style == 'span-0') {
      this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.textContent;
    } else if (style == 'span-clear') {
      this.elRef.nativeElement.innerHTML = '';
    } else if (style == 'span-r' || style == 'span-tm') {
      this.getCaretPosition(style);
    } else {
      var sel = window.getSelection(); // Gets selection
      if (sel?.rangeCount) {
        var e = document.createElement('span');
        e.classList.add(style); // Selected style (class)
        e.innerHTML = sel.toString(); // Selected text
        var range = sel.getRangeAt(0);
        range.deleteContents(); // Deletes selected text…
        range.insertNode(e); // … and inserts the new element at its place
      }
    }
    let htmlcontent = this.elRef.nativeElement.innerHTML;

    this.valueChange.emit(htmlcontent);
  }

  onContentChange(event: Event): void {
    const target = event.target as HTMLInputElement; // Adjust the type based on your specific element type

    if (target) {
      const content = target.value; // Access the value of the input element (or the appropriate property for your element)
      // Handle the content change
      this.rtecontentSub$.next(content);
    }
  }

  private onChange: (name: string) => void = () => {};

  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    const val = String(obj);
    this.value = val;
    if (this.value) {
      this.innerhtmltext = this.sanitizer.bypassSecurityTrustHtml(this.value);
    } else {
      this.innerhtmltext = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.iscontenteditable = false;
    } else {
      this.iscontenteditable = true;
    }
  }

  doInput() {
    this.onChange(this.elRef.nativeElement.innerHTML);
  }

  doBlur() {
    this.onTouched();
  }

  extractContent(s: any) {
    var span = document.createElement('div');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  setEndOfContenteditable(contentEditableElement: any) {
    if (contentEditableElement) {
      contentEditableElement.focus(); // select all the content in the element
      document.execCommand('selectAll', false, undefined); // collapse selection to the end
      document.getSelection()?.collapseToEnd();
    }
  }

  getCaretPosition(style: string) {
    var caretPos = 0,
      sel,
      range;
    var content = '';
    if (style == 'span-r') {
      content = '®';
    } else if (style == 'span-tm') {
      content = '™';
    }
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel?.rangeCount) {
        range = sel?.getRangeAt(0);
        caretPos = range.endOffset;
        var e = document.createElement('span');
        e.innerHTML = content; // Selected text
        range.deleteContents(); // Deletes selected text…
        range.insertNode(e);
      }
    }
    return caretPos;
  }

  onBlur(event: any) {
    if (event) {
      this.showButtons = false;
    }
  }

  onfocus(event: any) {
    if (event) {
      this.showButtons = true;
    }
  }

  onKeyPress() {
    return this.elRef.nativeElement.textContent.length < this.maxLength;
  }
}
