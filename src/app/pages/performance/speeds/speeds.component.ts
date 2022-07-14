import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { PerformanceSevice } from 'src/app/services/performance.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-speeds',
  templateUrl: './speeds.component.html'
})
export class SpeedsComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    public _prefs: PreferencesService,
    public _performance: PerformanceSevice,
    public _toastService: ToastService,
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('performanceUpload') performanceUpload!: ElementRef;

  get isaTemperature(): number | null {
    if (this._flight.fromAirport.elevation !== undefined) {
      return 15 - (0.0019812 * this._flight.fromAirport.elevation);
    }
    return null;
  }

  get isaDeviation(): number | null {
    if (this.isaTemperature !== null && this._flight.perfToTemp !== null) {
      return this._flight.perfToTemp - this.isaTemperature;
    }
    return null;
  }

  get pressureAltitude(): number | null {
    if (this._flight.fromAirport.elevation !== undefined && this._flight.perfToQnh !== null) {
      return (1013 - this._flight.perfToQnh) * 30 + this._flight.fromAirport.elevation;
    }
    return null;
  }

  get densityAltitude(): number | null {
    if (this.pressureAltitude !== null && this.isaDeviation !== null) {
      return Math.round(this.pressureAltitude + (120 * this.isaDeviation));
    }
    return null;
  }

  get tas(): number | null {
    if (this._flight.perfToTemp !== null && this._flight.perfToVr !== null && this._flight.perfToQnh !== null) {
      return Math.ceil(this._flight.perfToVr / Math.sqrt(288.15 / (this._flight.perfToTemp + 273.15) * (this._flight.perfToQnh / 1013.25)));
    }
    return null;
  }

  get windDirection(): number | null {
    if (this._flight.prefToWind !== null) {
      // if wind is in format HHH/S
      if (this._flight.prefToWind.match(/^[0-9]{1,3}\/[0-9]{1,3}$/g)) {
        return Number(this._flight.prefToWind.split('/')[0]);

        // if the wind is in headwind component
      } else if (this._flight.prefToWind.match(/^[-+]?[0-9]{1,3}$/g) && this.runwayHeading !== null) {
        if (this._flight.prefToWind.substring(0, 1) === '-') {
          // Get the oposit direction from the runway
          return this.runwayHeading < 180 ? this.runwayHeading + 180 : this.runwayHeading - 180;
        } else {
          return this.runwayHeading;
        }
      }
    }
    return null;
  }

  get windSpeed(): number | null {
    if (this._flight.prefToWind !== null) {
      // if wind is in format HHH/S
      if (this._flight.prefToWind.match(/^[0-9]{1,3}\/[0-9]{1,3}$/g)) {
        return Number(this._flight.prefToWind.split('/')[1]);

        // if the wind is in headwind component
      } else if (this._flight.prefToWind.match(/^[-+]?[0-9]{1,3}$/g)) {
        return Math.abs(Number(this._flight.prefToWind));
      }
    }
    return null;
  }

  get runwayHeading(): number | null {
    if (this._flight.rwyDeparture.length >= 2 && Number(this._flight.rwyDeparture.substring(0, 2)) !== NaN) {
      return Number(this._flight.rwyDeparture.substring(0, 2) + 0);
    }
    return null;
  }

  get headWind(): number | null {
    if (this.windDirection !== null && this.windSpeed !== null && this.runwayHeading !== null) {
      return Math.floor(this.windSpeed * Math.cos((this.runwayHeading - this.windDirection) * (Math.PI / 180)));
    }
    return null;
  }

  get windComponents(): string {
    if (this.windDirection !== null && this.windSpeed !== null && this.runwayHeading !== null && this.headWind !== null) {

      let windString = '';

      var crossWind = Math.round(this.windSpeed * Math.sin((this.runwayHeading - this.windDirection) * (Math.PI / 180)));
      if (crossWind > 0) {
        windString = Math.abs(crossWind) + " XL";
      } else if (crossWind < 0) {
        windString = Math.abs(crossWind) + " XR";
      } else {
        windString = " 0 XW";
      }

      if (this.headWind > 0) {
        windString = Math.abs(this.headWind) + " HW / " + windString;
      } else if (this.headWind < 0) {
        windString = Math.abs(this.headWind) + " TW / " + windString;
      } else {
        windString = '0 / ' + windString;
      }

      return windString;
    }
    return '';
  }

  get groundSpeed(): number | null {
    return (this.tas !== null && this.headWind !== null) ? this.tas - this.headWind : null;
  }

  get tireMargin(): number | null {
    return (this.groundSpeed !== null && this._prefs.tireLimitSpeed !== null) ? this._prefs.tireLimitSpeed - this.groundSpeed : null;
  }

  get minClean(): number | null {
    return this._flight.perfToVref30 !== null && this._flight.perfToVref30 > 100 ? this._flight.perfToVref30 + 80 : null;
  }

  extractPerformance(event: any) {
    // get file path
    let file = event.target.files[0];

    if (file !== null && file !== undefined) {
      // Read file
      let reader = new FileReader();

      reader.readAsText(file);
      reader.onload = (e: any) => {
        // Decode performance file
        let result: string = this._performance.decodeDep(String(reader.result));
        if (result !== '') {
          this._toastService.show(result, { classname: 'toast-wrn toast-mgs', delay: 4000 });
        }
      }
      this.performanceUpload.nativeElement.value = null;
    }

  }
}
