import { Component, OnInit } from '@angular/core';
import { minTo12hStr } from 'src/app/modules/conversion';
import { getLocalTime, minNowUTC } from 'src/app/modules/time';
import { FlightService } from 'src/app/services/flight.service';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  selector: 'app-pa',
  templateUrl: './pa.component.html'
})
export class PaComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    public _prefs: PreferencesService,
  ) { }

  ngOnInit(): void {

    this.categoryList = [
      { value: 'hot', isSelected: false },
      { value: 'warm', isSelected: false },
      { value: 'cool', isSelected: false },
      { value: 'mild', isSelected: false },
      { value: 'chilly', isSelected: false },
      { value: 'cold', isSelected: false },
      { value: 'sunny', isSelected: true },
      { value: 'cloudy', isSelected: false },
      { value: 'overcast', isSelected: false },
      { value: 'clear', isSelected: false },
      { value: 'hazy', isSelected: false },
      { value: 'rainy', isSelected: false },
      { value: 'wet', isSelected: false },
      { value: 'dry', isSelected: false },
      { value: 'snowy', isSelected: false },
      { value: 'misty', isSelected: false },
      { value: 'humid', isSelected: false },
      { value: 'dusty', isSelected: false },
    ];
  }

  categoryList: any;


  active: number = 1
  pa: string = '';

  generateDepPa() {
    this.pa = this._prefs.departurePaTemplate;

    this.pa = this.pa.replace(/\[/gi, '<span class="pa-highlight">[').replace(/\]/gi, ']</span>');

    if (this._flight.timeStdLocal === null) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'morning / afternoon / evening');
    } else if (this._flight.timeStdLocal < (12 * 60)) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'morning');
    } else if (this._flight.timeStdLocal < (18 * 60)) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'afternoon');
    } else {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'evening');
    }

    this.pa = this.pa
      .replace(/\[MYNAME\]/gi, this._prefs.myname)
      .replace(/\[NUMBER\]/gi, this._flight.number)
      .replace(/\[DESTINATION\]/gi, this._flight.to)
      .replace(/\[DESTINATION_NAME\]/gi, this._flight.toAirport.name || '')
      .replace(/\[DESTINATION_COUNTRY\]/gi, this._flight.toAirport.country || '')
      .replace(/\[DESTINATION_CITY\]/gi, this._flight.toAirport.city || '')
      .replace(/\[DESTINATION\]/gi, this._flight.to)
      .replace(/\[CSDNAME\]/gi, this._prefs.csdName)
      .replace(/\[FL\]/gi, this._flight.highestLevel.slice(2,-1) + ',000')
      .replace(/\[FDCREW\]/gi, this._prefs.fdCrew);

    if (this._flight.timeTrip) {
      let hours: number = Math.floor(this._flight.timeTrip / 60);
      let minutes: number = this._flight.timeTrip % 60;
      let tripTime = hours + " hours and " + minutes + ' minutes';
      this.pa = this.pa.replace(/\[DURATION\]/gi, tripTime);
    }
    this.active = 4;
  }

  generateArrPa() {
    this.pa = this._prefs.arrivalPaTemplate;

    this.pa = this.pa.replace(/\[/gi, '<span class="pa-highlight">[').replace(/\]/gi, ']</span>');

    if (this._flight.timeEtaLocal === null) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'morning / afternoon / evening');
    } else if (this._flight.timeEtaLocal < (12 * 60)) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'morning');
    } else if (this._flight.timeEtaLocal < (18 * 60)) {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'afternoon');
    } else {
      this.pa = this.pa.replace(/\[MORNING\]/gi, 'evening');
    }

    var date = new Date(new Date());
    let timeNow: number = minNowUTC();

    this.pa = this.pa
      .replace(/\[DESTINATION\]/gi, this._flight.to)
      .replace(/\[DESTINATION_NAME\]/gi, this._flight.toAirport.name || '')
      .replace(/\[DESTINATION_COUNTRY\]/gi, this._flight.toAirport.country || '')
      .replace(/\[DESTINATION_CITY\]/gi, this._flight.toAirport.city || '')
      .replace(/\[TEMPC\]/gi, String(this._flight.temperature))
      .replace(/\[TEMPF\]/gi, String(this._flight.temperatureF))
      .replace(/\[ETA_LOCAL\]/gi, minTo12hStr(this._flight.timeInflightEtaLocal));


    if (this._flight.timeEta === null) {
      this.pa = this.pa.replace(/\[TIME_TO_GO\]/gi, 'a few')
    } else {
      let togo = this._flight.timeEta - timeNow;
      this.pa = this.pa.replace(/\[TIME_TO_GO\]/gi, 'about ' + togo)
    }

    let weather = '';
    for (var i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].isSelected) {
        weather += this.categoryList[i].value + ', ';
      }

    }
    
    this.pa = this.pa.replace(/\[WEATHER\]/gi, weather.slice(0, -2))



    let timeNowLocal: number|null = getLocalTime(timeNow, this._flight.toTimeZone);

    let timeString = minTo12hStr(timeNowLocal);

    this.pa = this.pa.replace(/\[TIME_NOW\]/gi, timeString)

    this.active = 4;
  }
}
