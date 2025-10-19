import { SignupFormData } from '@/types/forms/auth';
import { RegisterRequest, UserRole } from '@/types/api/auth';

// Map signup form data to API register request
export const mapSignupFormToRegisterRequest = (
  formData: SignupFormData
): RegisterRequest => {
  // Map user type to role ID
  const roleId = formData.userType === 'customer' ? UserRole.CUSTOMER : UserRole.RENTER;

  return {
    fullName: formData.name,
    email: formData.email,
    passwordHash: formData.password, // Send plain password - backend will hash it
    roleId,
  };
};

// Validate signup form data
export const validateSignupForm = (formData: SignupFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push('Tên đầy đủ là bắt buộc');
  }

  if (!formData.email.trim()) {
    errors.push('Email là bắt buộc');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Email không hợp lệ');
  }

  // Only validate phone for renters, not customers
  if (formData.userType === 'renter' && !formData.phone.trim()) {
    errors.push('Số điện thoại là bắt buộc cho người cho thuê');
  }

  if (!formData.password) {
    errors.push('Mật khẩu là bắt buộc');
  } else if (formData.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push('Mật khẩu xác nhận không khớp');
  }

  if (!formData.agreeToTerms) {
    errors.push('Bạn phải đồng ý với điều khoản dịch vụ');
  }

  return errors;
};