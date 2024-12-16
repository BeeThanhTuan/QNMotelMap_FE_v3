import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    // Chuyển tìm kiếm thành dạng chuẩn hóa không dấu
    searchText = this.removeDiacritics(searchText.toLocaleLowerCase());

    return items.filter((item) => {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const fieldValue = item[key];
          if (
            (typeof fieldValue === 'string' || typeof fieldValue === 'number') &&
            this.removeDiacritics(fieldValue.toString().toLocaleLowerCase()).includes(searchText)
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }

  // Hàm loại bỏ dấu trong chuỗi
  private removeDiacritics(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}

