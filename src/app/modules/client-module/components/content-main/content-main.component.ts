import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Motel } from 'src/app/interfaces/motel';
import { MotelService } from 'src/app/services/motel.service';
interface ListMotelsByWardCommune{
  WardCommune: string,
  Count: number,
}

@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css'],
})
export class ContentMainComponent {
  listMotelsByWardCommune: ListMotelsByWardCommune[] = [];
  listTopMotels: Motel[] = []
  constructor(private motelService: MotelService, private router: Router) {}

  ngOnInit(): void {
    this.countMotelsByWardCommune();
    this.getTop8MotelsByRating();
  }

  getTop8MotelsByRating():void{
    this.motelService.getTop8MotelsByRating().subscribe(
      (response)=>{
        this.listTopMotels = response;
      }
    )
  }

  countMotelsByWardCommune(): void {
    this.motelService.countMotelsByWardCommune().subscribe((data) => {
      this.listMotelsByWardCommune = data;
    });
  }

  handleSearch(wardCommune: string){
    this.router.navigate(['/client/home/search'], { 
      queryParams: { 
        wardCommune: JSON.stringify(wardCommune),
      }
    });
  }
}
