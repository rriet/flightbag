import { Injectable, Input } from '@angular/core';
import { Prefs } from '../objects/preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor() { }

  prefs: Prefs = {
    nCrewP: 2,

    timeBeforeRest: 15,
    timeBetweenRest: 0,
    timeAfterRest: 60,
  }

  loadPrefs() {
    if (localStorage.getItem('preferences')) {
      this.prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
    }
  }

  savePrefs() {
    localStorage.setItem('preferences', JSON.stringify(this.prefs));
  }

  @Input()
  set timeBeforeRest(value: number | null) {
    value ? this.prefs.timeBeforeRest = value : this.prefs.timeBeforeRest = 0;
    this.savePrefs();
  }
  get timeBeforeRest(): number {
    return this.prefs.timeBeforeRest;
  }

  @Input()
  set timeBetweenRest(value: number | null) {
    value ? this.prefs.timeBetweenRest = value : this.prefs.timeBetweenRest = 0;
    this.savePrefs();
  }
  get timeBetweenRest(): number {
    return this.prefs.timeBetweenRest;
  }

  @Input()
  set timeAfterRest(value: number | null) {
    value ? this.prefs.timeAfterRest = value : this.prefs.timeAfterRest = 0;
    this.savePrefs();
  }
  get timeAfterRest(): number {
    return this.prefs.timeAfterRest;
  }
}
