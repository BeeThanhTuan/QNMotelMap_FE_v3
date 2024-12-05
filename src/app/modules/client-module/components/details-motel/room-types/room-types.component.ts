import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoomType } from 'src/app/interfaces/roomType';
import { RoomTypeService } from 'src/app/services/roomType.service';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent {
  idMotel!: string;
  listRoomTypes : RoomType[] = [] ;
  //collection image
  isCollectionImageOpen = false;
  indexRoomType = 0;
  indexRoomTypeUpdate = 0;
  currentIndex = 0;
  constructor(private router: Router, private roomTypeService: RoomTypeService) {}

  ngOnInit(): void {
    this.getIDMotelFormUrl();
    this.getListRoomFormIDMotel(this.idMotel);
    
   }
 
   getIDMotelFormUrl():void {
     const url = this.router.url
     const segments = url.split('/');
     this.idMotel = segments[segments.length - 2];
   }
 
  getListRoomFormIDMotel(id: string): void {
    this.roomTypeService.getRoomTypesByIDMotel(id).subscribe((data)=>{
      this.listRoomTypes = data  
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

}
