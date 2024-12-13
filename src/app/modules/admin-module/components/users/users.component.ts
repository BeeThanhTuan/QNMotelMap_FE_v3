import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Motel } from 'src/app/interfaces/motel';
import { RoomType } from 'src/app/interfaces/roomType';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { MotelService } from 'src/app/services/motel.service';
import { RoomTypeService } from 'src/app/services/roomType.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  listUser: User[] = [];
  currentPage: number = 1;
  motel!: Motel;
  isShowPopupUpdateRoomType = false;
  indexUpdate!: number;
  indexUserUpdate!:number;
  motelID!:string;
  roomType!: RoomType;
  //collection image
  isCollectionImageOpen = false;
  indexUser = 0;
  constructor(private motelService: MotelService, private alert: AlertService, private userService: UserService){}

  ngOnInit(): void {
    this.getAllRoomTypes();
  }

  getAllRoomTypes():void{
    this.userService.getAllUsers().pipe(
      map(response => response.reverse()) // Reverse the data array
    )
    .subscribe((reversedData) => {
      this.listUser = reversedData;
      console.log(reversedData);
      
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }


  showPopupUpdateRoomType(indexUpdate: number, motelID: string, roomTypeData: RoomType): void {
    this.indexUserUpdate = indexUpdate;
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

  receiveNewRoomTypeFormUpdateRoomType(data: User): void {
    this.listUser[this.indexUserUpdate] = data;
  }


  //Cảnh báo xác nhận xóa mềm loại phòng
  showSoftDeleteUserAlert(title: string, message: string, id: string, index: number) {
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
        this.userService.softDeleteUserByID(id).subscribe({
            next: (response) => {
              this.listUser.splice(index, 1);
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

  handleOpenCollectionImage(indexUser: number){
    this.isCollectionImageOpen = true;
    this.indexUser = indexUser;
  }

  handleCloseCollectionImage(){
    this.isCollectionImageOpen = false
  }

  // nextImage(index:number): void {
  //   this.currentIndexRoomType = (this.currentIndexRoomType + 1) % this.listUser[index].ListImages.length;
  // }

  // prevImage(index:number): void {
  //   this.currentIndexRoomType = (this.currentIndexRoomType - 1 + this.listUser[index].ListImages.length) % this.listUser[index].ListImages.length;
  // }
}
