import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<number> {

  fromModel(value: number | null): NgbTimeStruct | null {
    if (value === null) {
      return null;
    }

    let hours: number = Math.floor(value / 60);
    let minutes: number = value % 60;

    return {
      hour: hours,
      minute: minutes,
      second: 0
    };
  }

  toModel(time: NgbTimeStruct | null): number | null {
    return time != null ? time.hour * 60 + time.minute : null;
  }
}
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }]
})
export class TimeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (this.req && (this.time === undefined || this.time === null)) {
      this.setNow();
    }

    // fixes times that are more than 24 hs... (next day)
    if (this.time !== null && this.time > 24 * 60) this.time = this.time - 24 * 60;
  }

  @Input() label: string = "Time";
  @Input() width!: string;
  @Input() minWidth!: string;
  @Input() hint!: string;
  @Input() req: boolean = false;
  @Input() edit: boolean = true;
  @Input() clickable: boolean = true;
  @Input() caution: boolean = false;
  @Input() warning: boolean = false;
  @Input() time!: number | null;

  @Output() timeChange: EventEmitter<number | null> = new EventEmitter<number | null>();

  clicked(d: any) {
    if (this.clickable && (this.caution || this.warning)) {
      this.caution = false;
      this.warning = false;
    }

    if (this.edit) {
      d.toggle()
    }
  }

  setNow() {
    let hour: number = new Date().getHours() + (new Date().getTimezoneOffset() / 60);
    if (hour < 0) {
      hour += 24;
    }
    this.time = hour * 60 + new Date().getMinutes();
    this.changed();
  }

  getTime(): string {
    if (this.time === null) {
      return '';
    }

    let hours: number = Math.floor(this.time / 60);
    let minutes: number = this.time % 60;

    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

  changed() {
    this.timeChange.emit(this.time);
  }
}
