import { Convenient } from "./convenient";
import { Images } from "./images";
import { Rating } from "./rating";
import { RoomType } from "./roomType";


export interface Motel {
    _id: string;
    NameMotel: string,
    Location: string;
    LandlordID: string;
    ListImages: Images[];
    Address: string;
    WardCommune: string;
    Description: string;
    ListConvenient: Convenient[];
    Price: number;
    LiveWithLandlord: boolean;
    ElectricityBill: number;
    WaterBill: number;
    WifiBill: number;
    ListRoomTypes: RoomType[] | null;
    ListRatings: Rating[];
    Distance: number;
    TotalStar:number;
    CreateAt: string;
    CreateBy: string | null;
    UpdateAt: string;
    UpdateBy: string | null;
  }