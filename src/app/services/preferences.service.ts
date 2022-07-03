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

// Good morning / afternoon / evening ladies and gentlemen.
// This is your Captain speaking. My name is [NAME]. On behalf of Qatar Airways and all the crew, I would like to welcome you on board this [TYPE], flight QR [NUMBER] to [DESTINATION].
// Beside me here on the Flight Deck is (Senior) First Officer [NAME]. And looking after your safety and comfort in the cabin today are CSD / CS Mr / Ms [NAME], and our award-winning team.
// Our flight time today is [DURATION], and we will be cruising at an altitude of [NUMBER] feet.
// We’re expecting generally good weather en route. (However, we may experience some light turbulence after departure / during the flight). For your safety, please keep your seatbelt fastened at all times – even when the seatbelt signs are switched off.
// Before we begin our descent into [DESTINATION], I’ll update you with the latest weather and arrival information. Until then, please make yourself comfortable and enjoy our world-class service.
// I wish you a very pleasant journey on board this Qatar Airways flight. Thank you.
