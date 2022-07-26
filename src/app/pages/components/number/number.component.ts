import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberComponent),
    multi: true
  }]
})
export class NumberComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (this.req && this.formattedNumber === '') {
      this.formattedNumber = '0';
    }

    if (this.round > 0 && this.value) {
      this.value = Math.ceil(this.value / this.round) * this.round;
    }
    
    // Format initial number according to 'formatted' Input value
    this.formattedNumber = this.formatNumber(this.value);
  }

  @Input() label: string = "Number";
  @Input() width!: string;
  @Input() minWidth!: string;
  @Input() hint!: string;
  @Input() req: boolean = false;
  @Input() round: number = 0;             // Decimal to round 10, 100, 1000...
  @Input() tons: boolean = false;         // convert number less than 1000 to tousands
  @Input() formatted: boolean = true;     // Format the number
  @Input() decimal: boolean = false;      // Accepts only integer
  @Input() int: boolean = false;          // only integer
  @Input() maxDigit: number = 10;         // maximumSignificantDigits
  
  // Maximum number of digits
  // Has to compensate for the 'comas' in the number (ie. 100,000,000)
  // So we add 1 char to each 3.5 chars.
  _maxLen!: number;
  @Input() set maxLen(value:number) {
    this._maxLen = value + Math.floor((value - 0.5) / 3);
  }

  @Input() negative: boolean = true;      // accept negative value
  @Input() prefix!: string;               // value to prefix
  @Input() sufix!: string;                // value to sufix
  @Input() sufixIcon!: string;            // Icon to sufix
  @Input() edit: boolean = true;          // allowed to be edited
  @Input() clickable: boolean = true;
  @Input() caution: boolean = false;
  @Input() warning: boolean = false;

  @Input() set value(value:number|null) {
    this.formattedNumber = this.formatNumber(value);
  }
  get value():number | null {
    return this.deformatNumber(this.formattedNumber);
  }

  @Output() valueChange: EventEmitter<number | null> = new EventEmitter<number | null>();
  @Output() sufixClick: EventEmitter<number | null> = new EventEmitter<number | null>();
  @Output() blur: EventEmitter<number | null> = new EventEmitter<number | null>();
  @Output() focus: EventEmitter<number | null> = new EventEmitter<number | null>();

  formattedNumber!: string;

  formatNumber(num: number | null): string {
    return num != null ? this.formatted ? num.toLocaleString('en-US', { maximumSignificantDigits: this.maxDigit }) : num.toString() : '';
  }

  deformatNumber(numStr: string): number | null {
    // don't try to format if the input is just '-'
    if (numStr === '-') return null;
    return numStr != '' && numStr != undefined ? Number(numStr.replace(/,/g, '')) : 0;
  }

  // cancel warning and caution color
  cancelWarning() {
    if (this.clickable && (this.caution || this.warning)) {
      this.caution = false;
      this.warning = false;
    }
  }

  clicked() {
    this.cancelWarning();
  }

  sufixClicked() {
    this.cancelWarning();
    this.sufixClick.emit(this.value);
  }

  keypress(e: any) {
    // Allow minus sign
    if (e.charCode === 45 && this.negative && this.formattedNumber.length === 0) {
      return true;
    }

    // return only one decimal point or if the input must be integer.
    if (e.charCode === 46 && (this.formattedNumber.includes('.') || this.int)) {
      return false;
    }

    // return only numbers or decimal
    return e.charCode === 46 || (e.charCode >= 48 && e.charCode <= 57);
  }

  changed() {
    // this.value = this.deformatNumber(this.formattedNumber);
    this.updateChanges();
    this.valueChange.emit(this.value);
  }

  focused(e: any) {
    // this.formattedNumber = this._value != null ? String(this._value) : '';
    const target = e.currentTarget;
    target.setSelectionRange(0, target.value.length)

    // Select input text
    // uses timer to alow the value to change before selecting the text
    // setTimeout(this.select, 100, target);
    this.focus.emit(this.value);
  }

  // Select text
  // select(target: any) {
  //   target.setSelectionRange(0, target.value.length)
  // }

  blured() {
    // if tons than value must be min 1000
    if (this.tons && (this.formattedNumber && this.formattedNumber.includes('.'))) {
      this.value =  this.value ? this.value * 1000 : null;
    }

    if (this.round > 0 && this.value) {
      this.value = Math.ceil(this.value / this.round) * this.round;
    }

    if (this.req && this.value === null) {
      this.value = 0;
    }
    
    this.changed();
    this.blur.emit(this.value);
  }



  // Implementation of ControlValueAccessor
  /**
  * Invoked when the model has been changed
  */
   onChange: (_: any) => void = (_: any) => {};

   /**
   * Invoked when the model has been touched
   */
   onTouched: () => void = () => {};
   /**
   * Method that is invoked on an update of a model.
   */
   updateChanges() {
    this.onChange(this.value);
   }
 
   ///////////////
   // OVERRIDES //
   ///////////////
 
   /**
   * Writes a new item to the element.
   * @param value the value
   */
   writeValue(value: number|null): void {
     // if variable is assigned, not initialized and required
     if (this.req && value === undefined) {
      value = 0;
    }
    
     this.value = value;
     this.updateChanges();
   }
 
   /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
   registerOnChange(fn: any): void {
     this.onChange = fn;
   }
 
   /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
   registerOnTouched(fn: any): void {
     this.onTouched = fn;
   }
}
