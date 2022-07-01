export interface Airport {
    icao: string;
    iata?: string;
    name?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    timezone?:number;
    altitude?:number;
}