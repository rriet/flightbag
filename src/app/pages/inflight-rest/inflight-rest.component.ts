import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  selector: 'app-inflight-rest',
  templateUrl: './inflight-rest.component.html'
})
export class InflightRestComponent implements OnInit {

  constructor(
    public _flight:FlightService,
    public _prefs:PreferencesService,
  ) { }

  ngOnInit(): void {
  }

}
