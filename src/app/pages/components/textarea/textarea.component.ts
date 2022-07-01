import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html'
})
export class TextareaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() label: string = "Text Area";
  @Input() width!: string;
  @Input() minWidth: string = '100%';
  @Input() hint!: string;
  @Input() req: boolean = false;
  @Input() maxLen!: number;               // Maximum number of chars
  @Input() rows: number = 1;
  @Input() edit: boolean = true;          // allowed to be edited
  @Input() upper: boolean = false;         // change to upper case
  @Input() caution: boolean = false;
  @Input() warning: boolean = false;
  @Input() value: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() click: EventEmitter<string> = new EventEmitter<string>();
  @Output() sufixClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();
  @Output() focus: EventEmitter<string> = new EventEmitter<string>();

  // cancel warning and caution color
  cancelWarning() {
    if (this.caution || this.warning) {
      this.caution = false;
      this.warning = false;
    }
  }

  clicked() {
    this.cancelWarning();
    this.click.emit(this.value);
  }

  changed() {
    if (this.upper) {
      this.value = this.value.toUpperCase();
    }
    let calcRows = (this.value.match(/\n/g) || '').length + 1
    this.rows = (this.rows > calcRows) ? this.rows : calcRows;
    this.valueChange.emit(this.value);
  }

  focused(e: any) {
    this.focus.emit(this.value);
  }

  blured() {
    this.blur.emit(this.value);
  }
}
