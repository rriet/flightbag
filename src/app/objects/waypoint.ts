export interface Waypoint {
    name: string;
    type?: string;
    stationFreq?: string;
    lat?: number;
    lon?: number;
    flightLevelPlan?: number;
    flightLevelActual?: number;
    ctm?: number;
    eta?: number;
    ata?: number;
    rta?: number;
    fuelReq?: number;
    fuelDiff?: number;
    fob?: number;
    isDay?: boolean;
    bearing?: number;
    distance?: number;
}