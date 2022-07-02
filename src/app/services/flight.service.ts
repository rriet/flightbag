import { Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Airport } from '../objects/airport';
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
      mel: false,
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
      dateActualDeparture: null,

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
      fuelDeparture: 0,
      fuelArrivalAfterFlight: null,
      fuelEstimatedArrival: null,

      nCrew: this._prefs.prefs.nCrewP,
      nPax: 0,
      crew: [],

      depNotes: [''],
      selectedDepNote: 1,
      arrNotes: [''],
      selectedArrNote: 1,


      dispatchName: '',
      dispatchFreq: '',
      parkingStand: '',
      atisInfo: '',
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
  @Input()
  set number(value: string) {
    this.flight.number = value;
    this.saveFlight();
  }
  get number(): string {
    return this.flight.number;
  }

  @Input()
  set callsign(value: string) {
    this.flight.callsign = value;
    this.saveFlight();
  }
  get callsign(): string {
    return this.flight.callsign;
  }

  @Input()
  set etops(value: boolean) {
    this.flight.etops = value;
    this.saveFlight();
  }
  get etops(): boolean {
    return this.flight.etops;
  }

  @Input()
  set mel(value: boolean) {
    this.flight.mel = value;
    this.saveFlight();
  }
  get mel(): boolean {
    return this.flight.mel;
  }

  @Input()
  set tailNumber(value: string) {
    this.flight.tailNumber = value;
    this.saveFlight();
  }
  get tailNumber(): string {
    return this.flight.tailNumber;
  }

  @Input()
  set type(value: string) {
    this.flight.type = value;
    this.saveFlight();
  }
  get type(): string {
    return this.flight.type;
  }

  @Input()
  set from(value: string) {
    this.flight.from = value;
    this.saveFlight();
  }
  get from(): string {
    return this.flight.from;
  }

  @Input()
  get fromTimeZone(): number {
    return this.flight.fromTimeZone;
  }

  @Input()
  set to(value: string) {
    this.flight.to = value;
    this.saveFlight();
  }
  get to(): string {
    return this.flight.to;
  }

  @Input()
  get toTimeZone(): number {
    return this.flight.toTimeZone;
  }

  @Input()
  set route(value: string) {
    this.flight.route = value;
    this.saveFlight();
  }
  get route(): string {
    return this.flight.route;
  }

  @Input()
  set levels(value: string[]) {
    this.flight.levels = value;
    this.saveFlight();
  }
  get levels(): string[] {
    return this.flight.levels;
  }

  @Input()
  set highestLevel(value: string) {
    this.flight.highestLevel = value;
    this.saveFlight();
  }
  get highestLevel(): string {
    return this.flight.highestLevel;
  }

  @Input()
  set alternates(value: Airport[]) {
    this.flight.alternates = value;
    this.saveFlight();
  }
  get alternates(): Airport[] {
    return this.flight.alternates;
  }

  @Input()
  set alternateList(value: string) {
    this.flight.alternateList = value;
    this.saveFlight();
  }
  get alternateList(): string {
    return this.flight.alternateList;
  }

  @Input()
  set waypoints(value: Waypoint[]) {
    this.flight.waypoints = value;
    this.saveFlight();
  }
  get waypoints(): Waypoint[] {
    return this.flight.waypoints;
  }

  //#endregion

  //#region Date and Times
  @Input()
  set dateStandardDeparture(value: number) {
    this.flight.dateStandardDeparture = value;
    this.saveFlight();
  }
  get dateStandardDeparture(): number {
    return this.flight.dateStandardDeparture;
  }

  @Input()
  set dateActualDeparture(value: number | null) {
    this.flight.dateActualDeparture = value;
    this.saveFlight();
  }
  get dateActualDeparture(): number | null {
    return this.flight.dateActualDeparture;
  }

  @Input()
  get dateArrival(): number | null {
    if (this.timeEta !== null) {
      if (this.timeEta < this.timeStd) {
        return this.dateStandardDeparture + (24 * 60);
      } else {
        return this.dateStandardDeparture;
      }
    }
    return null;
  }

  @Input()
  get dateArrivalLocal(): number | null {
    if (this.dateArrival !== null && this.timeEta !== null) {
      if (this.timeEta + this.toTimeZone < 0) {
        return this.dateArrival - (24 * 60);
      } if (this.timeEta + this.toTimeZone < 0) {
        return this.dateArrival + (24 * 60);
      } else {
        return this.dateArrival;
      }
    }
    return null;
  }

  @Input()
  get timeStd(): number {
    return this.flight.timeStd;
  }

  @Input()
  get timeStdLocal(): number | null {
    return this.getLocalTime(this.timeStd, this.fromTimeZone)
  }

  @Input()
  set timeAtd(value: number | null) {
    this.flight.timeAtd = value;

    // 
    if (value != null && this.dateStandardDeparture != null && this.timeStd != null) {
      // if the time is less than 2 hours early.... it's next day
      if (value < this.timeStd - 2 * 60) {
        this.dateActualDeparture = this.dateStandardDeparture + (24 * 60);
      } else {
        this.dateActualDeparture = this.dateStandardDeparture;
      }

    } else {
      // if ATD OR STD are null....  set dateActualDeparture to Null
      this.dateActualDeparture = null;
    }

    this.saveFlight();
  }
  get timeAtd(): number | null {
    return this.flight.timeAtd;
  }

  // Reveives a time (min) and compares to STD
  // If early OR (value OR STD null) return true.
  // Input time is haead of Departure time if it's less AND if it's more than 2 hours less.
  isAheadOfTime(value: number | null): boolean {
    return (value && this.timeStd) ? value < this.timeStd && value > (this.timeStd - 2 * 60) : true;
  }

  @Input()
  set timeTakeoff(value: number | null) {
    this.flight.timeTakeoff = value;
    // this.calculateTimes();
    this.saveFlight();
  }
  get timeTakeoff(): number | null {
    return this.flight.timeTakeoff;
  }

  @Input()
  get timeTod(): number | null {
    return this.subtractTimes(this.timeEta, 30);
  }

  @Input()
  get timeSta(): number | null {
    return this.flight.timeSta;
  }

  @Input()
  set timeEta(value: number | null) {
    // If value and takeoff are not null, calculate Revised Trip Time
    this.timeTrip = this.subtractTimes(value, this.timeTakeoff);
  }
  get timeEta(): number | null {
    return this.addTimes(this.timeTakeoff, this.timeTrip);
  }

  @Input()
  get timeEtaLocal(): number | null {
    return this.getLocalTime(this.timeEta, this.toTimeZone)
  }

  @Input()
  get timeEtaDelay(): number | null {
    return (this.timeEta && this.timeSta) ? Math.abs(this.timeEta - this.timeSta) : null;
  }

  @Input()
  get isDelayedEta(): boolean {
    return (this.timeEta && this.timeSta) ? this.timeEta > this.timeSta : false;
  }

  @Input()
  set timeLdg(value: number | null) {
    this.flight.timeLdg = value;
    this.saveFlight();
  }
  get timeLdg(): number | null {
    return this.flight.timeLdg;
  }

  @Input()
  set timeAta(value: number | null) {
    this.flight.timeAta = value;
    this.saveFlight();
  }
  get timeAta(): number | null {
    return this.flight.timeAta;
  }

  @Input()
  set timeBlock(value: number | null) {
    this.flight.timeBlock = value;
    this.saveFlight();
  }
  get timeBlock(): number | null {
    return this.flight.timeBlock;
  }

  @Input()
  get timeBlockActual(): number | null {
    return this.subtractTimes(this.flight.timeAta, this.flight.timeAtd);
  }

  @Input()
  set timeTrip(value: number | null) {
    this.flight.timeRevisedTrip = value;
    // this.calculateTimes();
    this.saveFlight();
  }
  get timeTrip(): number | null {
    // If revised trip time is set, return it, else return standard trip time
    return this.flight.timeRevisedTrip ? this.flight.timeRevisedTrip : this.flight.timeTrip;
  }

  @Input()
  get timeFlightActual(): number | null {
    return this.subtractTimes(this.flight.timeLdg, this.flight.timeTakeoff);
  }

  @Input()
  get timeFplTrip(): number | null {
    // If revised trip time is set, return it, else return standard trip time
    return this.flight.timeTrip;
  }

  //#endregion

  //#region Fuel
  @Input()
  set fuelTaxi(value: number | null) {
    this.flight.fuelTaxiRevised = value;
    this.saveFlight();
  }
  get fuelTaxi(): number {
    return this.flight.fuelTaxiRevised ? this.flight.fuelTaxiRevised : this.flight.fuelTaxi;
  }

  @Input()
  set fuelTrip(value: number | null) {
    this.flight.fuelTripRevised = value;
    this.saveFlight();
  }
  get fuelTrip(): number {
    return this.flight.fuelTripRevised ? this.flight.fuelTripRevised : this.flight.fuelTrip;
  }

  @Input()
  set fuelContigency(value: number | null) {
    this.flight.fuelContigencyRevised = value;
    this.saveFlight();
  }
  get fuelContigency(): number {
    return this.flight.fuelContigencyRevised ? this.flight.fuelContigencyRevised : this.flight.fuelContigency;
  }



  @Input()
  set fuelAlternate(value: number | null) {
    this.flight.fuelAlternateRevised = value;
    this.saveFlight();
  }
  get fuelAlternate(): number {
    return this.flight.fuelAlternateRevised ? this.flight.fuelAlternateRevised : this.flight.fuelAlternate;
  }

  @Input()
  set fuelFinal(value: number | null) {
    this.flight.fuelFinalRamp = value;
    this.saveFlight();
  }
  get fuelFinal(): number {
    return this.flight.fuelFinalRamp ? this.flight.fuelFinalRamp : this.flight.fuelFinal;
  }

  @Input()
  set fuelMinReq(value: number | null) {
    this.flight.fuelMinReqRevised = value;
    this.saveFlight();
  }
  get fuelMinReq(): number {
    return this.flight.fuelMinReqRevised ? this.flight.fuelMinReqRevised : this.flight.fuelMinReq;
  }

  @Input()
  set fuelRamp(value: number | null) {
    this.flight.fuelRampRevised = value;
    this.saveFlight();
  }
  get fuelRamp(): number {
    return this.flight.fuelRampRevised ? this.flight.fuelRampRevised : this.flight.fuelRamp;
  }

  @Input()
  set fuelFinalRamp(value: number | null) {
    this.flight.fuelFinalRamp = value;
    this.saveFlight();
  }
  get fuelFinalRamp(): number {
    return this.flight.fuelFinalRamp !== null ? this.flight.fuelFinalRamp : this.flight.fuelRamp;
  }

  @Input()
  set fuelBefore(value: number | null) {
    this.flight.fuelBefore = value;
    this.saveFlight();
  }
  get fuelBefore(): number | null {
    return this.flight.fuelBefore;
  }

  @Input()
  set fuelArrivalBeforeRefuel(value: number | null) {
    this.flight.fuelArrivalBeforeRefuel = value;
    this.saveFlight();
  }
  get fuelArrivalBeforeRefuel(): number | null {
    return this.flight.fuelArrivalBeforeRefuel;
  }

  @Input()
  set fuelSg(value: number | null) {
    this.flight.fuelSg = value;
    this.saveFlight();
  }
  get fuelSg(): number | null {
    return this.flight.fuelSg;
  }

  @Input()
  get fuelReqUplift(): number | null {
    return this.flight.fuelBefore !== null ? this.fuelFinalRamp - this.flight.fuelBefore : null;
  }

  @Input()
  get fuelUsedOnGround(): number | null {
    return this.flight.fuelArrivalBeforeRefuel !== null && this.flight.fuelBefore !== null ? this.flight.fuelArrivalBeforeRefuel - this.flight.fuelBefore : null;
  }

  @Input()
  get fuelSgLgG(): string {
    return this.flight.fuelSg !== null ? String(Math.round((this.flight.fuelSg / 10) / 0.11982643) / 100).padEnd(4, '0') : '0.00';
  }

  @Input()
  get fuelMeteredUplift(): number | null {
    let uplift = this.flight.fuelUpliftVal.reduce(function (x, y) { return x = x + y });

    // convert Gallons to Liters if required
    if (this.flight.fuelUpliftUnit === 'USG') {
      uplift = Math.round(uplift / 0.2641720524);
    }

    return uplift;
  }

  @Input()
  set fuelUpliftUnit(value: string) {
    this.flight.fuelUpliftUnit = value;
    this.saveFlight();
  }
  get fuelUpliftUnit(): string {
    return this.flight.fuelUpliftUnit;
  }

  @Input()
  get fuelUplifts(): number[] {
    return this.flight.fuelUpliftVal;
  }

  @Input()
  set fuelDeparture(value: number | null) {
    this.flight.fuelDeparture = value;
    this.saveFlight();
  }
  get fuelDeparture(): number {
    return this.flight.fuelDeparture ? this.flight.fuelDeparture : this.fuelFinalRamp;
  }

  @Input()
  set fuelArrivalAfterFlight(value: number | null) {
    this.flight.fuelArrivalAfterFlight = value;
    this.saveFlight();
  }
  get fuelArrivalAfterFlight(): number | null {
    return this.flight.fuelArrivalAfterFlight;
  }

  @Input()
  get fuelUpliftKg(): number | null {
    return this.fuelMeteredUplift && this.fuelSg ? Math.round(this.fuelMeteredUplift * this.fuelSg / 1000) : null;
  }

  @Input()
  get fuelDiscrepancy(): number | null {
    return this.fuelUpliftKg && this.flight.fuelDeparture && this.flight.fuelArrivalBeforeRefuel && this.fuelUsedOnGround ?
      Math.round(this.fuelUpliftKg - (this.flight.fuelDeparture - this.flight.fuelArrivalBeforeRefuel) - this.fuelUsedOnGround) : null
  }

  @Input()
  set fuelCrewExtra(value: number | null) {
    if (value != null && this.fuelFinalRamp != null) {
      this.flight.fuelFinalRamp = value + this.flight.fuelRamp
    }
    this.saveFlight();
  }
  get fuelCrewExtra(): number | null {
    return (this.fuelFinalRamp != null && this.fuelRamp != null) ? this.fuelFinalRamp - this.fuelRamp : null;
  }

  @Input()
  get fuelRefuelExtra(): number | null {
    return (this.fuelFinalRamp != null && this.fuelDeparture != null) ? this.fuelDeparture - this.fuelFinalRamp : null;
  }

  @Input()
  set fuelEstimatedArrival(value: number | null) {
    this.flight.fuelEstimatedArrival = value;
    this.saveFlight();
  }
  get fuelEstimatedArrival(): number {
    return this.flight.fuelEstimatedArrival ? this.flight.fuelEstimatedArrival : this.fuelDeparture - this.fuelTaxi - this.fuelTrip;
  }
  //#endregion

  //#region Weight
  @Input()
  set ezfw(value: number | null) {
    this.flight.azfw = value;
    this.saveFlight();
  }
  get ezfw(): number {
    return this.flight.azfw ? this.flight.azfw : this.flight.ezfw;
  }

  @Input()
  get etow(): number {
    return this.fuelDeparture + this.ezfw - this.fuelTaxi;
  }

  @Input()
  get elwt(): number {
    return this.fuelEstimatedArrival + this.ezfw;
  }

  @Input()
  set mzfw(value: number | null) {
    value ? this.flight.mzfw = value : '';
    this.saveFlight();
  }
  get mzfw(): number {
    return this.flight.mzfw;
  }

  @Input()
  set mtow(value: number | null) {
    value ? this.flight.mtow = value : '';
    this.saveFlight();
  }
  get mtow(): number {
    return this.flight.mtow;
  }

  @Input()
  set mlwt(value: number | null) {
    value ? this.flight.mlwt = value : '';
    this.saveFlight();
  }
  get mlwt(): number {
    return this.flight.mlwt;
  }

  @Input()
  get zfwMargin(): number {
    return this.mzfw - this.ezfw;
  }

  @Input()
  get towMargin(): number {
    return this.mtow - this.etow;
  }

  @Input()
  get ldwMargin(): number {
    return this.mlwt - this.elwt;
  }

  @Input()
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
  @Input()
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
  @Input()
  set selectedDepNoteText(value: string) {
    this.flight.depNotes[this.flight.selectedDepNote - 1] = value;
    this.saveFlight();
  }
  get selectedDepNoteText(): string {

    return this.flight.depNotes[this.flight.selectedDepNote - 1];
  }

  @Input()
  get depNotesCount(): number {
    return this.flight.depNotes.length;
  }

  @Input()
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

  @Input()
  set selectedArrNoteText(value: string) {
    this.flight.arrNotes[this.flight.selectedArrNote - 1] = value;
    this.saveFlight();
  }
  get selectedArrNoteText(): string {
    return this.flight.arrNotes[this.flight.selectedArrNote - 1];
  }

  @Input()
  get arrNotesCount(): number {
    return this.flight.arrNotes.length;
  }

  @Input()
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

  //#region Dispatch Freq, ATIS, Parking
  @Input()
  set dispatchName(value: string) {
    this.flight.dispatchName = value;
    this.saveFlight();
  }
  get dispatchName(): string {
    return this.flight.dispatchName;
  }

  @Input()
  set dispatchFreq(value: string) {
    this.flight.dispatchFreq = value;
    this.saveFlight();
  }
  get dispatchFreq(): string {
    return this.flight.dispatchFreq;
  }

  @Input()
  set atisInfo(value: string) {
    this.flight.atisInfo = value;
    this.saveFlight();
  }
  get atisInfo(): string {
    return this.flight.atisInfo;
  }

  @Input()
  set temperature(value: number | null) {
    value ? this.flight.temperature = value : '';
    this.saveFlight();
  }
  get temperature(): number {
    return this.flight.temperature;
  }

  @Input()
  get temperatureF(): string {
    return String(Math.round(this.flight.temperature * 1.8 + 32));
  }

  @Input()
  set parkingStand(value: string) {
    this.flight.parkingStand = value;
    this.saveFlight();
  }
  get parkingStand(): string {
    return this.flight.parkingStand;
  }


  //#endregion

  //#region Rest Times
  @Input()
  set restStart(value: number | null) {
    this.flight.restStart = value;
    this.saveFlight();
  }
  get restStart(): number | null {
    if (this.restReference === 'start-end' && this.flight.restStart) {
      return this.flight.restStart;
    }
    if (this.timeTakeoff) {
      return this.timeTakeoff + this._prefs.timeBeforeRest;
    }
    return null;
  }

  @Input()
  set restEnd(value: number | null) {
    this.flight.restEnd = value;
    this.saveFlight();
  }
  get restEnd(): number | null {
    if (this.restReference === 'start-end' && this.flight.restEnd) {
      return this.flight.restEnd;
    }
    if (this.timeEta) {
      return (this.timeEta - this._prefs.timeAfterRest < 0) ? this.timeEta - this._prefs.timeAfterRest + (24 * 60) : this.timeEta - this._prefs.timeAfterRest;
    }
    return null;
  }

  @Input()
  set restType(value: string) {
    this.flight.restType = value;
    this.saveFlight();
  }
  get restType(): string {
    return this.flight.restType;
  }

  @Input()
  set restReference(value: string) {
    this.flight.restReference = value;
    this.saveFlight();
  }
  get restReference(): string {
    return this.flight.restReference;
  }

  @Input()
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

  @Input()
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
      if (localTime > (24*60)) {
        return localTime - (24*60);
      } else if(localTime < 0) {
        return localTime + (24*60);
      } else {
        return localTime;
      }
    }
    return null;
  }

  @Input()
  set activeDisplay(value: number) {
    value ? this.flight.activeDisplay = value : '';
    this.saveFlight();
  }
  get activeDisplay(): number {
    return this.flight.activeDisplay;
  }
  //#endregion
}