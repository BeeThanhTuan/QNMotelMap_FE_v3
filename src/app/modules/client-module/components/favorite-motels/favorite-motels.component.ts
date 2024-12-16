import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Motel } from 'src/app/interfaces/motel';
import { FavoriteMotelsService } from 'src/app/services/favorite-motels.service';
import { MotelService } from 'src/app/services/motel.service';

@Component({
  selector: 'app-favorite-motels',
  templateUrl: './favorite-motels.component.html',
  styleUrls: ['./favorite-motels.component.css']
})
export class FavoriteMotelsComponent {
  listFavoriteMotels: Motel[] = []
  constructor(private favoriteMotelsService: FavoriteMotelsService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.getFavoriteMotels()
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
