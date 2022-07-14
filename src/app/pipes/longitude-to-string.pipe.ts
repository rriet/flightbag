import { Pipe, PipeTransform } from '@angular/core';
import { lonToStr } from '../modules/conversion';


@Pipe({
  name: 'lonToStr'
})
export class LongitudeToString implements PipeTransform {

  transform(lon: number | null = 0): string {
    return lonToStr(lon);
  }
}
