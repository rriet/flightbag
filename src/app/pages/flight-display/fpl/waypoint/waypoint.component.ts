import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { roundCent } from 'src/app/modules/math';
import { Waypoint } from 'src/app/objects/waypoint';
import { FlightService } from 'src/app/services/flight.service';
import { minToStr, numDiff, numToTons, nunToTonsDiff } from '../../../../modules/conversion';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html'
})
export class WaypointComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    private _modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.inputFl = this.flightLevel();
    this.inputFuel = this.revisedFuel;
    // this.inputTime = this.waypointTime().num;
  }

  inputFl: number | null = 0;
  inputFuel: number | null = 0;
  inputTimeVar: number | null = 0;

  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();

  @Input() waypoint: Waypoint = { name: '' };

  name(): string {
    if (this.waypoint.name.length == 11) {
      return this.waypoint.name.substring(0, 3) + this.waypoint.name.substring(5, 9)
    }
    return this.waypoint.name
  }

  set inputTime(value: number | null) {
    this.inputTimeVar = value;
  }
  get inputTime(): number {
    return this.inputTimeVar? this.inputTimeVar : this.waypointTime().num;
  }

  get wptEta(): number | undefined {
    if (this.waypoint.ctm && this._flight.timeTakeoff !== null) {
      return this.waypoint.ctm + this._flight.timeTakeoff;
    }
    return undefined;
  }

  get inputEtaDiff(): number | null {
    if (this.wptEta !== undefined && this.inputTime !== null) {
      return this.inputTime - this.wptEta;
    }
    return null;
  }

  get wptRta(): number | undefined {
    if (this.waypoint.rta !== undefined && this._flight.timeTakeoff !== null) {
      return this.waypoint.rta + this._flight.timeTakeoff;
    }
    return this.wptEta;
  }

  get inputRtaDiff(): number | null {
    if (this.wptRta !== undefined && this.inputTime !== null) {
      return this.inputTime - this.wptRta;
    }
    return null;
  }

  waypointTime(): { text: string, num: number } {
    if (this.wptEta !== undefined) {
      // First option ATA
      if (this.waypoint.ata !== undefined) {
        let delay = this.waypoint.ata - this.wptEta;
        let text = 'ATA: ' + minToStr(this.waypoint.ata) + ' ' + numDiff(delay);
        return { text: text, num: this.waypoint.ata };
      }

      // Second Option RTA
      if (this.wptRta !== undefined) {
        let delay = this.wptRta - this.wptEta;
        let text = 'RTA: ' + minToStr(this.wptRta) + ' ' + numDiff(delay);
        return { text: text, num: this.wptRta };
      }

      // Last option ETA
      let text = 'ETA: ' + minToStr(this.wptEta);
      return { text: text, num: this.wptEta };
    }
    return { text: '', num: 0 };
  }

  flightLevel(): number {
    // first option is to return the actual FL we reported
    if (this.waypoint.flightLevelActual != undefined) {
      return this.waypoint.flightLevelActual;
    }

    // Last is the planed FL. (probably just in the beginning of the flight)
    if (this.waypoint.flightLevelPlan !== undefined) {
      return this.waypoint.flightLevelPlan;
    }
    return 0;
  }

  planFl(): number {
    if (this.waypoint.flightLevelPlan !== undefined) {
      return this.waypoint.flightLevelPlan;
    }
    return 0;
  }

  get revisedFuel(): number {
    if (this.waypoint.fob !== undefined) return this.waypoint.fob;

    if (this.waypoint.fuelDiff !== undefined && this.fplFuel !== null) return this.fplFuel + this.waypoint.fuelDiff;

    if (this.fplFuel !== null) return this.fplFuel;

    return 0;
  }

  get fplFuel(): number | null {
    if (this.waypoint.fuelReq !== undefined) {
      return this._flight.fuelPlanRemaining + this.waypoint.fuelReq;
    }
    return null;
  }

  get inputFplFuelDiff(): number | null {
    if (this.fplFuel !== null && this.inputFuel !== null) {
      return this.inputFuel - this.fplFuel;
    }
    return null;
  }

  get fplRemFuel(): number | null {
    if (this.waypoint.fuelReq !== undefined) {
      return this._flight.fuelPlanRequired + this.waypoint.fuelReq;
    }
    return null;
  }

  get inputFplRemFuelDiff(): number | null {
    if (this.fplRemFuel !== null && this.inputFuel !== null) {
      return this.inputFuel - this.fplRemFuel;
    }
    return null;
  }

  fuelOnboard(): { text: string, num: number } {
    if (this.waypoint.fuelReq !== undefined) {
      let estimatedFOB = this._flight.fuelPlanRequired + this.waypoint.fuelReq

      if (this.waypoint.fob !== undefined && this.waypoint.ata !== null) {
        let saving: number = this.waypoint.fob - estimatedFOB;

        let num = this.waypoint.fob;
        let text = 'AFOB: ' + numToTons(this.waypoint.fob) + ' ' + nunToTonsDiff(saving);
        return { text: text, num: num };
      }
      let num = this.waypoint.fuelReq;
      let text = 'RFOB: ' + numToTons(num);
      return { text: text, num: num };
    }
    return { text: '', num: 0 };
  }

  get weightNow(): number {
    return roundCent(this._flight.fzfw + this.revisedFuel);
  }

  isOverweight(): boolean {
    return this.weightNow !== null ? this.weightNow > this._flight.mlwt : false;
  }

  open(content: any) {
    this._modalService.open(content, { modalDialogClass: 'waypoint-pop' });
  }

  saveWaypoint() {
    this.waypoint.flightLevelActual = this.inputFl ? this.inputFl : undefined;

    if (this.inputTime !== null) {
      this.waypoint.ata = this.inputTime;
      this._flight.timeEnrouteDelay = this.inputTime - this.waypointTime().num;
    }

    if (this.inputFuel !== null && this.waypoint.fuelReq !== undefined) {
      this._flight.fuelEstimatedArrival = this.inputFuel - this.waypoint.fuelReq;
      this.waypoint.fob = this.inputFuel;
    }

    let wptIndex = this._flight.waypoints.findIndex(wpt => {
      return wpt.name === this.waypoint.name;
    });


    for (let i = wptIndex + 1; i < this._flight.waypoints.length; i++) {
      let thisWpt = this._flight.waypoints[i];
      if (this.inputFplFuelDiff !== null && thisWpt.fuelReq !== undefined) {
        thisWpt.fuelDiff = this.inputFplFuelDiff;
      }

      if (this.inputEtaDiff !== null && thisWpt.ctm !== undefined) {
        thisWpt.rta = thisWpt.ctm + this.inputEtaDiff;
      }
    }
    // this.refresh.emit(this.waypoint.name);
  }
}
