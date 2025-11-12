import { parse } from 'csv-parse/sync';
import type { Claim, Invoice } from '../types';

/**
 * Validates and transforms raw CSV records into Claim objects.
 * Works with records parsed from streams or strings.
 */
export function transformClaims(rawRecords: Record<string, any>[]): Claim[] {
  return rawRecords
    .filter((r) => r.claim_id && r.patient_id && r.date_of_service && r.amount != null)
    .map((r) => ({
      claim_id: String(r.claim_id),
      patient_id: String(r.patient_id),
      date_of_service: String(r.date_of_service),
      amount: Number(r.amount),
    }));
}
/**
 * Validates and transforms raw CSV records into Invoice objects.
 * Works with records parsed from streams or strings.
 */
export function transformInvoices(rawRecords: Record<string, any>[]): Invoice[] {
  return rawRecords
    .filter((r) => r.invoice_id && r.claim_id && r.transaction_value != null)
    .map((r) => ({
      invoice_id: String(r.invoice_id),
      claim_id: String(r.claim_id),
      transaction_value: Number(r.transaction_value),
    }));
}
/**
 * Parses a CSV string and returns Claim objects.
 * Useful for testing or when you have CSV as a string.
 */
export function parseClaims(csvText: string): Claim[] {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, any>[];

  const required = ['claim_id', 'patient_id', 'date_of_service', 'amount'];
  for (const r of records) {
    for (const key of required) {
      if (!(key in r)) throw new Error(`claims.csv missing column: ${key}`);
    }
  }

  return transformClaims(records);
}

/**
 * Parses a CSV string and returns Invoice objects. */
export function parseInvoices(csvText: string): Invoice[] {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, any>[];

  const required = ['invoice_id', 'claim_id', 'transaction_value'];
  for (const r of records) {
    for (const key of required) {
      if (!(key in r)) throw new Error(`invoices.csv missing column: ${key}`);
    }
  }

  return transformInvoices(records);
}
