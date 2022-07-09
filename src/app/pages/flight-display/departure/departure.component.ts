import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html'
})
export class DepartureComponent implements OnInit, OnDestroy {

  constructor(
    public _flight:FlightService,
    private _ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // if ATD not set, start loop to update Delay
    if (this._flight.timeAtd === null) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    // stop interval loop
    clearInterval(this.interval);
  }

  // interval loop variable.
  interval!:ReturnType<typeof setInterval>;
  
  startTimer() {
    // clear interval if running, before start a new one
    clearInterval(this.interval);

    //run outside angular to save memory
    this._ngZone.runOutsideAngular(()=>{
      this.interval = setInterval(()=>{
        this._ngZone.run(()=>{
          // Do nothing, but forces Angular to refresh the screen and get new values.
        });
      },1000)
    });
  }

  atdChanged() {
    clearInterval(this.interval);
    if (this._flight.timeAtd === null) {
      this.startTimer();
    }
  }
}
