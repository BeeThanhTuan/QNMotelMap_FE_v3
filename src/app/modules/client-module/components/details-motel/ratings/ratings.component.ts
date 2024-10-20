import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Motel } from 'src/app/interfaces/motel';
import { Rating } from 'src/app/interfaces/rating';
import { MotelService } from 'src/app/services/motel.service';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
})
export class RatingsComponent {
  ListRatings: Rating[] = [];
  motel: Motel;
  idMotel!: string;
  isRatingPopupShow = false;
  formRating!: FormGroup;
  constructor(
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
    this.getIDMotelFormUrl();
    this.getDataMotel(this.idMotel);
    this.getListRatings(this.idMotel);
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

  getListRatings(id: string): void {
    this.ratingService.getRatingsByIDMotel(this.idMotel).subscribe((data) => {
      this.ListRatings = data;
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
