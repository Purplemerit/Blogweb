import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  avatar: z.string().url('Invalid avatar URL').nullable().optional().or(z.literal('')),
  website: z.string().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid website URL. Must start with http:// or https://'
  }).optional().nullable(),
  twitterHandle: z.string().max(50).optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid LinkedIn URL. Must start with http:// or https://'
  }).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ['newPassword'],
});

export const updateSettingsSchema = z.object({
  emailOnPublish: z.boolean().optional(),
  emailOnMilestone: z.boolean().optional(),
  emailWeeklyDigest: z.boolean().optional(),
  emailMonthlyReport: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
