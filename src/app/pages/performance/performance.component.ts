import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html'
})
export class PerformanceComponent implements OnInit {

  constructor(
    public _flight: FlightService,
  ) { }

  ngOnInit(): void {
  }

}
