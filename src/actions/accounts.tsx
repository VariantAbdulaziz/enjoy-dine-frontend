"use server";

import {
  signupSchema,
  otpSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/validations/accounts";
import { ActionError, unauthenticatedAction } from "@/lib/unsafe-action";
import { z } from "zod";
import { objectToSnake, objectToCamel } from "ts-case-convert";

export const signupAction = unauthenticatedAction
  .schema(signupSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/registration/",
        objectToSnake(parsedInput)
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Error signing up");
    }
  });

export const sendOTPAction = unauthenticatedAction
  .schema(otpSchema.pick({ phone: true }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post("/auth/send-otp/", objectToSnake(parsedInput));
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Failed to send OTP");
    }
  });

export const verifyOTPAction = unauthenticatedAction
  .schema(otpSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/verify-otp/",
        objectToSnake(parsedInput)
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("OTP verification failed");
    }
  });

export const confirmAccountAction = unauthenticatedAction
  .schema(z.object({ email: z.string(), key: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/registration/verify-email/",
        objectToSnake(parsedInput)
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Failed to confirm Email");
    }
  });

export const resendConfirmationEmailAction = unauthenticatedAction
  .schema(z.object({ email: z.string().email() }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/registration/resend-email/",
        objectToSnake(parsedInput)
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Failed to resend confirmation email");
    }
  });

export const loginAction = unauthenticatedAction
  .schema(loginSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post("/auth/login", objectToSnake(parsedInput));
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Login failed");
    }
  });

export const googleLoginAction = unauthenticatedAction
  .schema(
    z.object({
      accessToken: z.string(),
      idToken: z.string(),
      code: z.string().optional(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post("/google/", objectToSnake(parsedInput));
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Login failed");
    }
  });

export const forgotPasswordAction = unauthenticatedAction
  .schema(loginSchema.pick({ email: true }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/password/reset/",
        objectToSnake(parsedInput)
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Failed to send password reset email");
    }
  });

export const resetPasswordAction = unauthenticatedAction
  .schema(resetPasswordSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post(
        "/auth/password/reset/confirm/",
        objectToSnake({
          ...parsedInput,
          newPassword1: parsedInput.password1,
          newPassword2: parsedInput.password2,
        })
      );
      return objectToCamel(res.data);
    } catch {
      throw new ActionError("Password reset failed");
    }
  });
