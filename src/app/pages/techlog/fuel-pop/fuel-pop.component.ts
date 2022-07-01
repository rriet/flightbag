import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-fuel-pop',
  templateUrl: './fuel-pop.component.html'
})
export class FuelPopComponent implements OnInit {

  constructor(
    public _activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    public _flight: FlightService,
    private _clipboard: ClipboardService,
    public _toastService: ToastService,
  ) { }

  ngOnInit(): void {
    let fgArray: any[] = [];

    // For each fuel value uplifted in the flight, add a field
    this._flight.flight.fuelUpliftVal.forEach(fuelValue => {
      fgArray.push(this.addFuelGroup(fuelValue));
    });

    this.fuelFormGroup = this._fb.group({
      fuels: this._fb.array(fgArray)
    });
  }

  public fuelFormGroup!: FormGroup;

  setUnit(unit: string) {
    this._flight.fuelUpliftUnit = unit;
  }

  save() {
    if (this.fuelFormGroup.valid) {
      this._flight.flight.fuelUpliftVal = [];

      this.fuelFormGroup.value.fuels.forEach((fuel: { fuelAmount: number }) => {
        if (fuel.fuelAmount != undefined && fuel.fuelAmount != 0) {
          this._flight.flight.fuelUpliftVal.push(fuel.fuelAmount);
        }
      });
      this._flight.saveFlight();
    }
  }

  //Append Fields Set
  private addFuelGroup(fuelAmount: number = 0): FormGroup {
    return this._fb.group({
      fuelAmount: new FormControl(fuelAmount, {
        validators: [
          Validators.required,
          // Validators.min(1),
          Validators.max(600000)
        ],
        updateOn: 'change'
      })
    });
  }

  //Add Fields
  addFuel(): void {
    this.fuelArray.push(this.addFuelGroup());
  }

  //Remove Fields
  removeFuel(index: number): void {
    this.fuelArray.removeAt(index);
  }

  //Fields Array
  get fuelArray(): FormArray {
    return <FormArray>this.fuelFormGroup.get('fuels');
  }

  copyFuelValue(selectedValue: number | null) {
    this._toastService.show('Value copied to clipboard.', { classname: 'toast-mgs', delay: 2000 });
    this._clipboard.copy(String(selectedValue));
  }
}
