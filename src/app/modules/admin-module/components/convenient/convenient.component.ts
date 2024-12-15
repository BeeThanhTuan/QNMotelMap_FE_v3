import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Convenient } from 'src/app/interfaces/convenient';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { ConvenientService } from 'src/app/services/convenient.service';
import { MotelService } from 'src/app/services/motel.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
  constructor(private convenientService: ConvenientService,){}

  ngOnInit(): void {
    this.getAllConvenient();
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
