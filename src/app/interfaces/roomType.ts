import { Convenient } from "./convenient";
import { Images } from "./images";
import { Motel } from "./motel";


export interface RoomType {
    _id: string;
    MotelID: string | Motel;
    ListImages: Images[];
    Amount: number;
    Available: number;
    Area: number;
    Description: string;
    ListConvenient: Convenient[];
    Price: number;
    CreateAt: string;
    CreateBy: string;
    UpdateAt: string;
    UpdateBy: string;
    IsDelete: boolean;
  }