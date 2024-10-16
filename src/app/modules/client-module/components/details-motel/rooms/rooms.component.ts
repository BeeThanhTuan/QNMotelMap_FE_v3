import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  idMotel!: string;
  listRooms : Room[] = [] ;
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
