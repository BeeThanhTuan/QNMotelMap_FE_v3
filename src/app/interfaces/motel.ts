import { Convenient } from "./convenient";
import { Images } from "./images";
import { Rating } from "./rating";
import { RoomType } from "./roomType";


export interface Motel {
    _id: string;
    NameMotel: string,
    Location: string;
    ListImages: Images[];
    Address: string;
    WardCommune: string;
    Description: string;
    ListConvenient: Convenient[];
    Price: number;
    LiveWithLandlord: boolean;
    ElectricityBill: string;
    WaterBill: string;
    WifiBill: number;
    ListRoomTypes: RoomType[] | null;
    ListRatings: Rating[];
    Distance: number;
    TotalRating:number;
    TotalAvailableRoom: number;
    LandlordName: string;
    PhoneNumberContact: string;
    AddressLandlord:string;
    CreateAt: string;
    CreateBy: string | null;
    UpdateAt: string;
    UpdateBy: string | null;
    IsDelete: boolean;
  }