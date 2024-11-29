import { AbstractControl, ValidationErrors } from '@angular/forms';

// Custom Validator đồng bộ cho confirmPassword
export function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control?.parent?.get('password')?.value; // Lấy giá trị của password
  const confirmPassword = control.value;

  // Nếu password không tồn tại hoặc confirmPassword không tồn tại, return null (không có lỗi)
  if (!password || !confirmPassword) {
    return null;
  }

  // Kiểm tra password và confirmPassword có khớp không
  if (password !== confirmPassword) {
    return { mismatch: true }; // Nếu không khớp, trả về lỗi mismatch
  }

  return null; // Nếu khớp, return null (không có lỗi)
}

