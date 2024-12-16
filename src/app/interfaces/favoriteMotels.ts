import { Motel } from "./motel";

export interface FavoriteMotels {
    _id: string;
    UserID: string;
    ListMotels: Motel[];
  }