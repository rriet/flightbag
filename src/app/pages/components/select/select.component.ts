import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

  @Input() items: { value: string, text: string }[] = [];
  selectedItem: { value: string, text: string } = { value: '', text: '' };
}
