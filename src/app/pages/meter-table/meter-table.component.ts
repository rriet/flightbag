import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meter-table',
  templateUrl: './meter-table.component.html'
})
export class MeterTableComponent implements OnInit {

  constructor(
    private _modalService: NgbModal,
    public _activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {}

  public selectedLevel!:level;

  getEastWest(): { west: level, east: level }[] {
    let levels: { west: level, east: level }[] = [];

    for (let x = 0; x < LEVELS.length; x = x + 2) {
      levels.push({ west: LEVELS[x], east: LEVELS[x + 1] });
    }
    return levels;
  }

  showLevel(level: level, content:any) {
    this.selectedLevel = level;
    this._modalService.open(content,{
      centered: true
     });
  }

}

export interface level {
  id: number;
  meter: string;
  feet: string;
  direction: string;
}

export const LEVELS: level[] = [
  { id: 0, meter: '13,100', feet: '43,000', direction: 'W' },
  { id: 1, meter: '12,500', feet: '41,100', direction: 'E' },
  { id: 2, meter: '12,200', feet: '40,100', direction: 'W' },
  { id: 3, meter: '11,900', feet: '39,100', direction: 'E' },
  { id: 4, meter: '11,600', feet: '38,100', direction: 'W' },
  { id: 5, meter: '11,300', feet: '37,100', direction: 'E' },
  { id: 6, meter: '11,000', feet: '36,100', direction: 'W' },
  { id: 7, meter: '10,700', feet: '35,100', direction: 'E' },
  { id: 8, meter: '10,400', feet: '34,100', direction: 'W' },
  { id: 9, meter: '10,100', feet: '33,100', direction: 'E' },
  { id: 10, meter: '9,800', feet: '32,100', direction: 'W' },
  { id: 11, meter: '9,500', feet: '31,100', direction: 'E' },
  { id: 12, meter: '9,200', feet: '30,100', direction: 'W' },
  { id: 13, meter: '8,900', feet: '29,100', direction: 'E' },
  { id: 14, meter: '8,400', feet: '27,600', direction: 'W' },
  { id: 15, meter: '8,100', feet: '26,600', direction: 'E' },
  { id: 16, meter: '7,800', feet: '25,600', direction: 'W' },
  { id: 17, meter: '7,500', feet: '24,600', direction: 'E' },
  { id: 18, meter: '7,200', feet: '23,600', direction: 'W' },
  { id: 19, meter: '6,900', feet: '22,600', direction: 'E' },
  { id: 20, meter: '6,600', feet: '21,700', direction: 'W' },
  { id: 21, meter: '6,300', feet: '20,700', direction: 'E' },
  { id: 22, meter: '6,000', feet: '19,700', direction: 'W' },
  { id: 23, meter: '5,700', feet: '18,700', direction: 'E' },
  { id: 24, meter: '5,400', feet: '17,700', direction: 'W' },
  { id: 25, meter: '5,100', feet: '16,700', direction: 'E' },
  { id: 26, meter: '4,800', feet: '15,700', direction: 'W' },
  { id: 27, meter: '4,500', feet: '14,800', direction: 'E' },
  { id: 28, meter: '4,200', feet: '13,800', direction: 'W' },
  { id: 29, meter: '3,900', feet: '12,800', direction: 'E' },
  { id: 30, meter: '3,600', feet: '11,800', direction: 'W' },
  { id: 31, meter: '3,300', feet: '10,800', direction: 'E' },
  { id: 32, meter: '3,000', feet: '9,800', direction: 'W' },
  { id: 33, meter: '2,700', feet: '8,900', direction: 'E' },
  { id: 34, meter: '2,400', feet: '7,900', direction: 'W' },
  { id: 35, meter: '2,100', feet: '6,900', direction: 'E' },
  { id: 36, meter: '1,800', feet: '5,900', direction: 'W' },
  { id: 37, meter: '1,500', feet: '4,900', direction: 'E' },
  { id: 38, meter: '1,200', feet: '3,900', direction: 'W' },
  { id: 39, meter: '900', feet: '3,000', direction: 'E' },
  { id: 40, meter: '600', feet: '2,000', direction: 'W' },
  { id: 41, meter: '550', feet: '1,800', direction: 'E' },
];

