import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreak'
})
export class LineBreakPipe implements PipeTransform {
  transform(value: string): string {
    return value.split('.').join('.<br/>'); // Tách chuỗi và thêm <br>
  }
}