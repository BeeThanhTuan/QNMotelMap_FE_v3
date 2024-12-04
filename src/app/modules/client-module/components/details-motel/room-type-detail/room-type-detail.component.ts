import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { response } from 'express';
import { Landlord } from 'src/app/interfaces/landlord';
import { Motel } from 'src/app/interfaces/motel';
import { RoomType } from 'src/app/interfaces/roomType';
import { LandlordService } from 'src/app/services/landlord.service';
import { MotelService } from 'src/app/services/motel.service';
import { RoomTypeService } from 'src/app/services/roomType.service';

@Component({
  selector: 'app-room-type-detail',
  templateUrl: './room-type-detail.component.html',
  styleUrls: ['./room-type-detail.component.css']
})
export class RoomTypeDetailComponent {
  idRoom!: string;
  idMotel!: string;
  roomType!: RoomType;
  motel!: Motel;
  //collection image
  isCollectionImageOpen = false;
  currentIndex = 0;
  constructor(private roomTypeService: RoomTypeService, private router: Router, private landlordService: LandlordService, private motelService: MotelService){
    
  }
  ngOnInit(): void {
    this.getIDRoomFormUrl();
    this.getIDMotelFormUrl()
    this.getListRoomTypeFormIDMotel(this.idRoom);
   }
 
  getInfoMotel():void{
    this.motelService.getMotelByID(this.idMotel).subscribe((response)=>{
      this.motel = response
    })
  }

  getIDRoomFormUrl():void {
    const url = this.router.url
    const segments = url.split('/');
    this.idRoom = segments[segments.length - 1];
  }

  getIDMotelFormUrl():void {
    const url = this.router.url
    const segments = url.split('/');
    this.idMotel = segments[segments.length - 3];
  }

  getListRoomTypeFormIDMotel(id: string): void {
    this.roomTypeService.getRoomTypeByIDRoomType(id).subscribe((data)=>{
      this.roomType = data  
      console.log(this.roomType);
      
    }) 
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
    this.currentIndex = (this.currentIndex + 1) % this.roomType.ListImages.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.roomType.ListImages.length) % this.roomType.ListImages.length;
  }
}
