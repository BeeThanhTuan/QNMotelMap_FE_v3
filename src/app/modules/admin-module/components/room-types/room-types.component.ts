import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Motel } from 'src/app/interfaces/motel';
import { RoomType } from 'src/app/interfaces/roomType';
import { AlertService } from 'src/app/services/alert.service';
import { MotelService } from 'src/app/services/motel.service';
import { RoomTypeService } from 'src/app/services/roomType.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent {
  listRoomTypes: RoomType[] = [];
  currentPage: number = 1;
  motel!: Motel;
  isShowPopupUpdateRoomType = false;
  indexUpdate!: number;
  motelID!:string;
  roomType!: RoomType;
  //collection image
  isCollectionImageOpen = false;
  indexMotel = 0;
  indexRoomTypeUpdate = 0;
  currentIndexRoomType = 0;
  constructor(private motelService: MotelService, private alert: AlertService, private roomTypeService: RoomTypeService){}

  ngOnInit(): void {
    this.getAllRoomTypes();
  }

  getAllRoomTypes():void{
    this.roomTypeService.getAllRoomTypes().pipe(
      map(response => response.reverse()) // Reverse the data array
    )
    .subscribe((reversedData) => {
      this.listRoomTypes = reversedData;
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }


  showPopupUpdateRoomType(indexUpdate: number, motelID: string, roomTypeData: RoomType): void {
    this.indexRoomTypeUpdate = indexUpdate;
    this.isShowPopupUpdateRoomType= true
    this.motelID = motelID;   
    this.roomType = {...roomTypeData};
    const popupUpdateRoomType = document.getElementById('popupUpdateRoomType') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateRoomType && popupUpdateRoomType.classList.contains('hidden')){
      popupUpdateRoomType.classList.remove('hidden')
      popupUpdateRoomType.classList.add('flex')
    }
  }

  receiveNewRoomTypeFormUpdateRoomType(data: RoomType): void {
    this.listRoomTypes[this.indexRoomTypeUpdate] = data;
  }


  //Cảnh báo xác nhận xóa mềm loại phòng
  showSoftDeleteRoomTypeAlert(title: string, message: string, id: string, index: number) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true, 
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#babbbd', 
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.roomTypeService.softDeleteRoomTypeByID(id).subscribe({
            next: (response) => {
              this.listRoomTypes.splice(index, 1);
              this.alert.showSuccess('Xoá thành công!', 'Bạn đã xoá thành công loại phòng.')
            },
            error: (roleError) => {
              this.alert.showError('Lỗi khi xoá!', roleError.error.message);
            }
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          return;
      }
    });
  }

  handleOpenCollectionImage(index: number, indexMotel: number){
    this.isCollectionImageOpen = true;
    this.currentIndexRoomType = index;
    this.indexMotel = indexMotel;
  }

  handleCloseCollectionImage(){
    this.isCollectionImageOpen = false
  }

  nextImage(index:number): void {
    this.currentIndexRoomType = (this.currentIndexRoomType + 1) % this.listRoomTypes[index].ListImages.length;
  }

  prevImage(index:number): void {
    this.currentIndexRoomType = (this.currentIndexRoomType - 1 + this.listRoomTypes[index].ListImages.length) % this.listRoomTypes[index].ListImages.length;
  }
}
