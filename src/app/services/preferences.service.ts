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

    departurePaTemplate: DEP_PA,
    arrivalPaTemplate: ARR_PA,

    myname: '',
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

  @Input()
  set departurePaTemplate(value: string) {
    value === '' ? this.prefs.departurePaTemplate = DEP_PA : this.prefs.departurePaTemplate = value;
    this.savePrefs();
  }
  get departurePaTemplate(): string {
    return this.prefs.departurePaTemplate;
  }

  @Input()
  set arrivalPaTemplate(value: string) {
    value === '' ? this.prefs.arrivalPaTemplate = ARR_PA : this.prefs.arrivalPaTemplate = value;
    this.savePrefs();
  }
  get arrivalPaTemplate(): string {
    return this.prefs.arrivalPaTemplate;
  }

  @Input()
  set myname(value: string) {
    this.prefs.myname = value;
    this.savePrefs();
  }
  get myname(): string {
    return this.prefs.myname;
  }
}

export const DEP_PA: string = "Good [MORNING] ladies and gentlemen.\n\n" +
        "This is your Captain speaking. My name is [MYNAME]. On behalf of Qatar Airways and all the crew, " +
        "I would like to welcome you on board this Boeing 777, flight [NUMBER] to [DESTINATION].\n\n" +
        "Beside me here on the Flight Deck is [FDCREW]. And looking after your " +
        "safety and comfort in the cabin today are CSD / CS [CSDNAME], and our award - winning team.\n\n" +
        "Our flight time today is [DURATION], and we will be cruising at an altitude of [FL] feet." +
        "We’re expecting generally good weather en route. (However, we may experience some light " +
        "turbulence after departure / during the flight).\n\nFor your safety, please keep your seatbelt " +
        "fastened at all times – even when the seatbelt signs are switched off.\n\n" +
        "Before we begin our descent into [DESTINATION], I’ll update you with the latest weather " +
        "and arrival information.\n\nUntil then, please make yourself comfortable and enjoy our world - class service.\n\n" +
        "I wish you a very pleasant journey on board this Qatar Airways flight. Thank you.";

export const ARR_PA: string = "Good [MORNING] ladies and gentlemen. This is your Captain speaking.\n\n" +
        "We trust you’re having a pleasant flight with us today.\n\n" +
        "We’ll be starting our descent into [DESTINATION] shortly, and should be landing in [TIME_TO_GO] minutes, approximately [ETA_LOCAL].\n\n"+
        "It’s a [WEATHER] day today, with a temperature of [TEMPC] Celsius / [TEMPF] Fahrenheit.\n\n" +
        "The local time now is [TIME_NOW].\n\n" +
        "On behalf of all the crew, we wish you a very pleasant stay in [DESTINATION], or a smooth onward journey.\n\n" +
        "It’s been our pleasure having you on board today.\n\nThank you for choosing the award-winning Qatar Airways.";