import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Motel } from 'src/app/interfaces/motel';
import { AuthService } from 'src/app/services/auth.service';
import { FavoriteMotelsService } from 'src/app/services/favorite-motels.service';
import { MotelService } from 'src/app/services/motel.service';
interface ListMotelsByWardCommune {
  WardCommune: string;
  Count: number;
}

@Component({
  selector: 'app-content-main',
  templateUrl: './content-main.component.html',
  styleUrls: ['./content-main.component.css'],
})
export class ContentMainComponent {
  listMotelsByWardCommune: ListMotelsByWardCommune[] = [];
  listFavoriteMotels: Motel[] = [];
  listTopMotels: Motel[] = [];
  constructor(
    private motelService: MotelService,
    private router: Router,
    private authService: AuthService,
    private favoriteMotelsService: FavoriteMotelsService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.countMotelsByWardCommune();
    this.getTop8MotelsByRating();
    this.getFavoriteMotels();
  }

  getTop8MotelsByRating(): void {
    this.motelService.getTop8MotelsByRating().subscribe((response) => {
      this.listTopMotels = response;
    });
  }

  countMotelsByWardCommune(): void {
    this.motelService.countMotelsByWardCommune().subscribe((data) => {
      this.listMotelsByWardCommune = data;
    });
  }

  handleSearch(wardCommune: string) {
    this.router.navigate(['/client/home/search'], {
      queryParams: {
        wardCommune: JSON.stringify(wardCommune),
      },
    });
  }

  showMessage(type: string, message: string): void {
    this.message.create(type, message, { nzDuration: 3000 });
  }

  isFavorited(motelId: string): boolean {
    return this.listFavoriteMotels.some((motel) => motel._id === motelId);
  }

  getFavoriteMotels(): void {
    this.favoriteMotelsService.getFavoriteMotels().subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels;
      },
    });
  }

  addMotelIntoFavorites(id: string) {
    this.authService.verifyToken().subscribe({
      next: (isValid) => {
        if (isValid) {
          this.favoriteMotelsService.addMotelIntoFavorites(id).subscribe({
            next: (response) => {
              this.listFavoriteMotels = response.ListMotels;
              this.showMessage(
                'success',
                'Thêm nhà trọ vào danh sách yêu thích thành công.'
              );
            },
            error: (error) => {
              this.showMessage('error', error.error.message);
            },
          });
        } else {
          this.showMessage(
            'error',
            'Vui lòng đăng nhập để thêm vào danh sách yêu thích.'
          );
        }
      },
      error: () => {
        this.showMessage('error', 'Không thể xác thực tài khoản.');
      },
    });
  }

  removeMotelFromFavorites(id: string) {
    this.favoriteMotelsService.removeMotelFormFavorites(id).subscribe({
      next: (response) => {
        this.listFavoriteMotels = response.ListMotels; // Cập nhật danh sách yêu thích
        this.showMessage(
          'success',
          'Xóa nhà trọ khỏi danh sách yêu thích thành công.'
        );
      },
      error: (error) => {
        this.showMessage('error', error.error.message);
      },
    });
  }
}
