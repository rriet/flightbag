import { Pipe, PipeTransform } from '@angular/core';
import { numToTons } from '../modules/conversion';

@Pipe({
  name: 'numToTons'
})
export class NumToTonsPipe implements PipeTransform {

  transform(num: number | null = 0): string {
    return numToTons(num);
  }

}
