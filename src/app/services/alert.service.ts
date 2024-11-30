import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  showSuccess(message: string) {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonText: 'Ok'
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

  showWarning(message: string) {
    Swal.fire({
      title: 'Warning',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Got it!'
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
