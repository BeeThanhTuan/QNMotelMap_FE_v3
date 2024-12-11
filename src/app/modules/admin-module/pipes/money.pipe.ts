import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (!value) {
      return '0';
    }

    // Convert value to string
    let stringValue = value.toString();

    // Regular expression to add dot separators for every three digits from the right
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
