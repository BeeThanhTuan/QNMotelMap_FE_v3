import { Motel } from "./motel";
export interface MotelFiltered {
    motelsWithoutLandlord: Motel[];  // Danh sách nhà trọ không chung chủ
    motelsWithin1km: Motel[];        // Danh sách nhà trọ trong vòng 1km
    convenientCounts: { [key: string]: number };  // Số lượng nhà trọ theo từng tiện ích
  }