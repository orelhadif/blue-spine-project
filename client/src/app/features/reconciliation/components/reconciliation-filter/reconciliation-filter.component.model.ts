/**
 * Types for ReconciliationFilterComponent
 */

export type FilterField =
  | 'patient_id'
  | 'claim_id'
  | 'status'
  | 'claim_amount_above'
  | 'claim_amount_below';

export interface FilterChange {
  field: FilterField;
  value: string;
}

