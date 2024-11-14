import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoomType } from 'src/app/interfaces/roomType';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent {
  idMotel!: string;
  listRooms : RoomType[] = [] ;
  constructor(private router: Router, private roomService: RoomService) {}

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
    this.roomService.getRoomsByIDMotel(id).subscribe((data)=>{
      this.listRooms = data  
    }) 
   }
}
