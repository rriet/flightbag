import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist'; // <-- installation (npm i pdfjs-dist)
import { Airport } from '../objects/airport';
import { FlightService } from './flight.service';

@Injectable({
  providedIn: 'root'
})
export class PdfReadService {

  constructor(private _flight:FlightService) { }

  readPdf(e:any) {
    //Step 4:turn array buffer into typed array
    var typedarray = new Uint8Array(e.target.result);

    pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/js/pdf.worker.js';
    //Step 5:pdfjs should be able to read this
    const loadingTask = pdfjsLib.getDocument(typedarray);

    loadingTask.promise.then(async pdf => {
        
      var totalPages = pdf.numPages;

      let pagesArray:string[]=[];

      if (totalPages > 7) {
        
        for (let i = 3; i <= totalPages; i++) {
          await this.getPageText(i , pdf).then((textPage) =>{
            pagesArray.push(textPage);
            
          });
        }

        // check fist page is correct
        if (pagesArray[0].includes('PAGE   1/')) {

          // empty current flight
          this._flight.clearFligh();
          
          // extract all pages
          this.extractFlightInfo(pagesArray);
        }
      }
      
    });
  }

  extractFlightInfo(pages:string[]) {

    // mark first page as read
    let firstPageFinished:boolean = false;

    // looking for waypoints on the flightplan
    let fplFinished:boolean = false;

    // To avoid inserting WPT from the alternate flightplan
    let timeToWpt = 0;

    // look for the climb wind until descent wind
    let windsPage:boolean = false;

    // look for alternates from WX FORECAST to AIRPORTLIST ENDED
    let weatherPage:boolean = false;
    let alts:Airport[] = [];

    pages.forEach(page => {

      // Remove double spaces
      page = page.replace(/ {2,}/g, ' ');

      // read first page and return
      if (!firstPageFinished) {

        // locate and retrive flight number/callsign
        //QTR07V/QR245
        let numberCall = page.match(/QTR[A-Z0-9]{1,4}\/QR\d{1,4}/g)||[];

        let numberCallArray = numberCall[0].split('/')

        // split flight number and callsign
        this._flight.flight.callsign = numberCallArray[0].substring(3,numberCallArray[0].length);
        this._flight.flight.number = numberCallArray[1];

        // locate date
        let date = page.match(/[0-9]{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC){1}/g)||[];

        this._flight.flight.dateStandardDeparture = new Date(Date.parse(date[0].substring(2) +" "+date[0].substring(0,2)+", "+ new Date().getFullYear() + ' 00:00:00 GMT')).getTime()/60000;

        // Matches P0100 and M1000 time format
        let timeZones = page.match(/(P|M){1}[0-9]{4}/g)||[];

        // Get and convert time zones
        this._flight.flight.fromTimeZone = this.timezoneToInt(timeZones[0]);
        this._flight.flight.toTimeZone = this.timezoneToInt(timeZones[1]);

        // Airports are the first occurrence of XXXX/XXXX
        let depArrAirp = (page.match(/[A-Z]{4}\/[A-Z]{4}/g)||[])[0].split('/');

        // TODO: Search airport info and select airport.....
        this._flight.flight.from =  depArrAirp[0];
        this._flight.flight.to =  depArrAirp[1];

        // Get aircraft type
        this._flight.flight.type = (page.match(/(A3|B7){1}[0-9A-Z]{2}/g)||[])[0];

        // Get Tail Number
        this._flight.flight.tailNumber = (page.match(/(A7){1}[A-Z]{3}/g)||[])[0];

        // Check if it's ETOPS
        this._flight.flight.etops = page.includes('ETOPS:');

        // check if has MEL/CDL
        this._flight.flight.mel = page.includes('MEL/CDL');

        // Get Route
        // Locate the SECOND occurance of the departure airport (after 120 chars shoud be enogh)
        let dep2 = page.indexOf(this._flight.flight.from, 120);
        dep2 = page.indexOf(' ', dep2 + 5); // remove the runway identification "OTHH 34R " (get location of firs space after the ICAO + ' ')
        let arr2 = page.indexOf(this._flight.flight.to, 120);
        this._flight.flight.route = page.substring(dep2,arr2);

        // Get Levels
        this._flight.flight.levels = (page.match(/(FL){1}[0-9]{3}(\/[A-Z]{1,5})?/g)||[]);

        // Get highest FL
        let levelNum:number = 0;
        this._flight.flight.levels.forEach(level => {
          if (Number(level.match(/[0-9]{3}/g)) > levelNum) {
            levelNum = Number(level.match(/[0-9]{3}/g));
          }
        });

        this._flight.flight.highestLevel = String(levelNum);

        // // get GND DIST
        // this._flight.flight.groundDistance = this.getValue(page, 'GND DIST');

        // Get Taxi fuel
        this._flight.flight.fuelTaxi = this.getValue(page, 'TAXI');

        // Get Trip fuel
        this._flight.flight.fuelTrip = this.getValue(page, 'TRIP');

        // Get Contingency Fuel
        this._flight.flight.fuelContigency = this.getValue(page.replace('3P/C','').replace('5P/C','').replace('20MIN',''), 'CONT');

        // Get Alternate fuel
        this._flight.flight.fuelAlternate =  Math.ceil(this.getValue(page, 'ALTN'));

        // Get Final fuel
        this._flight.flight.fuelFinal = Math.ceil(this.getValue(page.replace('I/R', ''), 'FINL') / 100) * 100;

        // Get Min fuel Required
        this._flight.flight.fuelMinReq = this.getValue(page, 'MIN FUEL REQ');

        // Get Ramp fuel ROUNDED UP
        this._flight.flight.fuelRamp = Math.ceil(this.getValue(page, 'RAMP FUEL') / 100) * 100;

        /////  Weights ////
        this._flight.flight.mzfw = this.getValue(page, 'MZFW');
        this._flight.flight.ezfw = this.getValue(page, 'EZFW');
        this._flight.flight.mtow = this.getValue(page, 'MTOW');
        this._flight.flight.etow = this.getValue(page, 'ETOW');
        this._flight.flight.mlwt = this.getValue(page, 'MLWT');
        this._flight.flight.elwt = this.getValue(page, 'ELWT');

        ////  Times ////
        this._flight.flight.timeStd = this.getTimes(page, 'STD');
        this._flight.flight.timeBlock = this.getTimes(page, 'BLK');
        this._flight.flight.timeTrip = this.getTimes(page, 'TRIP');
        this._flight.flight.timeSta = this.getTimes(page, 'STA');

        // END OF First Page
        firstPageFinished = true;
        return;
      }

      // after finishin the first page and before the wind page
      // Looking for the main FPL
      if (!fplFinished && firstPageFinished) {

        // looking for patterns
        // "GIBIN 027 8 0007 .... ...."
        // "LAGSA 009 61 0.829 503/509 114 0031 .... .... 114.1 UT430 342 CLB 121/010 P18 7 .... .... "
        // "N6000W11500 190 317 527/476 1155 .... .... 17.9"
        // "SAV 408.00 354 7 0.830 517/507 107 0118 .... .... 105.9"
        let waypoints = page.match(/([A-Z]{3,5}|[NS]{1}[0-9]{4}[EW]{1}[0-9]{5})[ ]([0-9]{3}[.][0-9]{1,2}[ ]){0,1}[0-9]{3}[ ][0-9]{1,4}[ ](0[.][0-9]{1,4}[ ]){0,1}([0-9]{3}\/[0-9]{3}[ ]){0,1}([0-9]{1,3}[ ]){0,1}[0-9]{4} .... .... [0-9]{1,3}.[0-9]?/g)||[];

        // for each waypoint in the page
        waypoints.forEach(waypoint => {

          // Clean waypoint information
          waypoint = waypoint.replace(/[ ]([0-9]{3}.[0-9]{1,2}[ ]){0,1}[0-9]{3}[ ][0-9]{1,3}[ ](0[.][0-9]{1,4}[ ]){0,1}([0-9]{3}\/[0-9]{3}[ ]){0,1}([0-9]{1,3}[ ]){0,1}/g, ' ');
          waypoint = waypoint.replace('.... .... ', '');

          // split line on the spaces "115.8 PEGET 11  20  0020" [0] = fuel, [1] = WPT, [2] = Dist, [3] = MSA, [4] = CTM
          let wptArray:string[] = waypoint.split(' ');


          // To avoid inserting the FPL to alternate
          // Check if time is greater than previous WPT

          if (this.timeToInt(wptArray[1]) >= timeToWpt) {
            timeToWpt = this.timeToInt(wptArray[1]);

            this._flight.flight.waypoints.push({
              name:wptArray[0],
              fuelReq:Number(wptArray[2]),
              ctm: this.timeToInt(wptArray[1])
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
        let waypoints = page.match(/[NS][0-9]{4}.[0-9]{1}\/[EW][0-9]{5}.[0-9]{1}([ ][A-Z]{0,5})?/g)||[];

        // for each waipoint, extract name and coordinates and insert into flight
        waypoints.forEach(waypoint => {
          let wpt = this.getWaypoints(waypoint);

          // find the waypoint
          const index = this._flight.flight.waypoints.findIndex((w) => w.name === wpt.name);

          // if waypoint was found
          if (index !== -1) {
            this._flight.flight.waypoints[index].lat = wpt.lat;
            this._flight.flight.waypoints[index].lon = wpt.lon;
          }
        });

        // stop looking for waypoints
        if (page.includes('DESC FL 100 200 310 350')) {
          windsPage = false;
        }
      }

      // // Looking for selcal SEL/ADGS
      // if (page.includes('ATC Flight Plan')) {
      //   let selcal:string = (page.match(/(SEL\/){1}[A-Z]{4}/g)||[])[0];
      //   this._flight.flight.selcal = selcal.substring(4,6)+'-'+selcal.substring(6);
      // }

      // Get alternates from WX FORECAST to AIRPORTLIST ENDED
      if (page.includes('WX FORECAST') || weatherPage) {
        weatherPage = true;

        let airports:string[] = (page.match(/[ ][A-Z]{4}\/[A-Z]{3}[ ]/g)||[]);

        airports.forEach(airport => {
          let tempIcao = airport.substring(1,5);
          // add to alternates
          alts.push({icao:tempIcao});
          // dont inset the departue and arrival airpors in the list to be copied
          if ((tempIcao != this._flight.flight.from) && (tempIcao != this._flight.flight.to)) {
            this._flight.flight.alternateList += tempIcao + ' ';
          } else {
            
            if(tempIcao === this._flight.flight.from){
              this._flight.flight.from += ' - ' + airport.substring(6,9);
            } else {
              this._flight.flight.to += ' - ' + airport.substring(6,9);
            }
          }
        });

        if (page.includes('AIRPORTLIST ENDED')){
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

  getWaypoints(waypoint:string):{name:string, lat:number, lon:number} {
    // Split string at "/" OR " "
    var parts = waypoint.split(/[\/" "]+/);

    let lat = parts[0];
    let latNum = Number(lat.substring(1,3)) + (Number(lat.substring(3)) / 60)
    // Revert the lat if south
    if (lat.substring(0,1) === 'S') latNum *= -1;

    let lon = parts[1];
    let lonNum = Number(lon.substring(1,4)) + (Number(lon.substring(4)) / 60)
    // Revert the lon if west
    if (lon.substring(0,1) === 'W') lonNum *= -1;

    let name:string = '';
    if (parts[2].length != 0) {
      name = parts[2];
    } else {
      name = parts[0].substring(0,5) + parts[1].substring(0,6);
    }
    return {name:name,lat:latNum,lon:lonNum};
  }

  // Get page and title of field, return Int with Minutes from midnight
  getTimes(page:string, title:string):number{

    // dont read the top of the page (there are a few 'TRIP' strings before this....)
    let oneTonStr = page.indexOf('STD ');
    page = page.substring(oneTonStr);

    if (page.includes(title)) {
      let numberString = (page.match(new RegExp(title+'[ ]{1,10}[A-Z]{0,10}[ ]{0,1}([0-9]{2}/){0,1}[0-9]{1,6}'))||[])[0].match(/[0-9]+$/)||[];
      let hours:number = Number(numberString[0].substring(0,2));
      let minutes:number = Number(numberString[0].substring(2));
      return hours * 60 + minutes;
    } else {
      return 0;
    }
  }

  getValue(page:string, title:string):number{
    if (page.includes(title)) {
      let numberString = (page.match(new RegExp(title+'[ ]{1,10}[A-Z]{0,10}[ ]{0,10}[0-9]{1,6}'))||[])[0].match(/[0-9]+$/);
      return Number(numberString);
    } else {
      return 0;
    }
  }

  // Receives timezone (P|M)ZZZZ and return +|-minutes
  timezoneToInt (timeZoneString:string): number {
    let hours:number = Number(timeZoneString.substring(1,3));
    let minutes:number = Number(timeZoneString.substring(3));
    let tz:number = hours * 60 + minutes;
    if (timeZoneString.charAt(0) === 'M') {
      tz = tz * -1;
    }
    return tz;
  }

  // Receives time format NNNN and return minutes from midnight
  timeToInt (time:string):number {
    let hours:number = Number(time.substring(0,2));
    let minutes:number = Number(time.substring(2));
    return hours * 60 + minutes;
  }

  getPageText(pageNumber:number, pdf: any): Promise<string> {
    return new Promise((resolve,reject) => {
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
