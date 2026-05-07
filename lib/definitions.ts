import type { JWTPayload } from "jose";
import * as z from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "CUSTOMER"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoanStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "REJECTED",
  "COMPLETED",
]);
export type LoanStatus = z.infer<typeof LoanStatusSchema>;

export type AuthenticatedUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
};

export interface SessionPayload extends JWTPayload {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoanRepayment {
  amount: string;
  balance_after: string;
  created_at: string;
  id: string;
}

export interface LoanParty {
  name: string;
  email?: string;
  role?: UserRole;
  balance?: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: string;
  durationMonths: number;
  status: LoanStatus;
  admin_id: string | null;
  admin?: LoanParty | null;
  approved_at: string | null;
  completed_at: string | null;
  outstandingBalance: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  repayments?: LoanRepayment[];
  user?: LoanParty | null;
}

export interface DashboardStats {
  totalLoans: number;
  pendingLoans: number;
  activeLoans: number;
  rejectedLoans: number;
  completedLoans: number;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    message: string | string[];
    error: string;
    statusCode: number;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z.string().min(1, {
    error: "Password is required.",
  }),
});

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .trim(),
});

export const LoanApplicationSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ error: "Loan amount must be greater than 0." }),
  durationMonths: z.coerce
    .number()
    .int({ error: "Duration must be a whole number of months." })
    .positive({ error: "Duration must be greater than 0." }),
});

export const LoanRepaymentSchema = z.object({
  loanId: z.string().min(1, { error: "Loan id is required." }),
  amount: z.coerce
    .number()
    .positive({ error: "Repayment amount must be greater than 0." }),
});

export const ProcessLoanSchema = z.object({
  loanId: z.string().min(1, { error: "Loan id is required." }),
  status: z.enum(["ACTIVE", "REJECTED"]),
});

export type AuthFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type MutationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };
