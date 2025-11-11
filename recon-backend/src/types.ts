export type Claim = {
  claim_id: string;
  patient_id: string;
  date_of_service: string;
  amount: number;
};

export type Invoice = {
  invoice_id: string;
  claim_id: string;
  transaction_value: number;
};

export type ReconciliationRow = {
  claim_id: string;
  patient_id: string;
  claim_amount: number;
  invoices_total: number | null;
  status: 'BALANCED' | 'OVERPAID' | 'UNDERPAID' | 'NA';
};
