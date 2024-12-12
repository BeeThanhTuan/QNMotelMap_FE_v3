import { Convenient } from "./convenient";
import { Images } from "./images";


export interface RoomType {
    _id: string;
    MotelID: string;
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