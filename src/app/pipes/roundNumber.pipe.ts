import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'roundNumber'
})
export class RoundNumber implements PipeTransform {

    transform(num: number | null = 0): number | null {
        return num ? Math.round(num) : null;
    }
}