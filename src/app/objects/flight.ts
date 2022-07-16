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
    from: Airport;
    fromTimeZone: number;
    to: Airport;
    toTimeZone: number;

    // Route
    route: string;
    highestLevel: string;
    alternates: Airport[];
    alternateList: string;
    waypoints: Waypoint[];

    sunRiseSet: { time: number, lat: number, lon: number, isDay: boolean }[]

    // Times and date
    dateStandardDeparture: number;

    timeStd: number;
    timeRevisedStd: number | null;
    timeAtd: number | null;
    timeTakeoff: number | null;
    timeSta: number;
    timeLdg: number | null;
    timeAta: number | null;
    timeBlock: number;
    timeTrip: number;
    timeRevisedTrip: number | null;
    timeEnrouteDelay: number; // number of minutes delay in the last waypoint entry (Positive = delay)

    // weight
    ezfw: number;
    etow: number;
    elwt: number;
    // max
    mzfw: number;
    mtow: number;
    mlwt: number;
    // actual ZFW
    rzfw: number | null;
    fzfw: number | null;

    // fuel
    fuelPlusAdjustment: number;
    fuelMinusAdjustment: number;
    fuelTaxi: number;
    fuelTaxiRevised: number | null;
    fuelTrip: number;
    fuelTripRevised: number | null;
    fuelContigency: number;
    fuelContigencyRevised: number | null;
    fuelAlternate: number;
    fuelAlternateRevised: number | null;
    fuelFinal: number;                          // 30 Min hold
    fuelFinalRevised: number | null;
    fuelMinReq: number;
    fuelMinReqRevised: number | null;
    fuelRamp: number;
    fuelRampRevised: number | null;
    fuelFinalRamp: number | null; // With Crew extra

    fuelPlanRequired: number;
    fuelPlanRemaining: number;

    fuelArrivalBeforeRefuel: number | null;
    fuelBefore: number | null;
    fuelUpliftUnit: string;  // USG or LTS
    fuelUpliftVal: number[];
    fuelSg: number | null;
    fuelDeparture: number | null;
    fuelArrivalAfterFlight: number | null;
    fuelEstimatedArrival: number | null;

    // POB
    pob: number | null;

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

    activePerformanceDisplay: number;
    activeFlightDisplay: number;


    // Take-off Performance
    prefToWind: string | null;
    perfToTemp: number | null;
    perfToQnh: number | null;
    perfToWeight: number | null;
    perfToMfrh: number | null;
    perfToFlaps: number | null;
    perfToRating: string | null;
    perfToAssumedTemp: string | null;
    perfToN1: string | null;
    perfToV1: number | null;
    perfToVr: number | null;
    perfToV2: number | null;
    perfToVref30: number | null;
    perfToEosid: string | null;

}