import { Images } from "./images";
import { Motel } from "./motel";
import { User } from "./user";

export interface Room {
    _id: string;
    MotelID: string | Motel;
    ListImages: Images[];
    Floor: number;
    Status: boolean;
    Description: string;
    ListConvenient: object[];
    Price: number;
    CreateAt: string;
    CreateBy: object | User | null;
    UpdateAt: string;
    UpdateBy: object | User | null;
  }