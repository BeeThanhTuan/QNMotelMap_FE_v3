import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { Landlord } from 'src/app/interfaces/landlord';
import { Room } from 'src/app/interfaces/room';
import { LandlordService } from 'src/app/services/landlord.service';
import { MotelService } from 'src/app/services/motel.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent {
  idRoom!: string;
  idMotel!: string;
  room!: Room;
  landlord!: Landlord;
  //collection image
  isCollectionImageOpen = false;
  currentIndex = 0;
  constructor(private roomService: RoomService, private router: Router, private landlordService: LandlordService, private motelService: MotelService){
    this.landlord = {
      _id: '',
      Email: '',
      LandlordName: '',
      Image: '',
      PhoneNumber: '',
      Address: '',
      CreateAt: '',
      UpdateAt: '',
      UpdateBy:  null,
    }
  }
  ngOnInit(): void {
    this.getIDRoomFormUrl();
    this.getIDMotelFormUrl()
    this.getListRoomFormIDMotel(this.idRoom);
    this.getIDLandlordByIDMotel(this.idMotel)
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

  getIDLandlordByIDMotel(id: string): void{
    this.motelService.getMotelByID(id).subscribe((data)=>{
      this.getLandlordByID(data.LandlordID);
    })
  }
 
  getListRoomFormIDMotel(id: string): void {
    this.roomService.getRoomByIDRRoom(id).subscribe((data)=>{
      this.room = data  
      console.log(this.room);
      
    }) 
  }

  getLandlordByID(id: string): void {
    this.landlordService.getLandlordByID(id).subscribe((data)=>{
      this.landlord = data  
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
    this.currentIndex = (this.currentIndex + 1) % this.room.ListImages.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.room.ListImages.length) % this.room.ListImages.length;
  }
}
