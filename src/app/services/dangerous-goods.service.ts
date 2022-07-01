import { Injectable } from '@angular/core';
import { DangerousGood, PrimaryHazard, Drill } from '../objects/dangerous-goods';

@Injectable({
  providedIn: 'root'
})
export class DangerousGoodsService {

  constructor() { }

  getDgs():PrimaryHazard[]{
    return dgs;
  }

  // get DG by number
  getDg(number:string):PrimaryHazard {
    // DG array starts with 1 but JS array with 0 so (-1)
    return dgs[Number(number) - 1];
  }

  getDrill(drillLetter:string):Drill|undefined {
    return drils.find(drill => {
      return drill.letter === drillLetter;
    });
  }

  getDrills(drillLetters:string[]):Drill[] {
    let drils:Drill[] = [];
    drillLetters.forEach(drill => {
      drils.push(this.getDrill(drill) || {letter: '', hazard: ''})
    });
    return drils;
  }
}

export const dgs:PrimaryHazard[] =[
  {
    number: '1',
    title: 'Explosive',
    hazard: 'Explosion may cause structural failure',
    toAircraft: 'Fire and/or explosion',
    toOccupants: 'As indicated by drill letter(s)',
    spillProcedure: 'Use 100% oxygen; no smoking',
    firefighting: 'All agents according to availability; use standard fire procedire',
    aditional: 'Possible abrupt loss of pressurization'
  },
  {
    number: '2',
    title: 'Gas',
    hazard: 'Gas non-flammable, presure may create hazard in fire',
    toAircraft: 'Minimal',
    toOccupants: 'As indicated by drill letter(s)',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation for "A", "I" or "P" drill letter',
    firefighting: 'All agents according to availability; use standard fire procedire',
    aditional: 'Possible abrupt loss of pressurization'
  },
  {
    number: '3',
    title: 'Flammable Liquid',
    hazard: 'Flammable Liquid',
    toAircraft: 'Fire and/or explosion',
    toOccupants: 'Smoke, fumes and heat and as indicated by drill letter(s)',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation; no smoking; minimum electrics',
    firefighting: 'All agents according to availability; no water on "W" drill letter',
    aditional: 'Possible abrupt loss of pressurization'
  },
  {
    number: '4',
    title: 'Spontaneously Combustible',
    hazard: 'Spontaneously Combustible or pyrophoric when exposed to air',
    toAircraft: 'Fire and/or explosion',
    toOccupants: 'Smoke, fumes and heat, and as indicated by drill letter(s)',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation',
    firefighting: 'All agents according to availability; no water on "W" drill letter',
    aditional: 'Possible abrupt loss of pressurization; minimum electrics if "F" or "H" drill letter'
  },
  {
    number: '5',
    title: 'Oxidizer',
    hazard: 'Oxidizer, may ignite other materials, may explode in heat of a fire',
    toAircraft: 'Fire and/or explosion, possible corrosion damage',
    toOccupants: 'Eye, nose and throat irritation; skin damage on contact',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation',
    firefighting: 'All agents according to availability; no water on "W" drill letter',
    aditional: 'Possible abrupt loss of pressurization'
  },
  {
    number: '6',
    title: 'Toxic',
    hazard: 'Toxic, may be fatal if inhaled, ingested, or absorbed by skin',
    toAircraft: 'Contamination with toxic liquid or solid',
    toOccupants: 'Acute toxicity, effects may be delayed',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation; do not touch without gloves',
    firefighting: 'All agents according to availability; no water on "W" drill letter',
    aditional: 'Possible abrupt loss of pressurization; minimum electrics if "F" or "H" drill letter'
  },
  {
    number: '7',
    title: 'Radioactive',
    hazard: 'Radiation from broken/unshielded packages',
    toAircraft: 'Contamination with spilled radioactive material',
    toOccupants: 'Exposure to radiation, and personnel contamination',
    spillProcedure: 'Do not move packages; avoid contact',
    firefighting: 'All agents according to availability',
    aditional: 'Call for a qualified person to meet the aircraft'
  },
  {
    number: '8',
    title: 'Corrosive',
    hazard: 'Corrosive, fumes disabling if inhaled or in contact with skin',
    toAircraft: 'Possible corrosion damage',
    toOccupants: 'Eye, nose and throat irritation; skin damage on contact',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation; do not touch without gloves',
    firefighting: 'All agents according to availability; no water on "W" drill letter',
    aditional: 'Possible abrupt loss of pressurization; minimum electrics if "F" or "H" drill letter'
  },
  {
    number: '9',
    title: 'No Risk',
    hazard: 'No general inherent risk',
    toAircraft: 'As indicated by the drill letter',
    toOccupants: 'As indicated by the drill letter',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation if “A” drill letter',
    firefighting: 'All agents according to availability',
    aditional: 'None'
  },
  {
    number: '10',
    title: 'Gas, Flammable',
    hazard: 'Gas, flammable, high fire risk if any ignition source present',
    toAircraft: 'Fire and/or explosion',
    toOccupants: 'Smoke, fumes and heat, and as indicated by drill letter(s)',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation; no smoking; minimum electrics',
    firefighting: 'All agents according to availability',
    aditional: 'Possible abrupt loss of pressurization'
  },
  {
    number: '11',
    title: 'Infectious',
    hazard: 'Infectious substances may affect humans or animals if inhaled, ingested or absorbed through the mucous membrane or an open wound',
    toAircraft: 'Contamination with Infectious substances',
    toOccupants: 'Delayed infection to humans or animals',
    spillProcedure: 'Do not touch. Minimum re-circulation and ventilation in affected area',
    firefighting: 'All agents according to availability. No water on “Y” drill letter',
    aditional: 'Call for a qualified person to meet the aircraft'
  },
  {
    number: '12',
    title: 'Flammable toxic',
    hazard: 'Fire, heat, smoke, toxic and flammable vapour',
    toAircraft: 'Fire and/or explosion',
    toOccupants: 'Smoke, fumes and heat',
    spillProcedure: 'Use 100% oxygen; establish and maintain maximum ventilation',
    firefighting: 'All agents according to availability. Use water if available',
    aditional: 'Possible abrupt loss of pressurization; consider landing immediately'
  },
];


export const drils:Drill[] =[
  {
    letter: 'A',
    hazard: 'ANAESTHETIC'
  },
  {
    letter: 'C',
    hazard: 'CORROSIVE'
  },
  {
    letter: 'E',
    hazard: 'EXPLOSIVE'
  },
  {
    letter: 'F',
    hazard: 'FLAMMABLE'
  },
  {
    letter: 'H',
    hazard: 'HIGHLY IGNITABLE'
  },
  {
    letter: 'I',
    hazard: 'IRRITANT / TEAR PRODUCING'
  },
  {
    letter: 'L',
    hazard: 'OTHER RISK LOW OR NONE'
  },
  {
    letter: 'M',
    hazard: 'MAGNETIC'
  },
  {
    letter: 'N',
    hazard: 'NOXIOUS'
  },
  {
    letter: 'P',
    hazard: 'TOXIC* (POISON)'
  },
  {
    letter: 'S',
    hazard: 'SPONTANEOUSLY COMBUSTIBLE OR PYROPHORIC'
  },
  {
    letter: 'W',
    hazard: 'IF WET GIVES OFF POISONOUS OR FLAMMABLE GAS'
  },
  {
    letter: 'X',
    hazard: 'OXIDIZER'
  },
  {
    letter: 'Y',
    hazard: 'DEPENDING ON THE TYPE OF INFECTIOUS SUBSTANCE, THE APPROPRIATE NATIONAL AUTHORITY MAY BE REQUIRED TO QUARANTINE INDIVIDUALS, ANIMALS, CARGO AND THE AIRCRAFT'
  },
  {
    letter: 'Z',
    hazard: 'AIRCRAFT CARGO FIRE SUPPRESSION SYSTEM MAY NOT EXTINGUISH OR CONTAIN THE FIRE; CONSIDER LANDING IMMEDIATELY'
  },
];
