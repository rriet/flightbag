import { Pipe, PipeTransform } from '@angular/core';
import { nunToTonsDiff } from '../modules/conversion';

@Pipe({
  name: 'tonDiff'
})
export class TonDiffPipe implements PipeTransform {

  transform(num: number | null = 0): string {
    return nunToTonsDiff(num);
  }

}
