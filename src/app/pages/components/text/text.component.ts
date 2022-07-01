import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html'
})
export class TextComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() label: string = "Text";
  @Input() width!: string;
  @Input() minWidth!: string;
  @Input() hint!: string;
  @Input() req: boolean = false;
  @Input() maxLen!: number;               // Maximum number of chars
  @Input() prefix!: string;               // value to prefix
  @Input() sufix!: string;                // value to sufix
  @Input() sufixIcon!: string;            // Icon to sufix
  @Input() edit: boolean = true;          // allowed to be edited
  @Input() upper: boolean = false;        // change to upper case
  @Input() center: boolean = false;       // Align Text Center
  @Input() right: boolean = false;        // Align Text Right
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

  sufixClicked() {
    this.cancelWarning();
    this.sufixClick.emit(this.value);
  }

  changed() {
    this.valueChange.emit(
      this.upper ? this.value.toUpperCase() : this.value
    );
  }

  focused(e: any) {
    const target = e.currentTarget;
    target.setSelectionRange(0, target.value.length);
    this.focus.emit(this.value);
  }

  blured() {
    this.blur.emit(this.value);
  }
}
