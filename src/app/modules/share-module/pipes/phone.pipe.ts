import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    value = value.replace(/\s+/g, '');

    if (value.length <= 4) {
      return value;
    } else if (value.length <= 7) {
      return `${value.substring(0, 4)} ${value.substring(4)}`;
    } else {
      return `${value.substring(0, 4)} ${value.substring(4,7)} ${value.substring(7)}`;
    }
  }

}
