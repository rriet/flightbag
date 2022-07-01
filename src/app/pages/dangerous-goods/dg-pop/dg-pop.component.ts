import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DangerousGoodsService } from 'src/app/services/dangerous-goods.service';
import { FlightService } from 'src/app/services/flight.service';
import { ToastService } from 'src/app/services/toast-service';


@Component({
  selector: 'app-dg-pop',
  templateUrl: './dg-pop.component.html'
})
export class DgPopComponent implements OnInit {

  constructor(
    public _activeModal: NgbActiveModal,
    public _dg: DangerousGoodsService,
    public _flight: FlightService,
    public _toastService: ToastService,
  ) { }

  ngOnInit(): void {
  }

  selectedDg: string = '9';
  selectedDrill: string = 'L';
  location: string = '';

  save() {
    // if all the drill letters are valid, add the DGS to the flight.
    if (/^[ACEFHILMNPSWXYZ]{1,9}$/.test(this.selectedDrill)) {

      let ph = this._dg.getDg(this.selectedDg);
      let drils = this._dg.getDrills(this.selectedDrill.split(''));

      let dg = {primaryHazard: ph, drills: drils, location: this.location}
      this._flight.addDgs(dg);

      this._activeModal.dismiss()
    } else {
      this._toastService.show(
        'Invalid drill letter(s).You must write one or more valid drill letter(s).[A,C,E,F,H,I,L,M,N,P,S,W,X,Y,Z]'
        , { classname: 'toast-mgs', delay: 3000 });
    }
  }

}
