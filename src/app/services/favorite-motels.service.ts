import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FavoriteMotels } from '../interfaces/favoriteMotels';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMotelsService {

private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getFavoriteMotels(): Observable<FavoriteMotels> {
      const url = `${this.REST_API_SERVER}/api/favorite-motels`;
      return this.httpClient.get<FavoriteMotels>(url).pipe(
          map((response:any) => response.data) 
      )
  }

  public addMotelIntoFavorites(id:string): Observable<FavoriteMotels> {
    const url = `${this.REST_API_SERVER}/api/favorite-motel/${id}`;
    return this.httpClient.post<FavoriteMotels>(url, {}).pipe(
      map((response:any) => response.data) 
    )
  }

  public removeMotelFormFavorites(id:string): Observable<FavoriteMotels> {
    const url = `${this.REST_API_SERVER}/api/favorite-motel/${id}`;
    return this.httpClient.delete<FavoriteMotels>(url).pipe(
      map((response:any) => response.data) 
    )
  }
}
