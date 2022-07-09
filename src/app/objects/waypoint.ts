export interface Waypoint {
    name: string;
    lat?: number;
    lon?: number;
    ctm?: number;
    eta?: number;
    fuelReq?: number;
    ata?: number;
    fob?: number;
    night?: boolean;
}