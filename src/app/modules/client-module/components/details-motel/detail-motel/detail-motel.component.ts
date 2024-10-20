import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rating } from 'src/app/interfaces/rating';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-detail-motel',
  templateUrl: './detail-motel.component.html',
  styleUrls: ['./detail-motel.component.css']
})
export class DetailMotelComponent {
  motelId!: string;
  ListRatings : Rating[] = []
  constructor(private route: ActivatedRoute, private ratingService: RatingService) {}

  ngOnInit(): void {
    // Lấy id từ route
    this.route.params.subscribe(params => {
      this.motelId = params['id'];  // 'id' là tên tham số trong rout
    });
    
    this.getListRatings(this.motelId);
  }


  getListRatings(id: string): void {
    this.ratingService.getRatingsByIDMotel(id).subscribe((data) => {
      this.ListRatings = data;
    });
  }
}
