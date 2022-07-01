
export interface DangerousGood {
    primaryHazard:PrimaryHazard,
    drills:Drill[]
    location:string;
}


export interface PrimaryHazard {
    number: string;
    title: string;
    hazard: string;
    toAircraft: string;
    toOccupants: string;
    spillProcedure: string;
    firefighting: string;
    aditional: string;
}

export interface Drill {
    letter: string;
    hazard: string;
}