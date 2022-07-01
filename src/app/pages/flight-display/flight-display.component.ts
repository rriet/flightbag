import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight-display',
  templateUrl: './flight-display.component.html',
})
export class FlightDisplayComponent implements OnInit {

  constructor(
    public _flight:FlightService,
  ) { }

  ngOnInit(): void {}
}
