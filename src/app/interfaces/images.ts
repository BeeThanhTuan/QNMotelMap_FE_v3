import { Motel } from "./motel";
import { Room } from "./room";
export interface Images{
    _id: string;
    MotelID: string | Motel | null;
    RoomID: string | Room | null;
    LinkImage: string;
  }