import { Role } from "./role";

export interface User {
  _id: string;
  Email: string;
  Username: string;
  RoleID:  Role ;
  Address:string;
  Image: string;
  PhoneNumber: string;
  CreateAt: string;
  UpdateAt: string | null;
  UpdateBy: string;
  IsDelete: boolean;
}
