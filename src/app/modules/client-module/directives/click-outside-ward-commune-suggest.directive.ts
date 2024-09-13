import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutsideSuggestWardCommune]'
})
export class ClickOutsideSuggestWardCommuneDirective {

  @Output() clickOutsideSuggestWardCommune = new EventEmitter<void>();

  private elements: HTMLElement[];

  constructor(private _elementRef: ElementRef) {
    // Lưu trữ các phần tử DOM mà bạn muốn kiểm tra
    this.elements = [
      document.getElementById('input_address_search'),
      document.getElementById('address_suggest_ward_commune_popup')
    ].filter(el => el !== null) as HTMLElement[];
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const clickedInside = this.elements.some(element =>
      element.contains(event.target as Node)
    );

    if (!clickedInside) {
      this.clickOutsideSuggestWardCommune.emit();
    }
  }
}




