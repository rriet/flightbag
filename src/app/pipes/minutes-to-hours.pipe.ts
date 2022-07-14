import { Pipe, PipeTransform } from '@angular/core';
import { minToStr } from '../modules/conversion';

@Pipe({
  name: 'toHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(minutes: number | null = 0): string {
    return minToStr(minutes);
  }

}
