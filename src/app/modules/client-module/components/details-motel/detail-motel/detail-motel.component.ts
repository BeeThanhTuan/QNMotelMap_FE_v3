import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motel } from 'src/app/interfaces/motel';
import { Rating } from 'src/app/interfaces/rating';
import { MotelService } from 'src/app/services/motel.service';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-detail-motel',
  templateUrl: './detail-motel.component.html',
  styleUrls: ['./detail-motel.component.css']
})
export class DetailMotelComponent {
  motelId!: string;
  ListRatings : Rating[] = [];
  isOpenDrawer= false;
  motel: Motel;
  idMotel!: string;
  isRatingPopupShow = false;
  formRating!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private motelService: MotelService,
    private ratingService: RatingService,
    private formBuilder: FormBuilder,
  ) {
    this.motel = {
      _id: '',
      NameMotel: '',
      Location: '',
      LandlordID: '',
      ListImages: [],
      Address: '',
      WardCommune: '',
      Description: '',
      ListConvenient: [],
      Price: 0,
      LiveWithLandlord: false,
      ElectricityBill: 0,
      WaterBill: 0,
      WifiBill: 0,
      ListRooms: null,
      ListRatings: [],
      Distance: 0,
      TotalStar: 0,
      CreateAt: '',
      CreateBy: null,
      UpdateAt: '',
      UpdateBy: null,
    };
    this.formRating = this.formBuilder.group({
      star: [5],
      comment: ['']
    });
  }
  ngOnInit(): void {
    // Lấy id từ route
    this.route.params.subscribe(params => {
      this.motelId = params['id'];  // 'id' là tên tham số trong rout
    });
    
    this.getListRatings(this.motelId);
    this.getDataMotel(this.motelId);
  }

  getListRatings(id: string): void {
    this.ratingService.getRatingsByIDMotel(id).subscribe((data) => {
      this.ListRatings = data;
    });
  }

  openDrawer(): void {
    this.isOpenDrawer= true;
  }

  closeDrawer(): void {
    this.isOpenDrawer = false;
  }
  getIDMotelFormUrl(): void {
    const url = this.router.url;
    const segments = url.split('/');
    this.idMotel = segments[segments.length - 2];
  }

  getDataMotel(id: string): void {
    this.motelService.getMotelByID(id).subscribe((data) => {
      this.motel = data;
    });
  }

  handleShowRatingPopup(): void {
    this.isRatingPopupShow = true;
    setTimeout(() => {
      const commentInput = document.getElementById('commentInput') as HTMLInputElement;
      if (commentInput) {
        commentInput.focus();
      }
    }, 0);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
