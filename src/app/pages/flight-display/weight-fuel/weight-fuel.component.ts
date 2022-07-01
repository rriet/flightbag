import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-weight-fuel',
  templateUrl: './weight-fuel.component.html'
})
export class WeightFuelComponent implements OnInit {

  constructor(
    public _flight:FlightService,
  ) { }

  ngOnInit(): void {}
}
