import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html'
})
export class DisclaimerComponent implements OnInit {

  constructor(
    private _modalService: NgbModal,
    public _activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
