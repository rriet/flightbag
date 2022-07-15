import { Injectable } from '@angular/core';
import { Airport } from '../objects/airport';
import { DangerousGood } from '../objects/dangerous-goods';
import { Flight } from '../objects/flight';
import { Rest } from '../objects/rest';
import { Waypoint } from '../objects/waypoint';
import { FlightCalculationService } from './flight-calculation.service';
import { PreferencesService } from './preferences.service';
import { roundCent, floorCent, ceilCent } from '../modules/math';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private _prefs: PreferencesService,
    private _fcalc: FlightCalculationService,
  ) { }

  flight: Flight = this.emptyFlight();


  emptyFlight(): Flight {
    this.flight = {
      number: '',
      callsign: '',
      etops: false,
      etopsChecked: false,
      mel: false,
      melChecked: false,
      tailNumber: '',
      type: '',
      from: { icao: '' },
      fromTimeZone: 0,
      to: { icao: '' },
      toTimeZone: 0,
      route: '',
      highestLevel: '',
      alternates: [],
      alternateList: '',
      waypoints: [],

      sunRiseSet: [],

      dateStandardDeparture: new Date().setHours(0, 0, 0, 0) / 60000 - new Date().getTimezoneOffset(),

      timeStd: 0,
      timeRevisedStd: null,
      timeAtd: null,
      timeTakeoff: null,
      timeSta: 0,
      timeLdg: null,
      timeAta: null,
      timeBlock: 0,
      timeTrip: 0,
      timeRevisedTrip: null,
      timeEnrouteDelay: 0,

      ezfw: 0,
      etow: 0,
      elwt: 0,
      mzfw: 0,
      mtow: 0,
      mlwt: 0,
      rzfw: null,
      fzfw: null,

      fuelPlusAdjustment: 0,
      fuelMinusAdjustment: 0,
      fuelTaxi: 0,
      fuelTaxiRevised: null,
      fuelTrip: 0,
      fuelTripRevised: null,
      fuelContigency: 0,
      fuelContigencyRevised: null,
      fuelAlternate: 0,
      fuelAlternateRevised: null,
      fuelFinal: 0,
      fuelFinalRevised: null,
      fuelMinReq: 0,
      fuelMinReqRevised: null,
      fuelRamp: 0,
      fuelRampRevised: null,
      fuelFinalRamp: null,
      fuelBefore: 0,
      fuelArrivalBeforeRefuel: null,
      fuelUpliftUnit: 'LTS',  // USG or LTS
      fuelUpliftVal: [0],
      fuelSg: 777,
      fuelDeparture: null,
      fuelArrivalAfterFlight: null,
      fuelEstimatedArrival: null,

      pob: null,

      depNotes: [''],
      selectedDepNote: 1,
      arrNotes: [''],
      selectedArrNote: 1,

      atisDepInfo: '',
      rwyDeparture: '',
      rwyIntercection: '',

      dispatchName: '',
      dispatchFreq: '',
      parkingStand: '',
      atisArrInfo: '',
      temperature: 15,
      restStart: null,
      restEnd: null,
      restType: '1,1',
      restReference: 'dep-arr',
      dgs: [],

      activePerformanceDisplay: 1,
      activeFlightDisplay: 1,

      prefToWind: null,
      perfToTemp: null,
      perfToQnh: null,
      perfToWeight: null,
      perfToMfrh: null,
      perfToFlaps: null,
      perfToRating: null,
      perfToAssumedTemp: null,
      perfToN1: null,
      perfToV1: null,
      perfToVr: null,
      perfToV2: null,
      perfToVref30: null,
      perfToEosid: null,
    };
    return this.flight;
  }

  clearFligh() {
    localStorage.removeItem('flight');
    this.flight = this.emptyFlight();
  }

  loadFlight() {
    if (localStorage.getItem('flight')) {
      this.flight = JSON.parse(localStorage.getItem('flight') || '');
    } else {
      this.flight = this.emptyFlight();
    }
  }

  saveFlight() {
    localStorage.setItem('flight', JSON.stringify(this.flight));
  }

  getFlightString(): string {
    return JSON.stringify(this.flight);
  }

  restore(flightJson: string) {
    localStorage.setItem('flight', flightJson);
    this.flight = JSON.parse(localStorage.getItem('flight') || '');
  }

  //#region FlightInfo

  set number(value: string) {
    this.flight.number = value;
    this.saveFlight();
  }
  get number(): string {
    return this.flight.number;
  }


  set callsign(value: string) {
    this.flight.callsign = value;
    this.saveFlight();
  }
  get callsign(): string {
    return this.flight.callsign;
  }


  set etops(value: boolean) {
    this.flight.etops = value;
    this.saveFlight();
  }
  get etops(): boolean {
    return this.flight.etops;
  }


  set etopsChecked(value: boolean) {
    this.flight.etopsChecked = value;
    this.saveFlight();
  }
  get etopsChecked(): boolean {
    return this.flight.etopsChecked;
  }


  set mel(value: boolean) {
    this.flight.mel = value;
    this.saveFlight();
  }
  get mel(): boolean {
    return this.flight.mel;
  }


  set melChecked(value: boolean) {
    this.flight.melChecked = value;
    this.saveFlight();
  }
  get melChecked(): boolean {
    return this.flight.melChecked;
  }


  set tailNumber(value: string) {
    this.flight.tailNumber = value;
    this.saveFlight();
  }
  get tailNumber(): string {
    return this.flight.tailNumber;
  }


  set type(value: string) {
    this.flight.type = value;
    this.saveFlight();
  }
  get type(): string {
    return this.flight.type;
  }

  get from(): string {
    return this.flight.from.icao + ' - ' + this.flight.from.iata;
  }

  get fromAirport(): Airport {
    return this.flight.from;
  }

  set fromAirportElevation(value: number | null) {
    value != null ? this.flight.from.elevation = value : this.flight.from.elevation = undefined;
    this.saveFlight();
  }
  get fromAirportElevation(): number {
    return this.flight.from.elevation ? this.flight.from.elevation : 0;
  }

  get fromTimeZone(): number {
    return this.flight.fromTimeZone;
  }

  get to(): string {
    return this.flight.to.icao + ' - ' + this.flight.to.iata;
  }

  get toAirport(): Airport {
    return this.flight.to;
  }


  get toTimeZone(): number {
    return this.flight.toTimeZone;
  }


  set route(value: string) {
    this.flight.route = value;
    this.saveFlight();
  }
  get route(): string {
    return this.flight.route;
  }

  set highestLevel(value: string) {
    this.flight.highestLevel = value;
    this.saveFlight();
  }
  get highestLevel(): string {
    return this.flight.highestLevel;
  }

  set alternates(value: Airport[]) {
    this.flight.alternates = value;
    this.saveFlight();
  }
  get alternates(): Airport[] {
    return this.flight.alternates;
  }


  set alternateList(value: string) {
    this.flight.alternateList = value;
    this.saveFlight();
  }
  get alternateList(): string {
    return this.flight.alternateList;
  }

  set waypoints(value: Waypoint[]) {
    this.flight.waypoints = value;
  }
  get waypoints(): Waypoint[] {
    return this.flight.waypoints;
  }

  get navPoints(): Waypoint[] {
    return this.flight.waypoints.filter(waypoint => {
      return waypoint.type === 'WPT' || waypoint.type === 'STA';
    });
  }

  get sunRiseSet(): { time: number, lat: number, lon: number, isDay: boolean }[] {
    return this.flight.sunRiseSet;
  }

  //#endregion

  //#region Date and Times

  // Return minutes from midnight UTC
  get timeOfDayMinUTC(): number {
    var date = new Date(new Date());
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }

  // Return departure date in Min from EPOCH UTC
  get dateStandardDeparture(): number {
    return this.flight.dateStandardDeparture;
  }

  // Return ACTUAL departure date in Min from EPOCH UTC
  // If ATD is not set, uses the time now to determine if the dep will be next day from Standard.
  get dateActualDeparture(): number {
    // Uses the ATD if exist, or NOW UTC
    let time = (this.timeAtd !== null) ? this.timeAtd : this.timeOfDayMinUTC;

    // if the time is less than 4 hours early.... it's next day
    if (time < this.timeStd - 4 * 60) {
      return this.dateStandardDeparture + (24 * 60);

      // if more than 20hs delay....  it's previous day.
    } else if (time > this.timeStd + 20 * 60) {
      return this.dateStandardDeparture - (24 * 60);
    } else {
      return this.dateStandardDeparture;
    }
  }

  // Return standard arrival date in Min from EPOCH UTC
  get dateStandardArrival(): number {
    return (this.timeStd < this.timeSta) ? this.flight.dateStandardDeparture : this.flight.dateStandardDeparture + (24 * 60);
  }

  // Return Arrival date in Min from EPOCH UTC
  get dateArrival(): number {
    if (this.timeArrival !== null && this.timeAtd != null) {
      // If arrival time less than departure time, arrival date is next day.
      if (this.timeArrival < this.timeAtd) {
        return this.dateStandardDeparture + (24 * 60);
      } else {
        return this.dateStandardDeparture;
      }
    }
    return this.dateStandardArrival;
  }

  // Return Arrival date in Min from EPOCH Local
  get dateArrivalLocal(): number | null {
    if (this.dateArrival !== null && this.timeEta !== null) {
      if (this.timeEta + this.toTimeZone < 0) {
        return this.dateArrival - (24 * 60);
      } if (this.timeEta + this.toTimeZone > (24 * 60)) {
        return this.dateArrival + (24 * 60);
      } else {
        return this.dateArrival;
      }
    }
    return null;
  }

  // Return STD form Flight Plan
  set timeStd(value: number | null) {
    this.flight.timeRevisedStd = value;
    this.saveFlight();
  }
  get timeStd(): number {
    return this.flight.timeRevisedStd !== null ? this.flight.timeRevisedStd : this.flight.timeStd;
  }

  // Return STD Local form Flight Plan
  get timeStdLocal(): number | null {
    return this.getLocalTime(this.timeStd, this.fromTimeZone)
  }

  // SET and Return ATD
  set timeAtd(value: number | null) {
    this.flight.timeAtd = value;
    this.saveFlight();
  }
  get timeAtd(): number | null {
    return this.flight.timeAtd;
  }

  // Returns true if NOW or ATD greater than STD....
  get isDepDelayed(): boolean {
    // Uses the ATD if exist, or NOW UTC
    let time = (this.timeAtd !== null) ? this.timeAtd : this.timeOfDayMinUTC;

    return time + this.dateActualDeparture > this.timeStd + this.dateStandardDeparture;
  }

  // tekes value from ATD or NOW and compares with STD.
  // Return the the number of minutes between times (Always positive)
  get timeDepDiff(): number {
    let time = (this.timeAtd !== null) ? this.timeAtd : this.timeOfDayMinUTC;
    return Math.abs((time + this.dateActualDeparture) - (this.timeStd + this.dateStandardDeparture));
  }

  // SET and Return Take-off time
  set timeTakeoff(value: number | null) {
    this.flight.timeTakeoff = value;

    let wasDay: boolean | null = null;

    let navPoints = this.navPoints;

    // Calculate Sunset/Sunrise
    if (value !== null) {

      this.flight.sunRiseSet = [];

      for (let i = 0; i < navPoints.length; i++) {
        let waypoint = navPoints[i];

        // if there is a coordinate for the waypoint
        if (waypoint.lat !== undefined && waypoint.lon !== undefined && waypoint.ctm !== undefined) {
          let time = waypoint.ctm + value;
          if (time > (24 * 60)) time = time - (24 * 60);

          let today = new Date();
          let jd = this._fcalc.calcJD(today.getFullYear(), today.getMonth() + 1, today.getDate());

          waypoint.isDay = this._fcalc.isDay(waypoint.lat, waypoint.lon, jd, time);

          // if DAY/NIGHT changes from the previous waypoint
          if (wasDay != waypoint.isDay) {
            // Fist time we do nothing
            if (wasDay !== null) {

              let prevWpt: Waypoint = navPoints[i - 1];

              // Calculate sunset between this waypoint and previous waypoint
              let sun = this._fcalc.getRiseSetTime((prevWpt.lat || 0), (prevWpt.lon || 0), ((prevWpt.ctm || 0) + (this.flight.timeTakeoff || 0)),
                waypoint.lat, waypoint.lon, ((waypoint.ctm || 0) + (this.flight.timeTakeoff || 0)), jd);

              if (sun) {
                this.flight.sunRiseSet.push(sun);
              }
            }
            wasDay = waypoint.isDay;
          }
        }
      }
    }

    this.saveFlight();
  }
  get timeTakeoff(): number | null {
    return this.flight.timeTakeoff;
  }

  // Recalculate STA....
  // This takes in consideration Revised STD when computing arrival delay
  get timeSta(): number {
    let sta = this.timeStd + this.timeBlock;
    return (sta < 24 * 60) ? sta : sta - 24 * 60;
  }

  // return true if there is a revised STD
  get revStd(): boolean {
    return this.flight.timeRevisedStd !== null;
  }

  // Set -> modify Trip time to get the desired ETA
  // Get ETA by adding trip time and take-off time
  set timeEta(value: number | null) {
    // If value and takeoff are not null, calculate Revised Trip Time
    this.timeTrip = this.subtractTimes(value, this.timeTakeoff);
  }
  get timeEta(): number | null {
    return this.addTimes(this.timeTakeoff, this.timeTrip);
  }

  set timeInflightEta(value: number | null) {
    //this.timeEnrouteDelay = this.subtractTimes(value, this.timeEta);

  }
  get timeInflightEta(): number | null {
    let eta = this.addTimes(this.timeEta, this.timeEnrouteDelay)
    return eta !== null ? (eta >= 0 ? eta : eta + 24 * 60) : null;
  }

  get timeInflightEtaLocal(): number | null {
    return this.getLocalTime(this.timeInflightEta, this.toTimeZone);
  }

  // Return ETA - 30 min (TOD)
  get timeTod(): number | null {
    return this.subtractTimes(this.timeEta, 30);
  }

  // Return ATA or ETA if ATA is null.
  get timeArrival(): number | null {
    return (this.timeAta !== null) ? this.timeAta : this.timeEta;
  }

  // get ETA Local
  get timeEtaLocal(): number | null {
    return this.getLocalTime(this.timeEta, this.toTimeZone)
  }

  // tekes value from ArrivalTime (ETA or ATA) and compares with STA.
  // Return the the number of minutes between times (Always positive)
  get timeArrDiff(): number | null {
    if (this.timeArrival) {
      return Math.abs((this.timeArrival + this.dateArrival) - (this.timeSta + this.dateStandardArrival));
    }
    return null;
  }

  // Return true if flight is delayed
  get isArrDelayed(): boolean {
    return (this.timeArrival && this.timeSta) ? this.timeArrival + this.dateArrival > this.timeSta + this.dateStandardArrival : false;
  }

  // Set and Get Actual Landing time
  set timeLdg(value: number | null) {
    this.flight.timeLdg = value;
    this.saveFlight();
  }
  get timeLdg(): number | null {
    return this.flight.timeLdg;
  }

  // Set and Get ATA
  set timeAta(value: number | null) {
    this.flight.timeAta = value;
    this.saveFlight();
  }
  get timeAta(): number | null {
    return this.flight.timeAta;
  }

  // Get Block time from Flight Plan
  get timeBlock(): number {
    return this.flight.timeBlock;
  }

  // Return calculated actual Block time
  get timeBlockActual(): number | null {
    return this.subtractTimes(this.flight.timeAta, this.flight.timeAtd);
  }

  // Set revised Trip Time
  // Get Trip time from Flight Plan OR Revised.
  set timeTrip(value: number | null) {
    this.flight.timeRevisedTrip = value;
    // this.calculateTimes();
    this.saveFlight();
  }
  get timeTrip(): number {
    // If revised trip time is set, return it, else return standard trip time
    return this.flight.timeRevisedTrip ? this.flight.timeRevisedTrip : this.flight.timeTrip;
  }

  // Get calculated actual Flight Time
  get timeFlightActual(): number | null {
    return this.subtractTimes(this.flight.timeLdg, this.flight.timeTakeoff);
  }

  // Get Flight Time from Flight Plan
  get timeFplTrip(): number | null {
    return this.flight.timeTrip;
  }

  // Get number of minutes since TakeOff (NOW with system clock)
  get timeFlightElapsed(): number | null {
    if (this.timeTakeoff !== null) {
      let elapsed = this.timeOfDayMinUTC - this.timeTakeoff;
      return elapsed >= 0 ? elapsed : elapsed + (24 * 60);
    }
    return null;
  }

  // number of minutes delay in the last waypoint entry (Positive = delay)
  set timeEnrouteDelay(value: number) {
    this.flight.timeEnrouteDelay = value;
    this.saveFlight();
  }
  get timeEnrouteDelay(): number {
    return this.flight.timeEnrouteDelay;
  }

  //#endregion

  //#region Fuel

  set fuelTaxi(value: number | null) {
    this.flight.fuelTaxiRevised = value;
    this.saveFlight();
  }
  get fuelTaxi(): number {
    return floorCent(this.flight.fuelTaxiRevised ? this.flight.fuelTaxiRevised : this.flight.fuelTaxi);
  }

  set fuelTrip(value: number | null) {
    this.flight.fuelTripRevised = value;
    this.saveFlight();
  }
  get fuelTrip(): number {
    return ceilCent(this.flight.fuelTripRevised ? this.flight.fuelTripRevised : this.flight.fuelTrip);
  }

  get fuelPlanRequired(): number {
    return ceilCent(this.flight.fuelFinal + this.flight.fuelAlternate);
  }

  get fuelPlanRemaining(): number {
    return ceilCent(this.flight.fuelFinal + this.flight.fuelAlternate + this.flight.fuelContigency);
  }

  get fuelContigency(): number {
    return ceilCent(this.flight.fuelContigency);
  }



  set fuelRamp(value: number | null) {
    this.flight.fuelRampRevised = value;
    this.saveFlight();
  }
  get fuelRamp(): number {
    return this.flight.fuelRampRevised ? this.flight.fuelRampRevised : this.flight.fuelRamp;
  }

  set fuelFinalRamp(value: number | null) {
    this.flight.fuelFinalRamp = value;
    this.saveFlight();
  }
  get fuelFinalRamp(): number {
    return this.flight.fuelFinalRamp !== null ? this.flight.fuelFinalRamp : this.flight.fuelRamp;
  }

  set fuelBefore(value: number | null) {
    this.flight.fuelBefore = value;
    this.saveFlight();
  }
  get fuelBefore(): number | null {
    return this.flight.fuelBefore;
  }

  set fuelArrivalBeforeRefuel(value: number | null) {
    this.flight.fuelArrivalBeforeRefuel = value;
    this.saveFlight();
  }
  get fuelArrivalBeforeRefuel(): number | null {
    return this.flight.fuelArrivalBeforeRefuel;
  }

  set fuelSg(value: number | null) {
    this.flight.fuelSg = value;
    this.saveFlight();
  }
  get fuelSg(): number | null {
    return this.flight.fuelSg;
  }

  get fuelReqUplift(): number | null {
    return this.flight.fuelBefore !== null ? this.fuelFinalRamp - this.flight.fuelBefore : null;
  }

  get fuelUsedOnGround(): number | null {
    return this.flight.fuelArrivalBeforeRefuel !== null && this.flight.fuelBefore !== null ? this.flight.fuelArrivalBeforeRefuel - this.flight.fuelBefore : null;
  }

  get fuelSgLgG(): string {
    return this.flight.fuelSg !== null ? String(Math.round((this.flight.fuelSg / 10) / 0.11982643) / 100).padEnd(4, '0') : '0.00';
  }

  get fuelMeteredUplift(): number | null {
    let uplift = this.flight.fuelUpliftVal.reduce(function (x, y) { return x = x + y });

    // convert Gallons to Liters if required
    if (this.flight.fuelUpliftUnit === 'USG') {
      uplift = Math.round(uplift / 0.2641720524);
    }

    return uplift;
  }


  set fuelUpliftUnit(value: string) {
    this.flight.fuelUpliftUnit = value;
    this.saveFlight();
  }
  get fuelUpliftUnit(): string {
    return this.flight.fuelUpliftUnit;
  }


  get fuelUplifts(): number[] {
    return this.flight.fuelUpliftVal;
  }


  set fuelDeparture(value: number | null) {
    this.flight.fuelDeparture = value;
    this.saveFlight();
  }
  get fuelDeparture(): number {
    return this.flight.fuelDeparture !== null ? this.flight.fuelDeparture : this.fuelFinalRamp;
  }


  get hasFuelDeparture(): boolean {
    return this.flight.fuelDeparture !== null
  }


  set fuelArrivalAfterFlight(value: number | null) {
    this.flight.fuelArrivalAfterFlight = value;
    this.saveFlight();
  }
  get fuelArrivalAfterFlight(): number | null {
    return this.flight.fuelArrivalAfterFlight;
  }

  get fuelUpliftKg(): number | null {
    return this.fuelMeteredUplift && this.fuelSg ? Math.round(this.fuelMeteredUplift * this.fuelSg / 1000) : null;
  }


  get fuelDiscrepancy(): number | null {
    return this.fuelUpliftKg !== null && this.fuelDeparture !== null &&
      this.flight.fuelArrivalBeforeRefuel !== null && this.fuelUsedOnGround !== null ?
      Math.round(this.fuelUpliftKg - (this.fuelDeparture - this.flight.fuelArrivalBeforeRefuel) - this.fuelUsedOnGround) : null
  }


  set fuelCrewExtra(value: number | null) {
    if (value != null && this.fuelFinalRamp != null) {
      this.flight.fuelFinalRamp = value + this.flight.fuelRamp
    }
    this.saveFlight();
  }
  get fuelCrewExtra(): number | null {
    return (this.fuelFinalRamp != null && this.fuelRamp != null) ? this.fuelFinalRamp - this.fuelRamp : null;
  }


  get fuelRefuelExtra(): number | null {
    return (this.fuelFinalRamp != null && this.fuelDeparture != null) ? this.fuelDeparture - this.fuelFinalRamp : null;
  }


  set fuelEstimatedArrival(value: number | null) {
    this.flight.fuelEstimatedArrival = value;
    this.saveFlight();
  }
  get fuelEstimatedArrival(): number {
    return this.flight.fuelEstimatedArrival ? this.flight.fuelEstimatedArrival : this.fuelDeparture - this.fuelTaxi - this.fuelTrip;
  }
  //#endregion

  //#region Weight

  // rzfw => revised
  set ezfw(value: number | null) {
    this.flight.rzfw = value;
    this.saveFlight();
  }
  get ezfw(): number {
    return this.flight.rzfw ? this.flight.rzfw : this.flight.ezfw;
  }

  set fzfw(value: number | null) {
    this.flight.fzfw = value;
    this.saveFlight();
  }
  get fzfw(): number {
    return this.flight.fzfw ? this.flight.fzfw : this.ezfw;
  }

  get etow(): number {
    return this.ezfw + this.fuelDeparture - this.fuelTaxi;
  }

  get tow(): number {
    return this.fzfw + this.fuelDeparture - this.fuelTaxi;
  }

  get elwt(): number {
    return this.fuelDeparture - this.fuelTaxi - this.fuelTrip + this.ezfw;
  }

  get lwt(): number {
    return this.fuelEstimatedArrival + this.fzfw;
  }


  set mzfw(value: number | null) {
    value ? this.flight.mzfw = value : '';
    this.saveFlight();
  }
  get mzfw(): number {
    return this.flight.mzfw;
  }


  set mtow(value: number | null) {
    value ? this.flight.mtow = value : '';
    this.saveFlight();
  }
  get mtow(): number {
    return this.flight.mtow;
  }


  set mlwt(value: number | null) {
    value ? this.flight.mlwt = value : '';
    this.saveFlight();
  }
  get mlwt(): number {
    return this.flight.mlwt;
  }


  get zfwMargin(): number {
    return this.mzfw - this.ezfw;
  }


  get towMargin(): number {
    return this.mtow - this.etow;
  }


  get ldwMargin(): number {
    return this.mlwt - this.elwt;
  }


  get limitingWeight(): string {
    if (this.zfwMargin < this.towMargin && this.zfwMargin < this.ldwMargin) {
      return "ZFW";
    } else if (this.towMargin < this.ldwMargin) {
      return "TOW";
    } else {
      return "LDW";
    }
  }

  //#endregion

  //#region Dangerous Goods

  get dgs(): DangerousGood[] {
    return this.flight.dgs;
  }
  addDgs(dg: DangerousGood) {
    this.flight.dgs.push(dg);
    this.saveFlight();
  }
  removeDg(dgIndex: number) {
    this.flight.dgs.splice(dgIndex, 1);
    this.saveFlight();
  }

  //#endregion

  //#region Notes

  set selectedDepNoteText(value: string) {
    this.flight.depNotes[this.flight.selectedDepNote - 1] = value;
    this.saveFlight();
  }
  get selectedDepNoteText(): string {

    return this.flight.depNotes[this.flight.selectedDepNote - 1];
  }


  get depNotesCount(): number {
    return this.flight.depNotes.length;
  }


  set currentDepNote(value: number) {
    this.flight.selectedDepNote = value;
    this.saveFlight();
  }
  get currentDepNote(): number {
    return this.flight.selectedDepNote;
  }

  removeDepNote() {
    if (this.flight.depNotes.length > 1) {
      this.flight.depNotes.splice(this.flight.selectedDepNote - 1, 1);
      this.flight.selectedDepNote = (this.flight.selectedDepNote > 1) ? this.flight.selectedDepNote - 1 : 1;
    }
  }

  addDepNote() {
    this.flight.depNotes.push('');
    this.flight.selectedDepNote = this.flight.depNotes.length;
  }


  set selectedArrNoteText(value: string) {
    this.flight.arrNotes[this.flight.selectedArrNote - 1] = value;
    this.saveFlight();
  }
  get selectedArrNoteText(): string {
    return this.flight.arrNotes[this.flight.selectedArrNote - 1];
  }


  get arrNotesCount(): number {
    return this.flight.arrNotes.length;
  }


  set currentArrNote(value: number) {
    this.flight.selectedArrNote = value;
    this.saveFlight();
  }
  get currentArrNote(): number {
    return this.flight.selectedArrNote;
  }

  removeArrNote() {
    if (this.flight.arrNotes.length > 1) {
      this.flight.arrNotes.splice(this.flight.selectedArrNote - 1, 1);
      this.flight.selectedArrNote = (this.flight.selectedArrNote > 1) ? this.flight.selectedArrNote - 1 : 1;
    }
  }

  addArrNote() {
    this.flight.arrNotes.push('');
    this.flight.selectedArrNote = this.flight.arrNotes.length;
  }
  //#endregion

  //#region POB, Crew, Dispatch Freq, ATIS, Parking

  set pob(value: number | null) {
    this.flight.pob = value;
    this.saveFlight();
  }
  get pob(): number | null {
    return this.flight.pob;
  }

  set atisDepInfo(value: string) {
    this.flight.atisDepInfo = value;
    this.saveFlight();
  }
  get atisDepInfo(): string {
    return this.flight.atisDepInfo;
  }


  set rwyDeparture(value: string) {
    this.flight.rwyDeparture = value;
    this.saveFlight();
  }
  get rwyDeparture(): string {
    return this.flight.rwyDeparture;
  }


  set rwyIntercection(value: string) {
    this.flight.rwyIntercection = value;
    this.saveFlight();
  }
  get rwyIntercection(): string {
    return this.flight.rwyIntercection;
  }


  set dispatchName(value: string) {
    this.flight.dispatchName = value;
    this.saveFlight();
  }
  get dispatchName(): string {
    return this.flight.dispatchName;
  }


  set dispatchFreq(value: string) {
    this.flight.dispatchFreq = value;
    this.saveFlight();
  }
  get dispatchFreq(): string {
    return this.flight.dispatchFreq;
  }


  set atisArrInfo(value: string) {
    this.flight.atisArrInfo = value;
    this.saveFlight();
  }
  get atisArrInfo(): string {
    return this.flight.atisArrInfo;
  }


  set temperature(value: number | null) {
    value ? this.flight.temperature = value : '';
    this.saveFlight();
  }
  get temperature(): number {
    return this.flight.temperature;
  }


  get temperatureF(): string {
    return String(Math.round(this.flight.temperature * 1.8 + 32));
  }


  set parkingStand(value: string) {
    this.flight.parkingStand = value;
    this.saveFlight();
  }
  get parkingStand(): string {
    return this.flight.parkingStand;
  }


  //#endregion

  //#region Rest Times

  set restStart(value: number | null) {
    this.flight.restStart = value;
    this.saveFlight();
  }
  get restStart(): number | null {
    if (this.restReference === 'start-end' && this.flight.restStart !== null) {
      return this.flight.restStart;
    }
    return this.addTimes(this.timeTakeoff, this._prefs.timeBeforeRest);
  }


  set restEnd(value: number | null) {
    this.flight.restEnd = value;
    this.saveFlight();
  }
  get restEnd(): number | null {
    if (this.restReference === 'start-end' && this.flight.restEnd !== null) {
      return this.flight.restEnd;
    }

    return this.subtractTimes(this.timeEta, this._prefs.timeAfterRest);
  }


  set restType(value: string) {
    this.flight.restType = value;
    this.saveFlight();
  }
  get restType(): string {
    return this.flight.restType;
  }


  set restReference(value: string) {
    this.flight.restReference = value;
    this.saveFlight();
  }
  get restReference(): string {
    return this.flight.restReference;
  }


  get rests(): Rest[] | null {
    let restList: Rest[] = []

    if (this.restStart !== null && this.restEnd !== null) {
      // split the rest array (e.x. "1,1,2,2" into a array of numbers 1 1 2 2)
      let restBlocks: number[] = this.restType.split(',').map(Number);

      // Numer of rest blocks
      let numberOfBrakes: number = restBlocks.length - 1;

      // Number of smallest rests
      // get the sum of all the numbers in the array (get number of R's) => 1R + 1R + 2R + 2R = 6
      let numberOf1R = restBlocks.reduce((sum, current) => sum + current, 0);

      // get the min time of rest ( 1R )
      let time1R: number = this.getRestTimeMin(numberOf1R, numberOfBrakes);

      let restStart = this.restStart ? this.restStart : 0;

      for (var i = 0; i < restBlocks.length; i++) {
        let crew: string;
        // Alternate Crew
        (i / 2 == Math.floor(i / 2)) ? crew = "B" : crew = "A";

        // Rest time in this block is the min time X the number of 1R
        let restTime = time1R * restBlocks[i];

        // The end of the rest is the start + restTime
        let restEnd = restStart + restTime;

        // Create new rest line
        let newRest: Rest = {
          number: i + 1,
          start: restStart,
          end: restEnd,
          time: restTime
        }

        // Next rest starts after the end of this + time between rests
        restStart = restEnd + this._prefs.prefs.timeBetweenRest;

        // Add rest to the array
        restList.push(newRest);
      }
    }
    return restList;
  }


  getRestTimeMin(numberOf1R: number, numberOfBrakes: number): number {
    // Time of total rest (end - start) minus time between rests.
    let totalRestTime: number = (this.restEnd || 0) - (this.restStart || 0) - (this._prefs.prefs.timeBetweenRest * numberOfBrakes);

    // If less than zero, add 24hs
    if (totalRestTime < 0) {
      totalRestTime = totalRestTime + (24 * 60);
    }
    return Math.floor(totalRestTime / numberOf1R);
  }

  //#endregion

  //#region General Calculations & Display Functions
  addTimes(first: number | null, second: number | null): number | null {
    if (first !== null && second !== null) {
      if (first + second < (24 * 60)) {
        return first + second;
      }
      return first + second - (24 * 60);
    }
    return null;
  }

  subtractTimes(first: number | null, second: number | null): number | null {
    if (first !== null && second !== null) {
      if (first < second) {
        first = first + (24 * 60);
      }
      return first - second;
    }
    return null;
  }

  getLocalTime(time: number | null, timeZone: number | null): number | null {
    if (time !== null && timeZone !== null) {
      let localTime = time + timeZone;
      if (localTime > (24 * 60)) {
        return localTime - (24 * 60);
      } else if (localTime < 0) {
        return localTime + (24 * 60);
      } else {
        return localTime;
      }
    }
    return null;
  }

  set activePerformanceDisplay(value: number) {
    this.flight.activePerformanceDisplay = value;
    this.saveFlight();
  }
  get activePerformanceDisplay(): number {
    return this.flight.activePerformanceDisplay;
  }

  set activeFlightDisplay(value: number) {
    this.flight.activeFlightDisplay = value;
    this.saveFlight();
  }
  get activeFlightDisplay(): number {
    return this.flight.activeFlightDisplay;
  }
  //#endregion

  //#region Performance Take-off

  set prefToWind(value: string | null) {
    this.flight.prefToWind = value;
    this.saveFlight();
  }
  get prefToWind(): string {
    return this.flight.prefToWind ? this.flight.prefToWind : '';
  }

  set perfToTemp(value: number | null) {
    this.flight.perfToTemp = value;
    this.saveFlight();
  }
  get perfToTemp(): number | null {
    return this.flight.perfToTemp;
  }

  set perfToQnh(value: number | null) {
    this.flight.perfToQnh = value;
    this.saveFlight();
  }
  get perfToQnh(): number | null {
    return this.flight.perfToQnh;
  }

  set perfToWeight(value: number | null) {
    this.flight.perfToWeight = value;
    this.saveFlight();
  }
  get perfToWeight(): number | null {
    return this.flight.perfToWeight;
  }

  set perfToMfrh(value: number | null) {
    this.flight.perfToMfrh = value;
    this.saveFlight();
  }
  get perfToMfrh(): number | null {
    return this.flight.perfToMfrh;
  }

  set perfToFlaps(value: number | null) {
    this.flight.perfToFlaps = value;
    this.saveFlight();
  }
  get perfToFlaps(): number | null {
    return this.flight.perfToFlaps;
  }

  set perfToRating(value: string | null) {
    this.flight.perfToRating = value;
    this.saveFlight();
  }
  get perfToRating(): string | null {
    return this.flight.perfToRating;
  }

  set perfToAssumedTemp(value: string | null) {
    this.flight.perfToAssumedTemp = value;
    this.saveFlight();
  }
  get perfToAssumedTemp(): string | null {
    return this.flight.perfToAssumedTemp;
  }

  set perfToN1(value: string | null) {
    this.flight.perfToN1 = value;
    this.saveFlight();
  }
  get perfToN1(): string | null {
    return this.flight.perfToN1;
  }

  set perfToV1(value: number | null) {
    this.flight.perfToV1 = value;
    this.saveFlight();
  }
  get perfToV1(): number | null {
    return this.flight.perfToV1;
  }

  set perfToVr(value: number | null) {
    this.flight.perfToVr = value;
    this.saveFlight();
  }
  get perfToVr(): number | null {
    return this.flight.perfToVr;
  }

  set perfToV2(value: number | null) {
    this.flight.perfToV2 = value;
    this.saveFlight();
  }
  get perfToV2(): number | null {
    return this.flight.perfToV2;
  }

  set perfToVref30(value: number | null) {
    this.flight.perfToVref30 = value;
    this.saveFlight();
  }
  get perfToVref30(): number | null {
    return this.flight.perfToVref30;
  }

  set perfToEosid(value: string | null) {
    this.flight.perfToEosid = value;
    this.saveFlight();
  }
  get perfToEosid(): string | null {
    return this.flight.perfToEosid;
  }
  //#endregion


}