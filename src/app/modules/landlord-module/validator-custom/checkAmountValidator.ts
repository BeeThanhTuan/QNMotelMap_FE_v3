import { AbstractControl, ValidationErrors } from '@angular/forms';

export function checkAmountValidator(control: AbstractControl): ValidationErrors | null {
  const amount = control?.parent?.get('amount')?.value; 
  const available= control.value;

  if (!amount|| !available) {
    return null;
  }

  // Kiểm tra password và confirmPassword có khớp không
  if (amount < available) {
    return { larger: true }; // Nếu không khớp, trả về lỗi mismatch
  }

  return null; // Nếu khớp, return null (không có lỗi)
}

