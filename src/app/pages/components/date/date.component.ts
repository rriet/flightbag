import { Component, Injectable, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class CustomAdapter extends NgbDateAdapter<number> {
  fromModel(value: number | null): NgbDateStruct | null {
    if (value) {
      var d = new Date(0);
      d.setUTCSeconds(value * 60);
      return {
        day: d.getUTCDate(),
        month: d.getUTCMonth() + 1,
        year: d.getUTCFullYear()
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): number | null {
    return date ? new Date(date.year, date.month - 1, date.day).getTime() / 60000 - new Date().getTimezoneOffset() : null;
  }
}
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  // no need to parse input string since the input is readonly
  parse(): null {
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (date) {
      const d = new Date();
      d.setMonth((date!.month) - 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      return String(date.day).padStart(2, '0') + '/' + monthName + '/' + date.year;
    } else {
      return '';
    }
  }
}
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class DateComponent implements OnInit {

  constructor(
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    if (this.req && (this.dateInt === undefined || this.dateInt === null)) {
      this.setToday();
    }
  }

  @Input() label: string = "Date";
  @Input() width!: string;
  @Input() minWidth!: string;
  @Input() hint!: string;
  @Input() req: boolean = false;
  @Input() edit: boolean = true;
  @Input() caution: boolean = false;
  @Input() warning: boolean = false;
  @Input() dateInt!: number | null;
  @Output() dateIntChange: EventEmitter<number | null> = new EventEmitter<number | null>();

  today = new Date().getTime() / 60000;

  clicked(d: any) {
    if (this.caution || this.warning) {
      this.caution = false;
      this.warning = false;
    }

    if (this.edit) {
      d.toggle()
    }
  }

  setToday() {
    this.dateInt = new Date().setHours(0, 0, 0, 0) / 60000 - new Date().getTimezoneOffset();
    this.changed();
  }

  changed() {
    this.dateIntChange.emit(this.dateInt);
  }
}
