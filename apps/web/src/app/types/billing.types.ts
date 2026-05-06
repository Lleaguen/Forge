export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';

export type SubscriptionStatus = 
  | 'ACTIVE' 
  | 'CANCELLED' 
  | 'PAST_DUE' 
  | 'UNPAID' 
  | 'TRIALING' 
  | 'INCOMPLETE' 
  | 'INCOMPLETE_EXPIRED';

export interface Subscription {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  stripeInvoiceId?: string;
  amountCents: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  paidAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageMetrics {
  projects: {
    current: number;
    limit: number;
  };
  users: {
    current: number;
    limit: number;
  };
  storage: {
    currentMB: number;
    limitMB: number;
  };
}

export interface PlanLimits {
  projects: number;
  users: number;
  storageMB: number;
  features: string[];
}

export interface UpgradeSuggestion {
  reason: string;
  suggestedPlan: SubscriptionPlan;
  benefits: string[];
}

export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalAmountCents: number;
  averageAmountCents: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}