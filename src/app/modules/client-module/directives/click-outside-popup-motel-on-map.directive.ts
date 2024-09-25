import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutsidePopupMotelOnMap]'
})
export class ClickOutsidePopupMotelOnMapDirective {
  @Output() clickOutsidePopupMotelOnMap = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    const clickedInside = this._elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutsidePopupMotelOnMap.emit();
    }
  }
}
