import { Motel } from "./motel";
import { User } from "./user";

export interface Landlord {
    _id: string;
    Email: string;
    LandlordName: string;
    Image: string;
    PhoneNumber: string;
    ListMotels: Motel[];
    Address: string;
    CreateAt: string;
    UpdateAt: string;
    UpdateBy: object | User | null;
    IsDelete: boolean,
  }