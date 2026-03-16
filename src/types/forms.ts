// Form type definitions
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa').regex(/[a-z]/, 'Cần ít nhất 1 chữ thường').regex(/[0-9]/, 'Cần ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: 'Mật khẩu xác nhận không khớp', path: ['confirmPassword'] });

export const createTripSchema = z.object({
  title: z.string().min(3, 'Tên chuyến đi tối thiểu 3 ký tự').max(100, 'Tối đa 100 ký tự'),
  destination_provinces: z.array(z.string()).min(1, 'Chọn ít nhất 1 điểm đến'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  travelers_count: z.number().min(1, 'Ít nhất 1 người').max(50, 'Tối đa 50 người'),
  mode: z.enum(['solo', 'couple', 'family', 'friends']),
  total_budget_vnd: z.number().min(0, 'Ngân sách không được âm'),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(50, 'Tối đa 50 ký tự'),
  home_city: z.string().max(50, 'Tối đa 50 ký tự').optional(),
  travel_styles: z.array(z.string()).max(5, 'Tối đa 5 phong cách'),
  budget_min_vnd: z.number().min(0),
  budget_max_vnd: z.number().min(0),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Nội dung không được trống').max(1000, 'Tối đa 1000 ký tự'),
});

export const reportSchema = z.object({
  reason: z.string().min(10, 'Lý do phải có ít nhất 10 ký tự').max(500, 'Tối đa 500 ký tự'),
  target_type: z.enum(['user', 'itinerary', 'comment']),
  target_id: z.string().uuid(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTripFormInput = z.infer<typeof createTripSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ReportInput = z.infer<typeof reportSchema>;