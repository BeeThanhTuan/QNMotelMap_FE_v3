import { Convenient } from "./convenient";
import { Images } from "./images";
import { Rating } from "./rating";
import { Room } from "./room";


export interface Motel {
    _id: string;
    NameMotel: string,
    Location: string;
    LandlordID: object;
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
    ListRooms: Room[] | null;
    ListRatings: Rating[];
    Distance: number;
    TotalStar:number;
    CreateAt: string;
    CreateBy: string | null;
    UpdateAt: string;
    UpdateBy: string | null;
  }