import { Pipe, PipeTransform } from '@angular/core';
import { numDiff } from '../modules/conversion';

@Pipe({
  name: 'numDiff'
})
export class NumDiffPipe implements PipeTransform {

  transform(num: number | null = 0): string {
    return numDiff(num);
  }

}
