import { Motel } from "./motel";
import { User } from "./user";

export interface Rating{
    _id: string;
    MotelId: object | Motel;
    Start: number;
    Comment: string;
    CreateAt: string;
    CreateBy: object  | User;
  }