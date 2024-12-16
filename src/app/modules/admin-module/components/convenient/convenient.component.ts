import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Convenient } from 'src/app/interfaces/convenient';
import { ConvenientService } from 'src/app/services/convenient.service';

@Component({
  selector: 'app-convenient',
  templateUrl: './convenient.component.html',
  styleUrls: ['./convenient.component.css']
})
export class ConvenientComponent {
  listConvenient: Convenient[] = [];
  currentPage: number = 1;
  isShowPopupUpdateRoomType = false;
  isShowPopupAddConvenient = false;
  isShowPopupUpdateConvenient = false;
  indexConvenientUpdate!:number;
  convenient!: Convenient;

  //collection image
  isCollectionImageOpen = false;
  indexConvenient = 0;

  searchText = '';
  searchControl: FormControl = new FormControl('');
  constructor(private convenientService: ConvenientService,){}

  ngOnInit(): void {
    this.getAllConvenient();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Đợi 300ms sau khi người dùng dừng nhập liệu
        distinctUntilChanged() // Chỉ phát tín hiệu khi giá trị thay đổi
      )
      .subscribe((value) => {
        this.searchText = value;
      });
  }

  getAllConvenient():void{
    this.convenientService.getAllConvenient().pipe(
      map(response => response.reverse()) // Reverse the data array
    )
    .subscribe((reversedData) => {
      this.listConvenient = reversedData;   
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }

  receiveNewConvenientFormUpdateConvenient(data: Convenient): void {
    this.listConvenient[this.indexConvenientUpdate] = data;
  }

  receiveNewConvenientFormAddConvenient(data: Convenient): void {
    this.listConvenient.unshift(data)
  }


  handleOpenCollectionImage(indexConvenient: number){
    this.isCollectionImageOpen = true;
    this.indexConvenient = indexConvenient;
  }

  handleCloseCollectionImage():void{
    this.isCollectionImageOpen = false
  }

  showPopupAddConvenient():void{
    this.isShowPopupAddConvenient = true;
    const popupAddConvenient = document.getElementById('popupAddConvenient') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddConvenient && popupAddConvenient.classList.contains('hidden')){
      popupAddConvenient.classList.remove('hidden')
      popupAddConvenient.classList.add('flex')
    }
  }

  showPopupUpdateConvenient(indexUpdate: number, convenient: Convenient):void{
    this.isShowPopupUpdateConvenient = true;
    this.indexConvenientUpdate = indexUpdate;
    this.convenient = {...convenient};
    const popupUpdateConvenient = document.getElementById('popupUpdateConvenient') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateConvenient && popupUpdateConvenient.classList.contains('hidden')){
      popupUpdateConvenient.classList.remove('hidden')
      popupUpdateConvenient.classList.add('flex')
    }
  }
}
