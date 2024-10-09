import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SetFieldSearchFilterService {

  constructor() { }

  private fieldSearchSubject = new BehaviorSubject<any>(null);
  fieldSearch$ = this.fieldSearchSubject.asObservable();

  setFieldSearch(data: any): void {
    this.fieldSearchSubject.next(null);  
    this.fieldSearchSubject.next(data);  
  }
}
