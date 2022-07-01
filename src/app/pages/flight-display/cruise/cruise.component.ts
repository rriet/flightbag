import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-cruise',
  templateUrl: './cruise.component.html'
})
export class CruiseComponent implements OnInit {

  constructor(
    public _flight:FlightService,
  ) { }

  ngOnInit(): void {
  }

}
