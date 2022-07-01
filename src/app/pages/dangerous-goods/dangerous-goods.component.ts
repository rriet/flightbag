import { Component, OnInit } from '@angular/core';
import { DangerousGood } from 'src/app/objects/dangerous-goods';
import { DangerousGoodsService } from 'src/app/services/dangerous-goods.service';
import { FlightService } from 'src/app/services/flight.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DgPopComponent } from './dg-pop/dg-pop.component';
import { ShowDgPopComponent } from './show-dg-pop/show-dg-pop.component';

@Component({
  selector: 'app-dangerous-goods',
  templateUrl: './dangerous-goods.component.html'
})
export class DangerousGoodsComponent implements OnInit {

  constructor(
    public _flight: FlightService,
    public _dg: DangerousGoodsService,
    private _modalService: NgbModal,
  ) { }

  ngOnInit(): void { }

  openAddDgDialog() {
    this._modalService.open(DgPopComponent, {
      scrollable: true,
    });
  }

  showDgDialog(dg: DangerousGood) {
    const modalRef = this._modalService.open(ShowDgPopComponent , {
      scrollable: true,
    });
    modalRef.componentInstance.dangerousGood = dg;
  }

  removeDg(index: number) {
    this._flight.removeDg(index);
  }
}
