import { Component, Input, SimpleChanges } from '@angular/core';
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
  //collection image
  isCollectionImageOpen = false;
  indexRoomType = 0;
  currentIndex = 0;
  isShowPopupAddRoomType = false;
  constructor(private roomTypeService: RoomTypeService){}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['idMotel']){
      this.getRoomTypesByIDMotel(this.idMotel);
    }
  }

  ngOnInit(): void {
    console.log(this.idMotel);
    this.getRoomTypesByIDMotel(this.idMotel);
    
  }
  
  getRoomTypesByIDMotel(id:string) :void{
    this.roomTypeService.getRoomTypesByIDMotel(id).subscribe({
      next: (response) => {
        this.listRoomTypes = response;
        console.log(this.listRoomTypes);
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
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
    const popupAddRoomType = document.getElementById('popupAddRoomType') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddRoomType && popupAddRoomType.classList.contains('hidden')){
      popupAddRoomType.classList.remove('hidden')
      popupAddRoomType.classList.add('flex')
    }
  }
}
