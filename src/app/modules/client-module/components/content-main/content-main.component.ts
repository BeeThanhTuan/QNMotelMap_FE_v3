import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private motelService: MotelService, private router: Router) {}

  ngOnInit(): void {
    this.countMotelsByWardCommune();
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
