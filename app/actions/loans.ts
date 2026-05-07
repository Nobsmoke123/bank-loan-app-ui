"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, normalizeErrorMessage } from "@/lib/api";
import { handleProtectedError, requireRole } from "@/lib/dal";
import type { Loan, MutationResult } from "@/lib/definitions";
import {
  LoanApplicationSchema,
  LoanRepaymentSchema,
  ProcessLoanSchema,
} from "@/lib/definitions";

function revalidateLoanViews(loanId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/loan-application");
  revalidatePath("/loan-processing");
  revalidatePath("/loan-repayment");
  revalidatePath("/loans");

  if (loanId) {
    revalidatePath(`/loans/${loanId}`);
  }
}

export async function applyForLoanAction(input: {
  amount: number;
  durationMonths: number;
}): Promise<MutationResult<Loan>> {
  await requireRole("CUSTOMER");

  const validatedFields = LoanApplicationSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please enter a valid amount and duration.",
    };
  }

  const result = await apiFetch<Loan>("/loans", {
    body: JSON.stringify(validatedFields.data),
    method: "POST",
  });

  if (!result.success) {
    if (result.error.statusCode === 401 || result.error.statusCode === 403) {
      await handleProtectedError(result.error);
    }

    return {
      success: false,
      message: normalizeErrorMessage(result.error.message),
    };
  }

  revalidateLoanViews(result.data.id);

  return {
    success: true,
    data: result.data,
  };
}

export async function repayLoanAction(input: {
  loanId: string;
  amount: number;
}): Promise<MutationResult<Loan>> {
  await requireRole("CUSTOMER");

  const validatedFields = LoanRepaymentSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please enter a valid repayment amount.",
    };
  }

  const result = await apiFetch<Loan>(
    `/loans/${validatedFields.data.loanId}/repay`,
    {
      body: JSON.stringify({ amount: validatedFields.data.amount }),
      method: "POST",
    },
  );

  if (!result.success) {
    if (result.error.statusCode === 401 || result.error.statusCode === 403) {
      await handleProtectedError(result.error);
    }

    return {
      success: false,
      message: normalizeErrorMessage(result.error.message),
    };
  }

  revalidateLoanViews(result.data.id);

  return {
    success: true,
    data: result.data,
  };
}

export async function processLoanAction(input: {
  loanId: string;
  status: "ACTIVE" | "REJECTED";
}): Promise<MutationResult<Loan>> {
  await requireRole("ADMIN");

  const validatedFields = ProcessLoanSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please choose a valid processing action.",
    };
  }

  const result = await apiFetch<Loan>(`/loans/${validatedFields.data.loanId}`, {
    body: JSON.stringify({ status: validatedFields.data.status }),
    method: "PATCH",
  });

  if (!result.success) {
    if (result.error.statusCode === 401 || result.error.statusCode === 403) {
      await handleProtectedError(result.error);
    }

    return {
      success: false,
      message: normalizeErrorMessage(result.error.message),
    };
  }

  revalidateLoanViews(result.data.id);

  return {
    success: true,
    data: result.data,
  };
}
