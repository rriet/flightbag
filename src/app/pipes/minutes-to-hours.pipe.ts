import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(setMinutes: number | null = 0): string {
    if (setMinutes) {
      let dateObj: Date = new Date(setMinutes * 60000);
      let hours: number = dateObj.getUTCHours();
      let minutes: number = dateObj.getUTCMinutes();
      return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    }
    return '00:00';
  }

}
