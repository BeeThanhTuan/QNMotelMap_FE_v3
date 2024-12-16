import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { MotelService } from 'src/app/services/motel.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { RoleName } from 'src/app/services/roleEnum';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  listUser: User[] = [];
  filteredUsers: User[] = [];
  currentPage: number = 1;
  isShowPopupUpdateRoomType = false;
  isShowPopupAddUser = false;
  isShowPopupUpdateUser = false;
  indexUserUpdate!:number;
  user!: User;
  roleName = RoleName;
  //collection image
  isCollectionImageOpen = false;
  indexUser = 0;

  searchText = '';
  searchControl: FormControl = new FormControl('');
  constructor(private motelService: MotelService, private alert: AlertService, private userService: UserService){}

  ngOnInit(): void {
    this.getAllRoomTypes();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Đợi 300ms sau khi người dùng dừng nhập liệu
        distinctUntilChanged() // Chỉ phát tín hiệu khi giá trị thay đổi
      )
      .subscribe((value) => {
        this.searchText = value;
      });
  }

  getAllRoomTypes():void{
    this.userService.getAllUsers().pipe(
      map(response => response.reverse()) // Reverse the data array
    )
    .subscribe((reversedData) => {
      this.listUser = reversedData;  
      this.filteredUsers = reversedData; 
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }

  receiveNewUserFormUpdateUser(data: User): void {
    this.listUser[this.indexUserUpdate] = data;
  }

  receiveNewUserFormAddUser(data: User): void {
    this.listUser.unshift(data)
}


  //Cảnh báo xác nhận xóa mềm loại phòng
  showSoftDeleteUserAlert(title: string, message: string, email: string, index: number) {
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
        this.userService.softDeleteUserByEmail(email).subscribe({
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

  handleCloseCollectionImage():void{
    this.isCollectionImageOpen = false
  }

  showPopupAddUser():void{
    this.isShowPopupAddUser = true;
    const popupAddUser = document.getElementById('popupAddUser') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupAddUser && popupAddUser.classList.contains('hidden')){
      popupAddUser.classList.remove('hidden')
      popupAddUser.classList.add('flex')
    }
  }

  showPopupUpdateUser(indexUpdate: number, user: User):void{
    this.isShowPopupUpdateUser = true;
    this.indexUserUpdate = indexUpdate;
    this.user = {...user};
    const popupUpdateUser = document.getElementById('popupUpdateUser') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateUser && popupUpdateUser.classList.contains('hidden')){
      popupUpdateUser.classList.remove('hidden')
      popupUpdateUser.classList.add('flex')
    }
  }

  filterByRoleName(roleName: string): void {
    if (!roleName || roleName === 'All') {
      this.listUser = [...this.filteredUsers];
    } else {
      this.listUser = this.filteredUsers.filter(user => 
        user.RoleID.RoleName.toLocaleLowerCase().includes(roleName.toLocaleLowerCase())
      );
    }
  }


  
}
