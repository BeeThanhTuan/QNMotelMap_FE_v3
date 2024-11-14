import { Motel } from "./motel";
import { RoomType } from "./roomType";
export interface Images{
    _id: string;
    MotelID: string | Motel | null;
    RoomID: string | RoomType | null;
    LinkImage: string;
  }