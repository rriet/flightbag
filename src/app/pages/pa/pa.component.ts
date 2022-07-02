import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-pa',
  templateUrl: './pa.component.html'
})
export class PaComponent implements OnInit {

  constructor(
    public _flight:FlightService,
  ) { }

  ngOnInit(): void {
  }

}
