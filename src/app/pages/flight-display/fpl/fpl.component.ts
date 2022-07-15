import { Component, OnInit } from '@angular/core';
import { Waypoint } from 'src/app/objects/waypoint';
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
    if (this._prefs.autoScrollFpl) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    // stop interval loop
    this.stopTimmer();
  }

  // interval loop variable.
  interval!: any;
  waypointName: string = '';

  // elapsed time to waypoint in minutes
  timeOverWaypoint(wpt: Waypoint): number | undefined {
    // actual miutes since departure.
    if (wpt.ata !== undefined && this._flight.timeTakeoff !== null) {
      let elapsed = wpt.ata - this._flight.timeTakeoff;
      return elapsed >= 0 ? elapsed : elapsed + (24 * 60);
    }
    return wpt.ctm ? wpt.ctm + this._flight.timeEnrouteDelay : undefined;
  }

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

  refresh(name: string) {
    // window.location.reload();

    // this.waypointName = name;
    // this.searchWaypoint();
    // this.waypointName = '';
  }

  pauseAutoScroll() {
    this.stopTimmer();
    this._prefs.autoScrollFpl = false;
  }

  scrollToWaypoint(): void {
    // Get elapsed time since take-off
    let timeElapsed = this._flight.timeFlightElapsed;

    // check if elapsed time exist.
    if (timeElapsed !== null) {
      // Reverse a temporary copy of the flight plan array
      let tempWpt = this._flight.waypoints.slice().reverse();

      // searh for the first (last) occurrence where the 
      // elapsed time is less than flight time now.
      let waypoint = tempWpt.find(waypoint => {
        if (timeElapsed !== null) {
          if (waypoint.ctm !== undefined && waypoint.ctm < timeElapsed) {
            return true;
          }
        }
        return false;
      })

      // if waypoint exists....
      if (waypoint !== undefined) {

        // Get the element ID of the waypont CTM
        const itemToScrollTo = document.getElementById(String(waypoint.ctm));
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
      let waypoint = this._flight.waypoints.find(waypoint => {
        return waypoint.name.toUpperCase() === this.waypointName.toUpperCase();
      });

      if (waypoint !== undefined) {
        const itemToScrollTo = document.getElementById(String(waypoint.ctm));
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
