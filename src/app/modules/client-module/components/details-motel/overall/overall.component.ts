import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Landlord } from 'src/app/interfaces/landlord';
import { Motel } from 'src/app/interfaces/motel';
import { LandlordService } from 'src/app/services/landlord.service';
import { MotelService } from 'src/app/services/motel.service';

@Component({
  selector: 'app-overall',
  templateUrl: './overall.component.html',
  styleUrls: ['./overall.component.css']
})
export class OverallComponent {
  motel: Motel ;
  landlord: Landlord;
  idMotel!: string;
  idLandlord!: string;

  //collection image
  isCollectionImageOpen = false;
  currentIndex = 0;
  constructor(private router: Router, private motelService: MotelService, private landlordService: LandlordService) {
    this.motel = {
      _id: '',
      NameMotel: '',
      Location: '',
      LandlordID: '',
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
      TotalStar: 0,
      CreateAt: '',
      CreateBy: null,
      UpdateAt: '',
      UpdateBy: null,
    };

    this.landlord = {
      _id: '',
      Email: '',
      LandlordName: '',
      Image: '',
      PhoneNumber: '',
      ListMotels: [],
      Address: '',
      CreateAt: '',
      UpdateAt: '',
      UpdateBy:  null,
    };
  }

  ngOnInit(): void {
   this.getIDMotelFormUrl();
   this.getDataMotel(this.idMotel);
   
  }

  getIDMotelFormUrl():void {
    const url = this.router.url
    const segments = url.split('/');
    this.idMotel = segments[segments.length - 2];
  }

  async getDataMotel(id: string): Promise<void> {
    try {
      const data = await firstValueFrom(this.motelService.getMotelByID(id));
      this.motel = data;
      this.getDataLandlord(data.LandlordID);
    } catch (error) {
      console.error('Error fetching motel data:', error);
    }
  }

  getDataLandlord(id: string) :void{
    this.landlordService.getLandlordByID(id).subscribe((data)=>{  
      this.landlord = data
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
}
