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
    // If ATD is set, Calculate final delay // else set timer to keep track of delay
    if (this._flight.timeAtd !== null) {
      this.calculateFinalDelay();

      // only sets new interval if previous was undefined
    } else {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    // stop interval loop
    clearInterval(this.interval)
  }

  // interval loop variable.
  interval!:ReturnType<typeof setInterval>;
  depDelay:number = 0;
  delayed:boolean = false;
  depDelayAlert:boolean = false;
  blockTripTimeWarning:boolean = false;

  startTimer() {
    // clear interval if running, before start a new one
    clearInterval(this.interval);

    //run outside angular to save memory
    this._ngZone.runOutsideAngular(()=>{
      let timeNowEpoch = 0;
      this.interval = setInterval(()=>{
        let newNowEpoch =  this.getMinNow();
        
        // only once a minute, we update the DOM
        if (newNowEpoch != timeNowEpoch) {
          timeNowEpoch = newNowEpoch

          // Send new values to DOM
          this._ngZone.run(()=>{
            this.calculateDelay(newNowEpoch);
          });
        }
      },1000)
    });
  }

  // get epoch now (minutes)
  getMinNow():number {
    return  Math.floor(new Date().getTime() / 60 / 1000);
  }

  // receives EPOCH minutes now and updates delay and label
  calculateDelay(timeNow:number = this.getMinNow()){
    // stdEPOCH minutes
    let stdEpoch = this._flight.dateStandardDeparture + this._flight.timeStd;

    // minutes from midnight today
    let newDelay = Math.floor((stdEpoch - timeNow));

    if (newDelay >= 0) {
      this.depDelay = newDelay;
      this.delayed = false;
    } else {
      this.depDelay = newDelay * -1;
      this.delayed = true;
    }
  }

  // After ATD is set, calculate delay based on ATD
  calculateFinalDelay() {

    // Standard departure time
    let stdEpoch = this._flight.dateStandardDeparture + this._flight.flight.timeStd;

    let atdEpoch = this._flight.dateStandardDeparture + (this._flight.flight.timeAtd || 0);

    // Since we don't have the departure date....
    // if the Actual departure Epoch is less than the estimates, we assume the flight departed next day
    if (atdEpoch < stdEpoch - 4 * 60) {
      // Add 24hs
      atdEpoch += 24 * 60;
    }
    
    this.calculateDelay(atdEpoch);
  }


}
