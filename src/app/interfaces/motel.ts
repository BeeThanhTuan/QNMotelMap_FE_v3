import { Convenient } from "./convenient";
import { Images } from "./images";
import { Landlord } from "./landlord";
import { Rating } from "./rating";
import { Room } from "./room";
import { User } from "./user";

export interface Motel {
    _id: string;
    Location: string;
    LandlordID: object | Landlord;
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
    CreateBy: object | User | null;
    UpdateAt: string;
    UpdateBy: object | User | null;
  }