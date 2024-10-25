import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCapitalize]'
})
export class CapitalizeDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value;

    // Chuyển đổi mỗi từ thành chữ hoa đầu tiên
    const capitalizedValue = this.capitalizeWords(value);

    // Cập nhật giá trị mà không gây ra sự kiện input
    this.renderer.setProperty(inputElement, 'value', capitalizedValue);
  }

  private capitalizeWords(value: string): string {
    return value
      .split(' ') // Tách các từ
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Chữ hoa đầu mỗi từ
      )
      .join(' '); // Nối lại các từ
  }
}
