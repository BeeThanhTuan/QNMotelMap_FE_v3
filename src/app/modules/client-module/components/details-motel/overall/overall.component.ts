import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Motel } from 'src/app/interfaces/motel';
import { FavoriteMotelsService } from 'src/app/services/favorite-motels.service';
import { MotelService } from 'src/app/services/motel.service';

@Component({
  selector: 'app-overall',
  templateUrl: './overall.component.html',
  styleUrls: ['./overall.component.css']
})
export class OverallComponent {
  motel: Motel ;
  idMotel!: string;
  listFavoriteMotels :Motel[] = [];
  //collection image
  isCollectionImageOpen = false;
  currentIndex = 0;
  constructor(private router: Router, private motelService: MotelService, 
    private favoriteMotelsService: FavoriteMotelsService, private message: NzMessageService) {
    this.motel = {
      _id: '',
      NameMotel: '',
      Location: '',
      ListImages: [], 
      Address: '',
      WardCommune: '',
      Description: '',
      ListConvenient: [],
      Price: 0,
      LiveWithLandlord: false,
      ElectricityBill: 0,
      WaterBill: 0,
      WifiBill: 0,
      ListRoomTypes: null,
      ListRatings: [],
      Distance: 0,
      LandlordName: '',
      PhoneNumberContact: '',
      AddressLandlord: '',
      TotalRating: 0,
      TotalAvailableRoom: 0,
      CreateAt: '',
      CreateBy: null,
      UpdateAt: '',
      UpdateBy: null,
      IsDelete: false,
    };
  }

  ngOnInit(): void {
   this.getIDMotelFormUrl();
   this.getDataMotel(this.idMotel);
   this.getFavoriteMotels();
  }

  getIDMotelFormUrl():void {
    const url = this.router.url
    const segments = url.split('/');
    this.idMotel = segments[segments.length - 2];
  }

  getDataMotel(id: string):void {
    this.motelService.getMotelByID(id).subscribe((response)=>{
      this.motel = response;
    })
  }


  handleViewOnMapSpecificallyMotel(location: string):void {
    this.router.navigate(['/client/home/map'], { 
      queryParams: { 
        locationSpecial: location,
      }
    });
  }

  getLayoutImageClass(imagesLength: number): string {
    if (imagesLength === 1) return 'one-image';
    if (imagesLength === 2) return 'two-images';
    if (imagesLength === 3) return 'three-images';
    return '';
  }

  handleOpenCollectionImage(index: number){
    this.isCollectionImageOpen = true
    this.currentIndex = index;
  }

  handleCloseCollectionImage(){
    this.isCollectionImageOpen = false
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.motel.ListImages.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.motel.ListImages.length) % this.motel.ListImages.length;
  }

  showMessage(type: string, message: string): void {
    this.message.create(type, message,{nzDuration: 3000});
  }


  isFavorited(motelId: string): boolean {
    return this.listFavoriteMotels.some((motel) => motel._id === motelId);
  }

  getFavoriteMotels():void{
    this.favoriteMotelsService.getFavoriteMotels().subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels;
      },
    })
  }

  addMotelIntoFavorites(id: string){
    this.favoriteMotelsService.addMotelIntoFavorites(id).subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels
        this.showMessage('success', 'Thêm nhà trọ vào danh sách yêu thích thành công.')
      },
      error: (error) => {
        this.showMessage('error', 'Bạn chưa đăng nhập.')
      }
    })
  }

  removeMotelFromFavorites(id: string) {
    this.favoriteMotelsService.removeMotelFormFavorites(id).subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels; // Cập nhật danh sách yêu thích
        this.showMessage('success', 'Xóa nhà trọ khỏi danh sách yêu thích thành công.');
      },
      error: (error) => {
        this.showMessage('error', error.error.message);
      }
    });
  }
}
