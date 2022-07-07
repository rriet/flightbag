import { Airport } from "./airport";
import { Crew } from "./crew";
import { DangerousGood } from "./dangerous-goods";
import { Waypoint } from "./waypoint";

export interface Flight {
    // Flight info
    number: string;
    callsign: string;
    etops: boolean;
    etopsChecked: boolean;
    mel: boolean;
    melChecked: boolean;

    // Aircraft
    tailNumber: string;
    type: string;

    // Airports
    from: string;
    fromTimeZone: number;
    to: string;
    toTimeZone: number;

    // Route
    route: string;
    levels: string[];
    highestLevel: string;
    alternates: Airport[];
    alternateList: string;
    waypoints: Waypoint[];

    // Times and date
    dateStandardDeparture: number;
    dateActualDeparture: number | null;

    timeStd: number;
    timeAtd: number | null;
    timeTakeoff: number | null;
    timeSta: number;
    timeLdg: number | null;
    timeAta: number | null;
    timeBlock: number | null;
    timeTrip: number | null;
    timeRevisedTrip: number | null;

    // weight
    ezfw: number;
    etow: number;
    elwt: number;
    // max
    mzfw: number;
    mtow: number;
    mlwt: number;
    // actual ZFW
    azfw: number | null;

    // fuel
    fuelTaxi: number;
    fuelTaxiRevised: number | null;
    fuelTrip: number;
    fuelTripRevised: number | null;
    fuelContigency: number;
    fuelContigencyRevised: number | null;
    fuelAlternate: number;
    fuelAlternateRevised: number | null;
    fuelFinal: number;
    fuelFinalRevised: number | null;
    fuelMinReq: number;
    fuelMinReqRevised: number | null;
    fuelRamp: number;
    fuelRampRevised: number | null;
    fuelFinalRamp: number | null; // With Crew extra
    fuelArrivalBeforeRefuel: number | null;
    fuelBefore: number | null;
    fuelUpliftUnit: string;  // USG or LTS
    fuelUpliftVal: number[];
    fuelSg: number | null;
    fuelDeparture: number | null;
    fuelArrivalAfterFlight: number | null;
    fuelEstimatedArrival: number | null;


    // Crew
    pob: number | null;
    fdCrew: string;
    csdName: string;

    depNotes: string[];
    selectedDepNote: number;
    arrNotes: string[];
    selectedArrNote: number;

    atisDepInfo: string;
    rwyDeparture: string;
    rwyIntercection: string;

    dispatchName: string;
    dispatchFreq: string;
    atisArrInfo: string;
    temperature: number;
    parkingStand: string;

    // Rest
    restStart: number | null;
    restEnd: number | null;
    restType: string;
    restReference: string;

    dgs: DangerousGood[];

    activeDisplay: number;
}