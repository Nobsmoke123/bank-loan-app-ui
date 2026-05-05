import { apiFetch } from "./api";

export const login = async (email: string, password: string) => {
  return apiFetch("/auth/login", {
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  return apiFetch("/auth/register", {
    body: JSON.stringify({ name, email, password }),
    method: "POST",
  });
};

export const logout = async () => {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
};

export const profile = async () => {
  return apiFetch("/auth/me", {
    method: "GET",
  });
};

export const getLoans = async () => {
  return apiFetch("/loans", {
    method: "GET",
  });
};

export const getLoan = async (loan_id: string) => {
  return apiFetch(`/loans/${loan_id}`, {
    method: "GET",
  });
};

export const applyForLoan = async (
  amount: number,
  durationInMonths: number,
) => {
  return apiFetch("/loans", {
    method: "POST",
    body: JSON.stringify({ amount, durationInMonths }),
  });
};

export const processLoan = async (
  loan_id: string,
  status: "approved" | "rejected",
) => {
  return apiFetch(`loans/${loan_id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const repayLoan = async (loan_id: string, amount: number) => {
  return apiFetch(`loans/${loan_id}/repay`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};
