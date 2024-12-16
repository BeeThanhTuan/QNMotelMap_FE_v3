import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Motel } from 'src/app/interfaces/motel';
import { FavoriteMotelsService } from 'src/app/services/favorite-motels.service';
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
  listFavoriteMotels: Motel[]= [];
  listTopMotels: Motel[] = []
  constructor(private motelService: MotelService, private router: Router,
     private favoriteMotelsService: FavoriteMotelsService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.countMotelsByWardCommune();
    this.getTop8MotelsByRating();
    this.getFavoriteMotels();
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
        this.showMessage('success', 'Thêm nhà nhà trọ vào danh sách yêu thích thành công.')
      },
      error: (error) => {
        this.showMessage('error', error.error.message)
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
