import { Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Airport } from '../objects/airport';
import { Crew } from '../objects/crew';
import { DangerousGood } from '../objects/dangerous-goods';
import { Flight } from '../objects/flight';
import { Rest } from '../objects/rest';
import { Waypoint } from '../objects/waypoint';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private _prefs: PreferencesService) { }

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
      from: '',
      fromTimeZone: 0,
      to: '',
      toTimeZone: 0,
      route: '',
      levels: [],
      highestLevel: '',
      alternates: [],
      alternateList: '',
      waypoints: [],

      dateStandardDeparture: new Date().setHours(0, 0, 0, 0) / 60000 - new Date().getTimezoneOffset(),

      timeStd: 0,
      timeAtd: null,
      timeTakeoff: null,
      timeSta: 0,
      timeLdg: null,
      timeAta: null,
      timeBlock: 0,
      timeTrip: 0,
      timeRevisedTrip: null,

      ezfw: 0,
      etow: 0,
      elwt: 0,
      mzfw: 0,
      mtow: 0,
      mlwt: 0,
      azfw: 0,

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
      fdCrew: 'Senior First Officer ...',
      csdName: '',

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
      activeDisplay: 1,
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

  
  set from(value: string) {
    this.flight.from = value;
    this.saveFlight();
  }
  get from(): string {
    return this.flight.from;
  }

  
  get fromTimeZone(): number {
    return this.flight.fromTimeZone;
  }

  
  set to(value: string) {
    this.flight.to = value;
    this.saveFlight();
  }
  get to(): string {
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

  
  set levels(value: string[]) {
    this.flight.levels = value;
    this.saveFlight();
  }
  get levels(): string[] {
    return this.flight.levels;
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
    this.saveFlight();
  }
  get waypoints(): Waypoint[] {
    return this.flight.waypoints;
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
  get timeStd(): number {
    return this.flight.timeStd;
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
    // this.calculateTimes();
    this.saveFlight();
  }
  get timeTakeoff(): number | null {
    return this.flight.timeTakeoff;
  }
  
  // Return STA from flight plan
  get timeSta(): number {
    return this.flight.timeSta;
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

  // Get number of minutes since TakeOff
  get timeFlightElapsed(): number | null {
    if (this.timeTakeoff !== null) {
      let elapsed = this.timeOfDayMinUTC - this.timeTakeoff;
      return elapsed >= 0 ? elapsed : elapsed + (24 * 60);
    }
    return null;
  }

  //#endregion

  //#region Fuel
  
  set fuelTaxi(value: number | null) {
    this.flight.fuelTaxiRevised = value;
    this.saveFlight();
  }
  get fuelTaxi(): number {
    return this.flight.fuelTaxiRevised ? this.flight.fuelTaxiRevised : this.flight.fuelTaxi;
  }

  
  set fuelTrip(value: number | null) {
    this.flight.fuelTripRevised = value;
    this.saveFlight();
  }
  get fuelTrip(): number {
    return this.flight.fuelTripRevised ? this.flight.fuelTripRevised : this.flight.fuelTrip;
  }

  
  set fuelContigency(value: number | null) {
    this.flight.fuelContigencyRevised = value;
    this.saveFlight();
  }
  get fuelContigency(): number {
    return this.flight.fuelContigencyRevised ? this.flight.fuelContigencyRevised : this.flight.fuelContigency;
  }



  
  set fuelAlternate(value: number | null) {
    this.flight.fuelAlternateRevised = value;
    this.saveFlight();
  }
  get fuelAlternate(): number {
    return this.flight.fuelAlternateRevised ? this.flight.fuelAlternateRevised : this.flight.fuelAlternate;
  }

  
  set fuelFinal(value: number | null) {
    this.flight.fuelFinalRamp = value;
    this.saveFlight();
  }
  get fuelFinal(): number {
    return this.flight.fuelFinalRamp ? this.flight.fuelFinalRamp : this.flight.fuelFinal;
  }

  
  set fuelMinReq(value: number | null) {
    this.flight.fuelMinReqRevised = value;
    this.saveFlight();
  }
  get fuelMinReq(): number {
    return this.flight.fuelMinReqRevised ? this.flight.fuelMinReqRevised : this.flight.fuelMinReq;
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
  
  set ezfw(value: number | null) {
    this.flight.azfw = value;
    this.saveFlight();
  }
  get ezfw(): number {
    return this.flight.azfw ? this.flight.azfw : this.flight.ezfw;
  }

  
  get etow(): number {
    return this.fuelDeparture + this.ezfw - this.fuelTaxi;
  }

  
  get elwt(): number {
    return this.fuelEstimatedArrival + this.ezfw;
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

  
  set fdCrew(value: string) {
    this.flight.fdCrew = value;
    this.saveFlight();
  }
  get fdCrew(): string {
    return this.flight.fdCrew;
  }

  
  set csdName(value: string) {
    this.flight.csdName = value;
    this.saveFlight();
  }
  get csdName(): string {
    return this.flight.csdName;
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

  
  set activeDisplay(value: number) {
    value ? this.flight.activeDisplay = value : '';
    this.saveFlight();
  }
  get activeDisplay(): number {
    return this.flight.activeDisplay;
  }
  //#endregion
}