import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-approach',
  templateUrl: './approach.component.html'
})
export class ApproachComponent implements OnInit, OnDestroy {

  constructor(
    public _flight: FlightService,
    private _ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // start interval loop
    this.startTimer();
  }

  ngOnDestroy(): void {
    // stop interval loop
    clearInterval(this.interval)
  }

  // interval loop variable.
  interval!: ReturnType<typeof setInterval>;
  
  // Local time now at destination
  arrivalTimeNow: number = 0;

  startTimer() {
    //run outside angular to save memory
    this._ngZone.runOutsideAngular(() => {
      let timeNowEpoch = 0;
      this.interval = setInterval(() => {
        // Send new values to DOM
        this._ngZone.run(() => {
          var date = new Date(new Date());
          this.arrivalTimeNow = date.getUTCHours() * 60 + date.getUTCMinutes() + this._flight.toTimeZone;
        });
      }, 1000)
    });
  }
}
