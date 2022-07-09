import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Waypoint } from 'src/app/objects/waypoint';
import { FlightService } from 'src/app/services/flight.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-cruise',
  templateUrl: './cruise.component.html'
})
export class CruiseComponent implements OnInit, OnDestroy {

  constructor(
    public _flight: FlightService,
    private _ngZone: NgZone,
    public _toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    // stop interval loop
    this.stopTimmer();
  }

  // interval loop variable.
  interval!: any;
  waypointName: string = '';

  showWaypoint(waypoint: Waypoint) {

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
    } else {
      this.stopTimmer();
    }
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
      } else {
        this._toastService.show('Waypoint not found!', { classname: 'toast-wrn toast-mgs', delay: 3000 });
      }
    }
  }
}
