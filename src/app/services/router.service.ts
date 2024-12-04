import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private data: any = null;

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    const temp = this.data;
    this.data = null; // Clear data after retrieval
    return temp;
  }
}
