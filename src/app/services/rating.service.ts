import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Rating } from '../interfaces/rating';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private REST_API_SERVER = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getRatingsByIDMotel(id: string): Observable<Rating[]> {
    const url = `${this.REST_API_SERVER}/api/ratings/${id}`;
    return this.httpClient.get<Rating[]>(url).pipe(
      map((response:any) => response.data.ListRatings) 
    )
  }
}
