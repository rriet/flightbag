import { Pipe, PipeTransform } from '@angular/core';
import { latToStr } from '../modules/conversion';

@Pipe({
  name: 'latToStr'
})
export class LatitudeToString implements PipeTransform {

  transform(lat: number | null = 0): string {
    return latToStr(lat);
  }

}
