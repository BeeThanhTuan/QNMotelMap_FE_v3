import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Motel } from 'src/app/interfaces/motel';
import { MotelService } from 'src/app/services/motel.service';

@Component({
  selector: 'app-view-motel-on-map',
  templateUrl: './view-motel-on-map.component.html',
  styleUrls: ['./view-motel-on-map.component.css']
})
export class ViewMotelOnMapComponent {
  @Input() idMotel!: string ;
  @Output() showPopupMotelOnMap = new EventEmitter<boolean>()
  motel: Motel = {
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
    ElectricityBill: 0,
    WaterBill: 0,
    WifiBill: 0,
    ListRoomTypes: null,
    ListRatings: [],
    LandlordName: '',
    PhoneNumberContact: '',
    AddressLandlord: '',
    Distance: 0,
    TotalRating: 0,
    TotalAvailableRoom: 0,
    CreateAt: '',
    CreateBy: null,
    UpdateAt: '',
    UpdateBy: null,
    IsDelete: false,
  };

  constructor(private motelService: MotelService){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['idMotel'] && this.idMotel !== null) {
      this.motelService.getMotelByID(this.idMotel).subscribe((response) => {
        this.motel = response;
      });
    }
  }

  handleHiddenPopupMotelOnMap():void {
    this.showPopupMotelOnMap.emit(false);
  }

}
