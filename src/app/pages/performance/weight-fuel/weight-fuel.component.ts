import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-weight-fuel',
  templateUrl: './weight-fuel.component.html'
})
export class WeightFuelComponent implements OnInit {

  constructor(
    public _flight: FlightService,
  ) { }

  ngOnInit(): void { }

  zfwMarginLabel(): string {
    return this._flight.limitingWeight === 'ZFW' ? 'ZFW Diff (L)' : 'ZFW Diff';
  }

  towMarginLabel(): string {
    return this._flight.limitingWeight === 'TOW' ? 'TOW Diff (L)' : 'TOW Diff';
  }

  ldgMarginLabel(): string {
    return this._flight.limitingWeight === 'LDW' ? 'LDW Diff (L)' : 'LDW Diff';
  }
}
