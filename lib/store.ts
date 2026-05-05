// Simple in-memory store using localStorage for persistence

export type LoanStatus = "pending" | "active" | "completed" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  durationInMonths: number;
  status: LoanStatus;
  appliedAt: string;
  monthlyPayment: number;
  paidAmount: number;
}

const USERS_KEY = "loan_app_users";
const LOANS_KEY = "loan_app_loans";
const SESSION_KEY = "loan_app_session";

function isClient() {
  return typeof window !== "undefined";
}

export function getUsers(): User[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]) {
  if (!isClient()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getLoans(): Loan[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(LOANS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLoans(loans: Loan[]) {
  if (!isClient()) return;
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
}

export function getCurrentUser(): User | null {
  if (!isClient()) return null;
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (!isClient()) return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function registerUser(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already registered" };
  }
  const newUser: User = { id: crypto.randomUUID(), name, email, password };
  saveUsers([...users, newUser]);
  return { success: true };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, error: "Invalid email or password" };
  setCurrentUser(user);
  return { success: true, user };
}

export function applyForLoan(userId: string, userName: string, userEmail: string, amount: number, durationInMonths: number): Loan {
  const loans = getLoans();
  const interestRate = 0.12; // 12% annual
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, durationInMonths)) / (Math.pow(1 + monthlyRate, durationInMonths) - 1);
  const newLoan: Loan = {
    id: crypto.randomUUID(),
    userId,
    userName,
    userEmail,
    amount,
    durationInMonths,
    status: "pending",
    appliedAt: new Date().toISOString(),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    paidAmount: 0,
  };
  saveLoans([...loans, newLoan]);
  return newLoan;
}

export function updateLoanStatus(loanId: string, status: LoanStatus) {
  const loans = getLoans();
  const updated = loans.map((l) =>
    l.id === loanId ? { ...l, status: status === "active" ? "active" : status } : l
  );
  saveLoans(updated);
}

export function makeRepayment(loanId: string, amount: number): { success: boolean; error?: string } {
  const loans = getLoans();
  const loan = loans.find((l) => l.id === loanId);
  if (!loan) return { success: false, error: "Loan not found" };
  if (loan.status !== "active") return { success: false, error: "Loan is not active" };

  const totalAmount = loan.amount + loan.amount * 0.12 * (loan.durationInMonths / 12);
  const remaining = totalAmount - loan.paidAmount;
  const payment = Math.min(amount, remaining);
  const newPaid = loan.paidAmount + payment;
  const newStatus: LoanStatus = newPaid >= totalAmount ? "completed" : "active";

  const updated = loans.map((l) =>
    l.id === loanId ? { ...l, paidAmount: Math.round(newPaid * 100) / 100, status: newStatus } : l
  );
  saveLoans(updated);
  return { success: true };
}

export function getLoanStats(loans: Loan[]) {
  return {
    total: loans.length,
    pending: loans.filter((l) => l.status === "pending").length,
    active: loans.filter((l) => l.status === "active").length,
    completed: loans.filter((l) => l.status === "completed").length,
    rejected: loans.filter((l) => l.status === "rejected").length,
  };
}
