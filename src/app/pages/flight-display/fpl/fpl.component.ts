import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-fpl',
  templateUrl: './fpl.component.html'
})
export class FplComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    public _toastService: ToastService,
    private _prefs: PreferencesService,
  ) { }

  ngOnInit(): void {
    this.restartTimer();
  }

  ngOnDestroy(): void {
    // stop interval loop
    this.stopTimmer();
  }

  // interval loop variable.
  interval!: any;
  waypointName: string = '';

  startTimer() {
    this.interval = window.setInterval(() => {
      this.scrollToWaypoint();
    }, 1000);
  }

  stopTimmer() {
    window.clearInterval(this.interval);
    this.interval = null;
  }

  toggleInterval() {
    if (!this.interval) {
      this.startTimer();
      this._prefs.autoScrollFpl = true;
    } else {
      this.stopTimmer();
      this._prefs.autoScrollFpl = false;
    }
  }

  restartTimer() {
    if (this._prefs.autoScrollFpl) {
      this.startTimer();
    }
  }

  scrollToWaypoint(): void {
    // Get elapsed time since take-off
    let timeElapsed = (this._flight.timeFlightElapsed || 0) - this._flight.timeEnrouteDelay;

    // check if elapsed time exist.
    if (timeElapsed !== null) {

      // searh for the first (last) occurrence where the 
      // elapsed time is less than flight time now.
      let wptId = this._flight.waypoints.findIndex(waypoint => {

        if (waypoint.ctm !== undefined && waypoint.ctm >= timeElapsed) {
          return true;
        }
        return false;
      })

      // if waypoint exists....
      if (wptId !== undefined) {

        // Get the element ID of the waypont CTM
        const itemToScrollTo = document.getElementById('wptId' + String(wptId - 1));
        if (itemToScrollTo) {
          // Scroll to element
          itemToScrollTo.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
      }
    }
  }

  searchWaypoint() {
    if (this.waypointName.length > 1) {
      this.stopTimmer();
      let wptId = this._flight.waypoints.findIndex(waypoint => {
        return waypoint.name.toUpperCase() === this.waypointName.toUpperCase();
      });

      if (wptId !== undefined) {
        const itemToScrollTo = document.getElementById('wptId' + String(wptId));
        if (itemToScrollTo) {
          // Scroll to element
          itemToScrollTo.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
        this.waypointName = '';
      } else {
        this._toastService.show('Waypoint not found!', { classname: 'toast-wrn toast-mgs', delay: 3000 });
      }
    }
  }

}
