export interface User {
  _id: string;
  Email: string;
  Username: string;
  Password: string;
  RoleID: string;
  Image: string;
  PhoneNumber: string;
  CreateAt: string;
  UpdateAt: string | null;
  UpdateBy: object | User | null;
}
