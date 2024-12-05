import { Component, Input, SimpleChanges } from '@angular/core';
import { map } from 'rxjs';
import { RoomType } from 'src/app/interfaces/roomType';
import { RoomTypeService } from 'src/app/services/roomType.service';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent {
  @Input() idMotel!: string ;
  listRoomTypes: RoomType[] = []
  roomType!:RoomType;
  //collection image
  isCollectionImageOpen = false;
  indexRoomType = 0;
  indexRoomTypeUpdate = 0;
  currentIndex = 0;
  isShowPopupAddRoomType = false;
  isShowPopupUpdateRoomType = false;
  constructor(private roomTypeService: RoomTypeService){}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['idMotel']){
      this.getRoomTypesByIDMotel(this.idMotel);
    }
  }

  getRoomTypesByIDMotel(id:string) :void{
    this.roomTypeService.getRoomTypesByIDMotel(id).pipe(
      map(response => response.reverse()) 
    ).subscribe({
      next: (reversedResponse) => {
        this.listRoomTypes = reversedResponse;
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    });
  }

  receiveNewRoomTypeFormAddRoomType(data: RoomType): void {
    this.listRoomTypes.unshift(data)
  }

  handleOpenCollectionImage(index: number, indexRoomType: number){
    this.isCollectionImageOpen = true;
    this.currentIndex = index;
    this.indexRoomType = indexRoomType;
  }

  handleCloseCollectionImage(){
    this.isCollectionImageOpen = false
  }

  nextImage(index:number): void {
    this.currentIndex = (this.currentIndex + 1) % this.listRoomTypes[index].ListImages.length;
  }

  prevImage(index:number): void {
    this.currentIndex = (this.currentIndex - 1 + this.listRoomTypes[index].ListImages.length) % this.listRoomTypes[index].ListImages.length;
  }

  
  showPopupAddRoomType(): void {
    this.isShowPopupAddRoomType = true
    this.idMotel = this.idMotel;
    const popupAddRoomType = document.getElementById('popupAddRoomType') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddRoomType && popupAddRoomType.classList.contains('hidden')){
      popupAddRoomType.classList.remove('hidden')
      popupAddRoomType.classList.add('flex')
    }
  }

  showPopupUpdateRoomType(indexUpdate: number, motelID: string, roomTypeData: RoomType): void {
    this.indexRoomTypeUpdate = indexUpdate;
    this.isShowPopupUpdateRoomType= true
    this.idMotel = motelID;   
    this.roomType = {...roomTypeData};
    const popupUpdateRoomType = document.getElementById('popupUpdateRoomType') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateRoomType && popupUpdateRoomType.classList.contains('hidden')){
      popupUpdateRoomType.classList.remove('hidden')
      popupUpdateRoomType.classList.add('flex')
    }
  }

  receiveNewRoomTypeFormUpdateMRoomType(data: RoomType): void {
    this.listRoomTypes[this.indexRoomTypeUpdate] = data;
  }
}
