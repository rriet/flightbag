import { Injectable } from "@angular/core";
import { airports } from "../data/airports";
import { Airport } from "../objects/airport";

@Injectable({
    providedIn: 'root'
})
export class AirportService {

    findAirportIcao(icao: string): Airport {

        let airportList: Airport[] = airports;

        let apt = airportList.find(airport => {
            if (airport.icao === icao) {
                return true;
            }
            return false;
        });

        return (apt !== undefined) ? apt : {icao: ''};
    }


}