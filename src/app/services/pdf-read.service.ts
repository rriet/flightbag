import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist'; // <-- installation (npm i pdfjs-dist)
import { ceilCent, floorCent } from '../modules/math';
import { Airport } from '../objects/airport';
import { AirportService } from './airport.service';
import { FlightCalculationService } from './flight-calculation.service';
import { FlightService } from './flight.service';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class PdfReadService {

  constructor(
    private _flight: FlightService,
    private _airport: AirportService,
    public _toastService: ToastService,
    private _fcalc: FlightCalculationService,
  ) { }

  readPdf(e: any) {
    //Step 4:turn array buffer into typed array
    var typedarray = new Uint8Array(e.target.result);

    pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.js';
    //Step 5:pdfjs should be able to read this
    const loadingTask = pdfjsLib.getDocument(typedarray);

    loadingTask.promise.then(async pdf => {

      var totalPages = pdf.numPages;

      let pagesArray: string[] = [];

      if (totalPages > 7) {

        for (let i = 1; i <= totalPages; i++) {
          await this.getPageText(i, pdf).then((textPage) => {
            pagesArray.push(textPage);

          });
        }

        // check fist page is correct
        if (pagesArray[0].includes('FLIGHT DISPATCH RELEASE')) {

          // empty current flight
          this._flight.clearFligh();

          // extract all pages
          this.extractFlightInfo(pagesArray);
        }
      }

    });
  }

  extractFlightInfo(pages: string[]) {

    // Page control....
    let dispatchReleaseFinished: boolean = false;
    let firstPageFinished: boolean = false;
    let fplFinished: boolean = false;
    let windsPage: boolean = false;
    let weatherPage: boolean = false;

    // Avoid inserting the FlightPlan to alternate
    // Time from TO to Waypoint. If next Waypont is less, it's the plan to alternate
    let timeToWpt = 0;

    // Flight Levels Position and Level
    let flightLevels: { position: string, level: string }[] = [];
    let currentFL: string = '';

    let alts: Airport[] = [];

    // Flight PLANNED ON TRACK
    let natTrakLetter: string = '';
    let natEntry: string = '';
    let natExit: string = '';

    pages.forEach(page => {

      // Remove double spaces
      page = page.replace(/ {2,}/g, ' ');

      // console.log(page)

      if (!dispatchReleaseFinished) {

        // looking for 1TON MIN FUEL P475 /M452
        let fuelAdjustments: string = (page.match(/1TON MIN FUEL P[0-9]{1,4} \/M[0-9]{1,4}/g) || [''])[0];

        this._flight.flight.fuelPlusAdjustment = Number(fuelAdjustments.substring(fuelAdjustments.indexOf('P') + 1, fuelAdjustments.indexOf('/')));
        this._flight.flight.fuelMinusAdjustment = Number(fuelAdjustments.slice(fuelAdjustments.indexOf('/M') + 2));

        // Finish extracting Dispatch Release
        dispatchReleaseFinished = true;
      }

      // read first page and return
      if (!firstPageFinished && dispatchReleaseFinished && page.includes('PAGE 1/')) {

        // locate and retrive flight number/callsign
        //QTR07V/QR245
        let numberCall = page.match(/QTR[A-Z0-9]{1,4}\/QR\d{1,4}/g) || [];

        let numberCallArray = numberCall[0].split('/')

        // split flight number and callsign
        this._flight.flight.callsign = numberCallArray[0].substring(3, numberCallArray[0].length);
        this._flight.flight.number = numberCallArray[1];

        // locate date
        let month = (page.match(/[0-9]{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC){1}/g) || [])[0].substring(2);

        // new plan date format 'STD 29/0455 T/O........'

        let dayDep = (page.match(/STD [0-9]{2}\/[0-9]{4}/g) || [''])[0].slice(4, -5);

        this._flight.flight.dateStandardDeparture = new Date(Date.parse(month + " " + dayDep + ", " + new Date().getFullYear() + ' 00:00:00 GMT')).getTime() / 60000;

        // Matches P0100 and M1000 time format
        let timeZones = page.match(/(P|M){1}[0-9]{4}/g) || [];

        // Get and convert time zones
        this._flight.flight.fromTimeZone = this.timezoneToInt(timeZones[0]);
        this._flight.flight.toTimeZone = this.timezoneToInt(timeZones[1]);

        // Airports are the first occurrence of XXXX/XXXX
        let depArrAirp = (page.match(/[A-Z]{4}\/[A-Z]{4}/g) || [])[0].split('/');

        // TODO: Search airport info and select airport.....
        this._flight.flight.from = this._airport.findAirportIcao(depArrAirp[0]);
        this._flight.flight.to = this._airport.findAirportIcao(depArrAirp[1]);

        // Get aircraft type
        this._flight.flight.type = (page.match(/(A3|B7){1}[0-9A-Z]{2}/g) || [])[0];

        // Get Tail Number
        this._flight.flight.tailNumber = (page.match(/(A7){1}[A-Z]{3}/g) || [])[0];

        // Check if it's ETOPS
        this._flight.flight.etops = page.includes('ETOPS:');

        // check if has MEL/CDL
        this._flight.flight.mel = page.includes('MEL/CDL');

        // Get Route
        // Locate the SECOND occurance of the departure airport (after 120 chars shoud be enogh)
        let dep1 = page.indexOf(this._flight.fromAirport.icao, 120);
        let dep2 = page.indexOf(' ', dep1 + 5); // remove the runway identification "OTHH 34R " (get location of firs space after the ICAO + ' ')

        // runway is between DEP1 and DEP2
        this._flight.rwyDeparture = page.substring(dep1 + 5, dep2);

        let arr2 = page.indexOf(this._flight.toAirport.icao, 120);
        this._flight.flight.route = page.substring(dep2, arr2);

        let randomSegment = (this._flight.flight.route.match(new RegExp('[ ][A-Z]{5}[ ][A-Z][ ][A-Z]{5}[ ]')) || [''])[0];

        if (randomSegment !== '') {
          natEntry = randomSegment.split(' ')[1];
          natTrakLetter = randomSegment.split(' ')[2];
          natExit = randomSegment.split(' ')[3];
        }

        // Get Levels
        let allLevels = (page.match(/([A-Z0-9]{1,11}\/)?(FL){1}[0-9]{3}/g) || ['']);

        flightLevels.push({ position: '', level: allLevels[0].replace('FL', '') });

        // initially the highest FL is the initial FL
        this._flight.flight.highestLevel = allLevels[0];
        let highestLevel: number = Number((allLevels[0].match(/FL[0-9]{3}/g) || [''])[0].replace('FL', ''));

        // Add All FLs to ARRAY and get the highest
        for (let i = 1; i < allLevels.length; i++) {

          let level = allLevels[i].split('/')
          flightLevels.push({ position: level[0], level: level[1].replace('FL', '') });

          let thisLevel: number = Number((allLevels[i].match(/FL[0-9]{3}/g) || [''])[0].replace('FL', ''));

          // Get highest FL
          if (highestLevel < thisLevel) {
            highestLevel = thisLevel;
            this._flight.flight.highestLevel = "FL" + String(thisLevel);
          }
        }

        // // get GND DIST
        // this._flight.flight.groundDistance = this.getValue(page, 'GND DIST');

        // Get Taxi fuel
        this._flight.flight.fuelTaxi = floorCent(this.getValue(page, 'TAXI'));

        // Get Trip fuel
        this._flight.flight.fuelTrip = floorCent(this.getValue(page, 'TRIP'));

        // Get Contingency Fuel
        this._flight.flight.fuelContigency = this.getValue(page.replace('3P/C', '').replace('5P/C', '').replace('20MIN', ''), 'CONT');

        // Get Alternate fuel
        this._flight.flight.fuelAlternate = this.getValue(page, 'ALTN');

        // Get Final fuel
        this._flight.flight.fuelFinal = this.getValue(page.replace('I/R', ''), 'FINL');

        // Get Min fuel Required
        this._flight.flight.fuelMinReq = ceilCent(this.getValue(page, 'MIN FUEL REQ'));

        // Get Ramp fuel ROUNDED UP
        this._flight.flight.fuelRamp = ceilCent(this.getValue(page, 'RAMP FUEL'));

        /////  Weights ////
        this._flight.flight.mzfw = this.getValue(page, 'MZFW');
        this._flight.flight.ezfw = this.getValue(page, 'EZFW');
        this._flight.flight.mtow = this.getValue(page, 'MTOW');
        this._flight.flight.etow = this.getValue(page, 'ETOW');
        this._flight.flight.mlwt = this.getValue(page, 'MLWT');
        this._flight.flight.elwt = this.getValue(page, 'ELWT');

        ////  Times ////
        this._flight.flight.timeStd = this.getTimes(page, 'STD') || 0;
        this._flight.flight.timeRevisedStd = this.getTimes(page, 'ETD/CTOT');
        this._flight.flight.timeBlock = this.getTimes(page, 'BLK') || 0;
        this._flight.flight.timeTrip = this.getTimes(page, 'TRIP') || 0;
        this._flight.flight.timeSta = this.getTimes(page, 'STA') || 0;

        // If Revised STD less than STD, depature next day....
        if (this._flight.flight.timeRevisedStd !== null && this._flight.flight.timeRevisedStd < this._flight.flight.timeStd) {
          this._flight.flight.dateStandardDeparture = this._flight.flight.dateStandardDeparture + (24 * 60)
        }

        // END OF First Page
        firstPageFinished = true;
        return;
      }

      // after finishin the first page and before the wind page
      // Looking for the main FPL
      if (!fplFinished && firstPageFinished) {

        if (this._flight.fuelPlanRemaining === 0 && page.includes('PLAN REM')) {
          this._flight.fuelPlanRemaining = this.getValue(page, 'PLAN REM') * 1000;
          this._flight.fuelPlanRequired = this.getValue(page, 'PLAN REQ') * 1000;
        }

        // looking for patterns
        // SOKEN 037 10 331 0004 .... .... 121.2 LAGSA 009 61 0.829 503 / 509 114 0031 .... .... 114.1 
        // UT430 342 CLB 121 / 010 P18 7 .... ....N6000W11500 190 317 527 / 476 1155 .... .... 17.9 
        // SAV 408.00 354 7 0.830 517 / 507 107 0118 .... .... 105.9 DEMBO 037 7 0006 .... .... 120.4 
        // LAGSA 009 61 0.829 503 / 509 114 0031 .... .... 114.1 KAPIP 000 21 334 446 / 480 0017 .... .... 117.2 
        // UT430 003 CLB 111 / 012 P19 3 .... ....
        // PEGET 000 11 481 / 480 0020 .... .... 116.4 UT430 003 CLB 104 / 012 P19 1 .... ....
        // MIXEM 000 78 323 475 / 509 93 0021 .... .... 116.1
        // LAGSA 009 61 0.829 503 / 509 114 0031 .... .... 114.1 UT430 342 CLB 121 / 010 P18 7 .... ....
        // SYZ 117.80 338 12 512 / 509 130 0038 .... .... 112.9 UP574 300 130 / 011 P18 1 .... ....
        // TOC 58 0.831 512 / 507 130 0039 .... .... 112.5 UP574 341 132 / 007 P18 7 .... ....
        // ASNIT 338 46 516 / 507 142 0046 .... .... 111.4
        let waypoints = page.match(/((ENTRY)[0-9]|(ETP\([0-9A-Z]{1,4}\))|(EXIT)[0-9]|[A-Z]{3,5}|([NS]{1}[0-9]{4}[EW][0-9]{5}))[ ][0-9 .\/]+[.]{4}[ ][0-9]{1,4}[.][0-9]{1}/g) || [];

        // ((ENTRY)[0-9]|(ETP\([0-9]D\))|(EXIT)[0-9]|[A-Z]{3,5}|([NS]{1}[0-9]{4}[EW][0-9]{5}))[ ][0-9 .\/]+[.]{4}[ ][0-9]{1,4}[.][0-9]{1}

        // Get the first flight level
        if (currentFL === '') currentFL = flightLevels[0].level;

        // for each waypoint in the page
        waypoints.forEach(waypoint => {

          // Waypoint NAME = All chars untill SPACE
          let waypointName = waypoint.substring(0, waypoint.indexOf(' '));

          // Look for the pattern "HHMM .... .... NNN.N" => Than split the result in the ' .... .... '
          let timeFuel = (waypoint.match(/[0-9]{4}( .... .... )[0-9]{1,4}.[0-9]{1}/g) || [''])[0].split(' .... .... ');

          // The fist result is the time....
          let ctm = this.timeToInt(timeFuel[0]);

          // The second is the fuel required!
          let fuelReq = timeFuel[1];

          // To avoid inserting the FPL to alternate
          // Check if time is greater than previous WPT
          if (ctm >= timeToWpt) {
            timeToWpt = ctm;

            // Will hold the VOR/ADF frequency, when available.
            let stationFreq = '';

            let waypointType = 'WPT';
            // Determine the type of waypont based on the name.
            // TOC TOD
            if (waypointName === 'TOC') {
              waypointType = 'TOC'

            } else if (waypointName === 'TOD') {
              waypointType = 'TOD';

              // ENTRY EXIT and ETP
            } else if (/^((ENTRY)[0-9]{0,1})|^((EXIT)[0-9]{0,1})|^((ETP)\([0-9A-Z]{1,3}\))$/.test(waypointName)) {
              waypointType = "ETOPS";

              // VOR or ADF
            } else {

              let level = flightLevels.find(level => level.position === waypointName);

              if (level !== undefined) {
                currentFL = level.level
              }

              if (waypointName.length === 3) {
                waypointType = 'STA';
                stationFreq = waypoint.substring(4, 10);
              }

            }

            this._flight.flight.waypoints.push({
              name: waypointName,
              type: waypointType,
              stationFreq: stationFreq,
              flightLevelPlan: Number(currentFL),
              fuelReq: Number(fuelReq.replace('.', '') + '00'),
              ctm: ctm
            });
          }
        });

        // if alternate flight plan "TO ALTERNATE" stop
        if (page.includes('TO ALTERNATE')) {
          fplFinished = true;
        }

      }

      // Wind pages
      if (page.includes('CLIMB FL 100 200 310 350') || windsPage) {
        fplFinished = true;
        windsPage = true;

        // look for pattern N1312.4/E07743.9
        let waypoints = page.match(/[NS][0-9]{4}.[0-9]{1}\/[EW][0-9]{5}.[0-9]{1}([ ][A-Z]{0,5})?/g) || [];

        // for each waipoint, extract name and coordinates and insert into flight
        for (let i = 0; i < waypoints.length; i++) {
          let waypoint = waypoints[i];

          let wpt = this.getWaypoints(waypoint);

          // find the waypoint
          const index = this._flight.flight.waypoints.findIndex((w) => w.name === wpt.name || w.name === wpt.coordStr);

          // if waypoint was found
          if (index !== -1) {
            this._flight.flight.waypoints[index].lat = wpt.lat;
            this._flight.flight.waypoints[index].lon = wpt.lon;

            // Lets calculate Track and Distance ;) - if it's not the last waypoint.
            if (i + 1 < waypoints.length) {
              let wpt2 = this.getWaypoints(waypoints[i + 1]);

              this._flight.flight.waypoints[index].distance = Math.round(this._fcalc.flightDistance(wpt.lat, wpt.lon, wpt2.lat, wpt2.lon));

              this._flight.flight.waypoints[index].bearing = Math.round(this._fcalc.flightBearing(wpt.lat, wpt.lon, wpt2.lat, wpt2.lon));
            }
          }
        };

        // stop looking for waypoints
        if (page.includes('DESC FL 100 200 310 350')) {
          windsPage = false;
        }
      }

      // Look for the NAT TRAKS if its in the route....
      if (natTrakLetter !== '' && page.includes(natTrakLetter + ' ' + natEntry)) {
        let track = (page.match(new RegExp(natTrakLetter + '[ ]' + natEntry + '.*' + natExit)) || [''])[0];

        // remove the letter....
        track = track.slice(2);

        // Replace the track in the route
        this._flight.flight.route = this._flight.flight.route.replace(natEntry + ' ' + natTrakLetter + ' ' + natExit, track);

        // if current note is already in use, create a new one.
        if (this._flight.selectedDepNoteText !== '' && this._flight.selectedDepNoteText !== this._flight.perfToEosid) {
          this._flight.addDepNote();
        }

        // Add EOSID to notes
        this._flight.selectedDepNoteText = "NAT TRACK '" + natTrakLetter + "' added to the route.\n\n" + track;
      }

      // // Looking for selcal SEL/ADGS
      // if (page.includes('ATC Flight Plan')) {
      //   let selcal:string = (page.match(/(SEL\/){1}[A-Z]{4}/g)||[])[0];
      //   this._flight.flight.selcal = selcal.substring(4,6)+'-'+selcal.substring(6);
      // }

      // Get alternates from WX FORECAST to AIRPORTLIST ENDED
      if (page.includes('WX FORECAST') || weatherPage) {
        weatherPage = true;

        let airports: string[] = (page.match(/[ ][A-Z]{4}\/[A-Z]{3}[ ]/g) || []);

        airports.forEach(airport => {
          let tempIcao = airport.substring(1, 5);
          // add to alternates
          alts.push({ icao: tempIcao });
          // dont inset the departue and arrival airpors in the list to be copied
          if ((tempIcao != this._flight.fromAirport.icao) && (tempIcao != this._flight.toAirport.icao)) {
            this._flight.flight.alternateList += tempIcao + ' ';
          }
          // else {

          // if (tempIcao === this._flight.flight.from) {
          //   this._flight.flight.from += ' - ' + airport.substring(6, 9);
          // } else {
          //   this._flight.flight.to += ' - ' + airport.substring(6, 9);
          // }
          // }
        });

        if (page.includes('AIRPORTLIST ENDED')) {
          weatherPage = false;
        }
      }
    });

    // end of the loop

    // add airports to alternates
    this._flight.flight.alternates = alts;

    // Save flight
    this._flight.saveFlight();
  }

  getWaypoints(waypoint: string): { name: string, lat: number, lon: number, coordStr: string } {
    // Split string at "/" OR " "
    var parts = waypoint.split(/[\/" "]+/);

    let lat = parts[0];
    let latNum = Number(lat.substring(1, 3)) + (Number(lat.substring(3)) / 60)
    // Revert the lat if south
    if (lat.substring(0, 1) === 'S') latNum *= -1;

    let lon = parts[1];
    let lonNum = Number(lon.substring(1, 4)) + (Number(lon.substring(4)) / 60)
    // Revert the lon if west
    if (lon.substring(0, 1) === 'W') lonNum *= -1;

    let coordStr = parts[0].substring(0, 5) + parts[1].substring(0, 6);

    let name: string = '';
    if (parts[2].length != 0) {
      name = parts[2];
    } else {
      name = coordStr;
    }
    return { name: name, lat: latNum, lon: lonNum, coordStr: coordStr };
  }

  // Get page and title of field, return Int with Minutes from midnight
  getTimes(page: string, title: string): number | null {

    // dont read the top of the page (there are a few 'TRIP' strings before this....)
    let oneTonStr = page.indexOf('RAMP FUEL ');
    page = page.substring(oneTonStr);

    if (page.includes(title)) {
      let numberString = ((page.match(new RegExp(title + '[ ]([0-9]{2}/)?(([0-9]{4})|(\.{4}))')) || [''])[0].match(/[0-9]+$/) || [''])[0];

      if (numberString) {
        let hours: number = Number(numberString.substring(0, 2));
        let minutes: number = Number(numberString.substring(2));

        return hours * 60 + minutes;
      }
    }
    return null;
  }

  getValue(page: string, title: string): number {
    if (page.includes(title)) {
      let numberString = (page.match(new RegExp(title + '[ ]{1,10}([A-Z]{0,10}[ ])?[0-9\.]{1,6}')) || [])[0].match(/[0-9\.]+$/);

      return Number(numberString);
    } else {
      return 0;
    }
  }

  // Receives timezone (P|M)ZZZZ and return +|-minutes
  timezoneToInt(timeZoneString: string): number {
    let hours: number = Number(timeZoneString.substring(1, 3));
    let minutes: number = Number(timeZoneString.substring(3));
    let tz: number = hours * 60 + minutes;
    if (timeZoneString.charAt(0) === 'M') {
      tz = tz * -1;
    }
    return tz;
  }

  // Receives time format NNNN and return minutes from midnight
  timeToInt(time: string): number {
    let hours: number = Number(time.substring(0, 2));
    let minutes: number = Number(time.substring(2));
    return hours * 60 + minutes;
  }

  getPageText(pageNumber: number, pdf: any): Promise<string> {
    return new Promise((resolve, reject) => {
      pdf.getPage(pageNumber).then(function (pdfPage: { getTextContent: () => Promise<any>; }) {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent) {
          var textItems = textContent.items;
          var finalString = "";

          // Concatenate the string of the item to the final string
          for (var i = 0; i < textItems.length; i++) {
            var item = textItems[i];

            finalString += item.str + " ";

          }
          // Solve promise with the text retrieven from the page
          resolve(finalString);
        });
      });
    });
  }
}
