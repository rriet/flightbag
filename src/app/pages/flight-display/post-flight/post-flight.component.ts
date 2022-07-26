import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { FlightService } from 'src/app/services/flight.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-post-flight',
  templateUrl: './post-flight.component.html'
})
export class PostFlightComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    private _clipboard: ClipboardService,
    public _toastService: ToastService,
  ) { }

  ngOnInit(): void {
  }

  get chocksOffLabel(): string {
    if (this._flight.isDepDelayed && this._flight.timeAtd !== null) {
      return "Chocks-Off (+" + this._flight.timeDepDiff + ")"
    }
    return "Chocks-Off"
  }

  get chocksOnLabel(): string {
    if (this._flight.isArrDelayed && this._flight.timeAta !== null) {
      return "Chocks-On (+" + this._flight.timeArrDiff + ")"
    }
    return "Chocks-On"
  }

  copyFuelValue(selectedValue: number | null | undefined) {
    this._toastService.show('Value copied to clipboard.', { classname: 'toast-mgs', delay: 2000 });
    this._clipboard.copy(String(selectedValue));
  }
}
