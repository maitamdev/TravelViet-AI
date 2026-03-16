import { z } from 'zod';

// Vietnamese error messages
export const errorMessages = {
    required: 'Trường này là bắt buộc',
    email: 'Email không hợp lệ',
    minLength: (min: number) => `Tối thiểu ${min} ký tự`,
    maxLength: (max: number) => `Tối đa ${max} ký tự`,
    password: {
        min: 'Mật khẩu phải có ít nhất 8 ký tự',
        uppercase: 'Mật khẩu phải có ít nhất 1 chữ hoa',
        lowercase: 'Mật khẩu phải có ít nhất 1 chữ thường',
        number: 'Mật khẩu phải có ít nhất 1 số',
        special: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt',
    },
    phone: 'Số điện thoại không hợp lệ',
    url: 'URL không hợp lệ',
    date: 'Ngày không hợp lệ',
};

// Common validation schemas
export const validationSchemas = {
    email: z
        .string()
        .min(1, errorMessages.required)
        .email(errorMessages.email),

    password: z
        .string()
        .min(8, errorMessages.password.min)
        .regex(/[A-Z]/, errorMessages.password.uppercase)
        .regex(/[a-z]/, errorMessages.password.lowercase)
        .regex(/[0-9]/, errorMessages.password.number),

    strongPassword: z
        .string()
        .min(8, errorMessages.password.min)
        .regex(/[A-Z]/, errorMessages.password.uppercase)
        .regex(/[a-z]/, errorMessages.password.lowercase)
        .regex(/[0-9]/, errorMessages.password.number)
        .regex(/[^A-Za-z0-9]/, errorMessages.password.special),

    phone: z
        .string()
        .regex(/^(\+84|0)[0-9]{9,10}$/, errorMessages.phone),

    url: z
        .string()
        .url(errorMessages.url),

    requiredString: (fieldName: string) =>
        z.string().min(1, `${fieldName} ${errorMessages.required.toLowerCase()}`),

    optionalString: z.string().optional(),

    positiveNumber: z.number().positive('Số phải lớn hơn 0'),

    dateInFuture: z.date().refine(
        (date) => date > new Date(),
        'Ngày phải trong tương lai'
    ),
};

// Helper functions
export const validators = {
    isValidEmail: (email: string): boolean => {
        return validationSchemas.email.safeParse(email).success;
    },

    isValidPassword: (password: string): boolean => {
        return validationSchemas.password.safeParse(password).success;
    },

    isValidPhone: (phone: string): boolean => {
        return validationSchemas.phone.safeParse(phone).success;
    },

    getPasswordStrength: (password: string): 'weak' | 'medium' | 'strong' | 'very-strong' => {
        if (password.length < 8) return 'weak';
        if (password.length < 10) return 'medium';
        if (validationSchemas.strongPassword.safeParse(password).success) {
            return 'very-strong';
        }
        return 'strong';
    },
};

export function validateBudget(amount: number): string | null {
  if (amount < 0) return 'Ngan sach khong duoc am';
  if (amount > 100000000000) return 'Ngan sach qua lon';
  return null;
}

export function validateTripDates(start: string, end: string): string | null {
  if (new Date(end) < new Date(start)) return 'Ngay ket thuc phai sau ngay bat dau';
  const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
  if (days > 30) return 'Chuyen di toi da 30 ngay';
  return null;
}

export const tripValidation = {
  title: (v: string) => { if (!v.trim()) return 'Tên chuyến đi là bắt buộc'; if (v.length < 3) return 'Tối thiểu 3 ký tự'; if (v.length > 100) return 'Tối đa 100 ký tự'; return null; },
  destination: (v: string[]) => { if (!v.length) return 'Chọn ít nhất 1 điểm đến'; if (v.length > 10) return 'Tối đa 10 điểm đến'; return null; },
  travelers: (v: number) => { if (v < 1) return 'Ít nhất 1 người'; if (v > 50) return 'Tối đa 50 người'; return null; },
  budget: (v: number) => { if (v < 0) return 'Ngân sách không được âm'; if (v > 10000000000) return 'Ngân sách tối đa 10 tỷ VNĐ'; return null; },
};

export const commentValidation = {
  content: (v: string) => { if (!v.trim()) return 'Nội dung không được trống'; if (v.length < 2) return 'Tối thiểu 2 ký tự'; if (v.length > 1000) return 'Tối đa 1000 ký tự'; return null; },
};

export const profileValidation = {
  fullName: (v: string) => { if (!v.trim()) return 'Tên là bắt buộc'; if (v.length > 50) return 'Tối đa 50 ký tự'; return null; },
  homeCity: (v: string) => { if (v && v.length > 50) return 'Tối đa 50 ký tự'; return null; },
};