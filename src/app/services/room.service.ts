import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Room } from '../interfaces/room';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  public getRoomsByIDMotel(id: string): Observable<Room[]> {
    const url = `${this.REST_API_SERVER}/api/rooms/${id}`;
    return this.httpClient.get<Room[]>(url).pipe(
      map((response:any) => response.data) 
    )
  }

  public getRoomByIDRRoom(id: string): Observable<Room> {
    const url = `${this.REST_API_SERVER}/api/room/${id}`;
    return this.httpClient.get<Room>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
