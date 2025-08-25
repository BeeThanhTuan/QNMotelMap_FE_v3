import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motel } from 'src/app/interfaces/motel';
import { Rating } from 'src/app/interfaces/rating';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MotelService } from 'src/app/services/motel.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail-motel',
  templateUrl: './detail-motel.component.html',
  styleUrls: ['./detail-motel.component.css']
})
export class DetailMotelComponent {
  motelID!: string;
  userID!:string;
  ListRatings : Rating[] = [];
  isOpenDrawer= false;
  motel: Motel;
  idMotel!: string;
  isRatingPopupShow = false;
  formRating!: FormGroup;
  isLogin = false;
  isRated = false;
  constructor(
    private route: ActivatedRoute,
    private motelService: MotelService,
    private ratingService: RatingService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
  ) {
    this.motel = {
      _id: '',
      NameMotel: '',
      Location: '',
      ListImages: [],
      Address: '',
      WardCommune: '',
      Description: '',
      ListConvenient: [],
      Price: 0,
      LiveWithLandlord: false,
      ElectricityBill: '',
      WaterBill: '',
      WifiBill: 0,
      ListRoomTypes: null,
      ListRatings: [],
      Distance: 0,
      TotalRating: 0,
      TotalAvailableRoom: 0,
      LandlordName: '',
      PhoneNumberContact: '',
      AddressLandlord: '',
      CreateAt: '',
      CreateBy: null,
      UpdateAt: '',
      UpdateBy: null,
      IsDelete: false,
    };
    this.formRating = this.formBuilder.group({
      star: [5],
      comment: ['',[Validators.required]]
    });
  }
  ngOnInit(): void {
    // Lấy id từ route
    this.route.params.subscribe(params => {
      this.motelID = params['id'];  // 'id' là tên tham số trong rout
    });

    this.authService.isLogin$.subscribe((isLogin) => {
      this.isLogin = isLogin;
    });

    this.authService.checkIsLogin();
    this.getIDUser()
    // Kiểm tra login khi component khởi tạo

    this.getListRatings(this.motelID);
    this.getDataMotel(this.motelID);

  }
  ngAfterViewInit(): void {

    
  }

  checkIsRated(motelID:string, userID:string):void{
      const data = {motelID , userID}
      this.ratingService.checkIsRated(data).subscribe({
        next: (response) => {
          this.isRated = response;
        }  
      })
  }

  getListRatings(id: string): void {
    this.ratingService.getRatingsByIDMotel(id).subscribe((data) => {
      this.ListRatings = data;
    });
  }

  get commentControl(){
    return this.formRating.get('comment');
  }

  openDrawer(): void {
    this.isOpenDrawer= true;
  }

  closeDrawer(): void {
    this.isOpenDrawer = false;
  }


  getDataMotel(id: string): void {
    this.motelService.getMotelByID(id).subscribe((data) => {
      this.motel = data;
    });
  }

  getIDUser() :void{
    const email = this.authService.getEmailFromToken();
    this.userService.getInfoUserByEmail(email).subscribe({
      next: (response) => {
        this.userID = response._id;
        this.checkIsRated(this.motelID, this.userID);
      },
      error: (roleError) => {
        console.log('Lỗi khi lấy thông tin!', roleError.error.message);
      }
    })
  }

  handleShowRatingPopup(): void {
    if(this.isLogin){
      this.isRatingPopupShow = true;
      setTimeout(() => {
        const commentInput = document.getElementById('commentInput') as HTMLInputElement;
        if (commentInput) {
          commentInput.focus();
        }
      }, 0);
    }
    else{
      this.showPopupLoginRegister();
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  showPopupLoginRegister(): void{
    const body = document.querySelector('body') as HTMLElement;
    const loginPopup = document.getElementById('loginPopup') as HTMLElement;
    body.style.overflow = "hidden"
    loginPopup.style.display = "flex";
  }

  async postNewRating(): Promise<void> {
    if (!this.formRating.valid) {
      return;
    }
    try {
      await this.getIDUser(); // Ensure the user ID is fetched asynchronously
      const { star, comment } = this.formRating.value;
      const userID = this.userID;
      const motelID = this.motelID;
      const data = { star, comment, motelID, userID };
  
      this.ratingService.postNewRating(data).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Đánh giá thành công!', 'Bạn đã đánh giá thành công nhà trọ.');
          this.ListRatings.push(response);
          this.isRatingPopupShow = false;
          this.formRating.get('comment')?.setValue('');
          const totalStars = this.motel.ListRatings.reduce((sum, rating) => sum + rating.Star, 0);
          this.motel.TotalRating = ((response.Star + totalStars) / (this.motel.ListRatings.length + 1));
          this.motel.ListRatings = this.ListRatings;
        },
        error: (error) => {
          this.alertService.showError('Đánh giá thất bại!', error.error.message);
        }
      });
    } catch (error) {
      console.error('Error fetching user ID:', error);
      this.alertService.showError('Lỗi', 'Không thể lấy thông tin người dùng.');
    }
  }
}
