import { Component } from '@angular/core';
import {  ActivatedRoute} from '@angular/router';
import { Landlord } from 'src/app/interfaces/landlord';
import { Motel } from 'src/app/interfaces/motel';
import { LandlordService } from 'src/app/services/landlord.service';
import { MotelService } from 'src/app/services/motel.service';

@Component({
  selector: 'app-motel-detail',
  templateUrl: './motel-detail.component.html',
  styleUrls: ['./motel-detail.component.css']
})
export class MotelDetailComponent {
  index!: number;
  landlord!:Landlord;
  idMotel!:string;
  motel: Motel = {
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
    LandlordName: '',
    PhoneNumberContact: '',
    AddressLandlord: '',
    Distance: 0,
    TotalRating: 0,
    TotalAvailableRoom: 0,
    CreateAt: '',
    CreateBy: null,
    UpdateAt: '',
    UpdateBy: null,
    IsDelete: false,
  };
  isShowPopupUpdateMotel = false;
  //collection image
  isCollectionImageOpen = false;
  currentIndex = 0;
  constructor(private route: ActivatedRoute, private motelService: MotelService, private landlordService: LandlordService) {
   }

  ngOnInit(): void {
    const motelID = this.route.snapshot.paramMap.get('id')!;
    const landlordID = this.route.snapshot.queryParamMap.get('landlordId')!;
    this.getDataLandlordByID(landlordID);
    this.getDataMotelByID(motelID);
    this.idMotel = motelID;
  }

  getDataMotelByID(id:string) :void{
    this.motelService.getMotelByID(id).subscribe({
      next: (response) => {
        this.motel = response;
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  getDataLandlordByID(id:string) :void{
    this.landlordService.getLandlordByID(id).subscribe({
      next: (response) => {
        this.landlord = response;
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  
  showPopupUpdateMotel(landlordData: any, motelData: any): void {
    this.isShowPopupUpdateMotel = true
    this.landlord = {...landlordData};
    this.motel = {...motelData};   
    const popupUpdateMotel = document.getElementById('popupUpdateMotel') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflow = 'hidden';
    if(popupUpdateMotel && popupUpdateMotel.classList.contains('hidden')){
      popupUpdateMotel.classList.remove('hidden')
      popupUpdateMotel.classList.add('flex')
    }
  }

  receiveNewMotelFormUpdateMotel(data: Motel): void {
    this.motel = data
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
}
