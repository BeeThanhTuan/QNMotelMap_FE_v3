import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RoomType } from '../interfaces/roomType';
@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  public getAllRoomTypes(): Observable<RoomType[]> {
    const url = `${this.REST_API_SERVER}/api/all-room-type`;
    return this.httpClient.get<RoomType[]>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public getRoomTypesByIDMotel(id: string): Observable<RoomType[]> {
    const url = `${this.REST_API_SERVER}/api/room-types/${id}`;
    return this.httpClient.get<RoomType[]>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public getRoomTypeByIDRoomType(id: string): Observable<RoomType> {
    const url = `${this.REST_API_SERVER}/api/room-type/${id}`;
    return this.httpClient.get<RoomType>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public addNewRoomType(data: FormData): Observable<RoomType> {
    const url = `${this.REST_API_SERVER}/api/room-type`;
    return this.httpClient.post<RoomType>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public updateInfoRoomType(id: string, data: FormData): Observable<RoomType> {
    const url = `${this.REST_API_SERVER}/api/room-type/${id}`;
    return this.httpClient.put<RoomType>(url, data).pipe(
      map((response:any) => response.data) 
    )
  }

  public softDeleteRoomTypeByID(id:string): Observable<RoomType>{
    const url = `${this.REST_API_SERVER}/api/soft-delete-room-type/${id}`;
    return this.httpClient.delete<RoomType>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public countRooms(): Observable<any> {
    const url = `${this.REST_API_SERVER}/api/count-rooms`;
    return this.httpClient.get<any>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
