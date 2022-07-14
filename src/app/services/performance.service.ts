import { Injectable } from '@angular/core';
import { Airport } from '../objects/airport';
import { FlightService } from './flight.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceSevice {

  constructor(
    private _flight: FlightService

  ) { }

  decodeDep(e: string): string {

    // Verify if the file is takeoff performance
    if (e.includes('TAKE-OFF PERFORMANCE')) {

      // check if the performance airport is the same as the flight plan
      let airport: string = this.getLine('AIRPORT   : ', e).substring(0, 4);
      if (airport !== this._flight.from.substring(0, 4)) {
        return 'Airport Mismatch!! Expecting: ' + this._flight.from.substring(0, 4) + ' received: ' + airport;
      }

      // Retrive the runway and intercection
      let runwayIntStr = this.getLine('RUNWAY    : ', e);
      if (runwayIntStr.includes('/')) {
        this._flight.rwyDeparture = runwayIntStr.split('/')[0];
        this._flight.rwyIntercection = runwayIntStr.split('/')[1];
      } else {
        this._flight.rwyDeparture = runwayIntStr;
        this._flight.rwyIntercection = 'FULL';
      }

      // Get wind
      this._flight.prefToWind = this.getLine('WIND      : ', e).replace(' KT', '');

      // let windDirection: string = '000';
      // let windSpeed: string = '0';
      // let windString = this.getLine('WIND      : ', e);
      // if (windString.includes('/')) {
      //   windDirection = windString.split('/')[0];
      //   windSpeed = windString.split('/')[1];
      // } else {
      //   windSpeed = windString;

      //   let runwayHeading: number = Number(this._flight.rwyDeparture.substring(0, 2) + 0);

      //   // if the speed starts with '-' the direction is the oposite of the runway heading
      //   if (windSpeed.substring(0, 1) === '-') {
      //     // Get the oposit direction from the runway
      //     windDirection = String(runwayHeading < 180 ? runwayHeading + 180 : runwayHeading - 180);

      //     // now that we got the direction, lets remove the symbol
      //     windSpeed = windSpeed.replace('-', '').padStart(3,'0');
      //   } else {
      //     windDirection = String(runwayHeading).padStart(3,'0');
      //   }
      // }

      // // Now check if wind is in KT or MPS
      // if (windSpeed.includes('KT')) {
      //   // Remove the " KT" from the end
      //   windSpeed = windSpeed.substring(0, windSpeed.length - 3);
      // } else {
      //   windSpeed = String(Math.round(Number(windSpeed.slice(0, - 4)) * 1.9438));
      // }

      // // Set the wind
      // this._flight.prefToWind = windDirection + '/' + windSpeed;

      // Extract the temperature
      let temperature = this.getLine('OAT       : ', e);
      if (temperature.includes('F')) {
        temperature = String(Math.round((Number(temperature.slice(0, - 2)) - 32) / 1.8));
      } else {
        temperature = temperature.substring(0, temperature.length - 2);
      }

      // Save the temperature
      this._flight.perfToTemp = Number(temperature);

      // Extract QNH
      let qnh = this.getLine('QNH       : ', e);
      if (qnh.includes(' IN HG')) {
        qnh = String(Math.round(Number(qnh.replace(' IN HG', '')) * 33.86389));
      } else {
        qnh = qnh.substring(0, qnh.length - 6);
      }

      // Save QNH
      this._flight.perfToQnh = Number(qnh);

      // Extract TOW
      this._flight.perfToWeight = Number(this.getLine('TOW       : ', e).slice(0, -3));

      // Extract 'MFRH      : 1000 ft AGL'
      this._flight.perfToMfrh = Number(this.getLine('MFRH      : ', e).slice(0, -7));

      // extract Flaps
      this._flight.perfToFlaps = Number(this.getLine('FLAPS     : ', e));

      // extract 'THRUST RATING : D-TO'
      this._flight.perfToRating = this.getLine('THRUST RATING : ', e);

      // extract 'POWER SETTING : 92.4                 58 C' OR 'POWER SETTING : 95.7                 N/A'
      let powerTemp = this.getLine('POWER SETTING : ', e).replace(/[ ]{1,15}/g, ' ').split('  ');
      this._flight.perfToN1 = powerTemp[0];
      this._flight.perfToAssumedTemp = powerTemp[1];

      // Extract V1, Vr, V2
      this._flight.perfToV1 = Number(this.getLine('V1: ', e).replace(' KT', ''))
      this._flight.perfToVr = Number(this.getLine('VR: ', e).replace(' KT', ''))
      this._flight.perfToV2 = Number(this.getLine('V2: ', e).replace(' KT', ''))


      // Extract 'EOSID: At 20 NM ["DOHX1" (N2459.1 E05144.7)] enter HLDG (156 INBD,LT)'
      this._flight.perfToEosid = this.getLine('EOSID: ', e);

      // if current note is already in use, create a new one.
      if (this._flight.selectedDepNoteText !== '' && this._flight.selectedDepNoteText !== this._flight.perfToEosid) {
        this._flight.addDepNote();
      }

      // Add EOSID to notes
      this._flight.selectedDepNoteText = this._flight.perfToEosid;

      return '';
    }
    return 'Invalid File';
  }

  getLine(title: string, file: string): string {
    return file.substring(file.indexOf(title) + title.length, file.indexOf('\n', file.indexOf(title))).trim();
  }
}


// TAKE-OFF PERFORMANCE 09JUL22 20:49:46

// AIRPORT   : OTHH / DOHA/HAMAD INTL     
// AIRPORT   : MMMX / MEXICO CITY/LIC BE

// RUNWAY    : 16L
// RUNWAY    : 05R/B2                                       

// WIND      : 0 KT
// WIND      : -5 KT
// WIND      : 250/7 KT
// WIND      : 139/6 MPS
// WIND      : -3 MPS

// OAT       : 33 C
// OAT       : 12 F                       

// QNH       : 1000.0 HPa
// QNH       : 29.90 IN HG                 

// TOW       : 245000 KG                  

// MFRH      : 1000 ft AGL                

// FLAPS     : 5        
// FLAPS     : 20                  

// THRUST RATING : D-TO
// THRUST RATING : TO B
// THRUST RATING : D-TO 2

// POWER SETTING : 92.4                 58 C 
// POWER SETTING : 95.7                 N/A                              

// V1: 150 KT  
// VR: 152 KT  
// V2: 157 KT  

// ENGINE FAILURE PROCEDURE:
// EOSID: At 20 NM ["DOHX1" (N2459.1 E05144.7)] enter HLDG (156 INBD,LT)