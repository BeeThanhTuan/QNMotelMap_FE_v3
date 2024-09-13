import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutsideDesiredPrice]'
})
export class ClickOutsideDesiredPriceDirective {

  @Output() clickOutsideDesiredPrice = new EventEmitter<void>();

  private elements: HTMLElement[] = [];

  constructor(private _elementRef: ElementRef) {}

  // Cập nhật danh sách các phần tử DOM khi directive khởi tạo
  ngOnInit(): void {
    this.updateElements();
  }

  // Cập nhật danh sách các phần tử DOM
  private updateElements(): void {
    this.elements = [
      document.getElementById('field_desired_price'),
      document.getElementById('desired_price_popup')
    ].filter(el => el !== null) as HTMLElement[];
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    // Cập nhật lại danh sách các phần tử DOM trong trường hợp chúng bị thay đổi
    this.updateElements();

    const clickedInside = this.elements.some(element =>
      element.contains(event.target as Node)
    );

    if (!clickedInside) {
      this.clickOutsideDesiredPrice.emit();
    }
  }
}

