import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutsideSuggestAddress]'
})
export class ClickOutsideSuggestAddressDirective {

  @Output() clickOutsideSuggestAddress = new EventEmitter<void>();

  private elements: HTMLElement[] = [];

  constructor(private _elementRef: ElementRef) {}

  // Cập nhật danh sách các phần tử DOM khi directive khởi tạo
  ngOnInit(): void {
    this.updateElements();
  }

  // Cập nhật danh sách các phần tử DOM
  private updateElements(): void {
    this.elements = [
      document.getElementById('input_address_search'),
      document.getElementById('suggest_ward_commune_popup')
    ].filter(el => el !== null) as HTMLElement[];
  }


  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    this.updateElements();
    const clickedInside = this.elements.some(element =>
      element.contains(event.target as Node)
    );

    if (!clickedInside) {
      this.clickOutsideSuggestAddress.emit();
    }
  }
}




