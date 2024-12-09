import { Directive, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[appClickPrevRecommendMotel]'
})
export class ClickPrevRecommendMotelDirective implements AfterViewInit {
  private scrollContainer: HTMLElement | null = null;
  private li: HTMLElement | null = null;
  private readonly GAP: number = 16;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.scrollContainer = this.el.nativeElement.parentElement?.parentElement?.querySelector('ul') as HTMLElement;
    if (this.scrollContainer) {
        setTimeout(() => {
            this.li = this.scrollContainer!.querySelector('li') as HTMLElement;
        }, 100);  
    } else {
        console.log('No <ul> found');
    }

    // Add scroll event listener to update button states after scroll happens
    this.scrollContainer.addEventListener('scroll', () => this.updateButtonState());
    this.updateButtonState();
  }

  @HostListener('click')
  onClick() {
    if (this.scrollContainer && this.li) {
      const widthLi = this.li.offsetWidth + this.GAP;
      this.scrollContainer.scrollBy({
        left: -widthLi,
        behavior: 'smooth'
      });
    }
  }

  private updateButtonState() {
    // if (this.scrollContainer) {
    //   const prevButton = this.el.nativeElement;
    //   const nextButton = this.el.nativeElement.parentElement.children[1]; // Get the next button
    //   const scrollLeft = this.scrollContainer.scrollLeft;
    //   const scrollWidth = this.scrollContainer.scrollWidth;
    //   const clientWidth = this.scrollContainer.clientWidth;

    //   // Disable prevButton if we are at the start of the scroll
    //   if (scrollLeft <= 0) {
    //     prevButton.classList.add('invisible');
    //     prevButton.classList.add('flex-none');
    //   } else {
    //     prevButton.classList.remove('invisible');
    //     prevButton.classList.remove('flex-none');
    //   }

    //   // Disable nextButton if we are at the end of the scroll
    //   if (scrollLeft + clientWidth >= scrollWidth) {
    //     nextButton.classList.add('invisible');
    //     nextButton.classList.add('flex-none');
    //   } else {
    //     nextButton.classList.remove('invisible');
    //     nextButton.classList.remove('flex-none');
    //   }
    // }
  }
}
