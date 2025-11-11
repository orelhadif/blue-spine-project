// Type definitions for reconciliation feature

export type ReconciliationStatus = 'BALANCED' | 'OVERPAID' | 'UNDERPAID' | 'NA';

export interface Summary {
  totalClaims: number;
  balanced: number;
  overpaid: number;
  underpaid: number;
  na: number;
}

export interface ReconciliationRow {
  claim_id: string;
  patient_id: string;
  claim_amount: number;
  invoices_total: number | null;
  status: ReconciliationStatus;
}

export interface UploadResult {
  success: boolean;
  message?: string;
}

