import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().min(2, "Please select your country"),
});

export type SignupRequest = z.infer<typeof signupSchema>;

export const signupResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: z.object({
    pk: z.number(),
    username: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    country: z.string(),
  }),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;

export const otpSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  sessionId: z.string(),
});
export type OTPData = z.infer<typeof otpSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  uid: z.string(),
  token: z.string(),
  password1: z.string().min(8, "Password must be at least 8 characters"),
  password2: z.string(),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ForgotPasswordResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;

export const socialLoginSchema = z.object({
  provider: z.enum(["google", "facebook"]),
  token: z.string(),
});

export type SocialLoginRequest = z.infer<typeof socialLoginSchema>;

export const socialLoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  access: z.string().optional(),
  refresh: z.string().optional(),
});

export type SocialLoginResponse = z.infer<typeof socialLoginResponseSchema>;
