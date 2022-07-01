import { Component, Input, OnInit } from '@angular/core';
import { Waypoint } from 'src/app/objects/waypoint';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html'
})
export class WaypointComponent implements OnInit {

  constructor(
    public _flight:FlightService,
  ) { }

  ngOnInit(): void {
  }

  @Input() waypoint: Waypoint = {name:''};

  name():string { 
    if(this.waypoint.name.length == 11) {
      return this.waypoint.name.substring(0,3)+this.waypoint.name.substring(5,9)
    }
    return this.waypoint.name
  }

  time():number|null {
    if (this.waypoint.ctm && this._flight.timeTakeoff !== null) {
      return this.waypoint.ctm + this._flight.timeTakeoff;
    }
    return null;
  }
  // ata:number

}
