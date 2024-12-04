import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  showSuccess(title:string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  showError(title:string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Thử lại'
    });
  }

  showWarning(title:string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  showInfo(message: string) {
    Swal.fire({
      title: 'Information',
      text: message,
      icon: 'info',
      confirmButtonText: 'Understood'
    });
  }
}
