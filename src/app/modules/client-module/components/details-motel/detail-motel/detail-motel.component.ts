import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-motel',
  templateUrl: './detail-motel.component.html',
  styleUrls: ['./detail-motel.component.css']
})
export class DetailMotelComponent {
  motelId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Lấy id từ route
    this.route.params.subscribe(params => {
      this.motelId = params['id'];  // 'id' là tên tham số trong rout
    });
  }
}
