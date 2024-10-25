import { Convenient } from "./convenient";
import { Images } from "./images";
import { Motel } from "./motel";
import { User } from "./user";

export interface Room {
    _id: string;
    MotelID: string | Motel;
    ListImages: Images[];
    Floor: number;
    Status: boolean;
    Area: number;
    Description: string;
    ListConvenient: Convenient[];
    Price: number;
    CreateAt: string;
    CreateBy: string;
    UpdateAt: string;
    UpdateBy: string;
  }