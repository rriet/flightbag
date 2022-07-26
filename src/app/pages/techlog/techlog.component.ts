import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { NumberComponent } from '../components/number/number.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuelPopComponent } from './fuel-pop/fuel-pop.component';

@Component({
  selector: 'app-techlog',
  templateUrl: './techlog.component.html'
})
export class TechlogComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    private _modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  fuelUpliftKg!: number | null;

  copyValue(value: number | null , destination: NumberComponent) {
    if (destination.value === undefined || destination.value === null || destination.value === 0) {
      destination.value = value;
      destination.changed();
    }
  }

  showUpliftMenu() {
    this._modalService.open(FuelPopComponent, {
      scrollable: true,
    });
  }

}
