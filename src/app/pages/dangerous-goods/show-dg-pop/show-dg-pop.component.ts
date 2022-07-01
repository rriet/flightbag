import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DangerousGood } from 'src/app/objects/dangerous-goods';


@Component({
  selector: 'app-show-dg-pop',
  templateUrl: './show-dg-pop.component.html'
})
export class ShowDgPopComponent implements OnInit {

  constructor(
    public _activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  @Input() dangerousGood!:DangerousGood;

}
