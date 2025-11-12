import type { ReconciliationRow } from '../types';
import { store } from './store';

/**
 * Reconciles all claims with their associated invoices.
 * Returns reconciliation rows with status: BALANCED, OVERPAID, UNDERPAID, or NA.
 */
export function reconcileAll(): ReconciliationRow[] {
  const rows: ReconciliationRow[] = [];
  for (const claim of store.claims.values()) {
    const invs = store.invoicesByClaim.get(claim.claim_id) ?? [];
    if (invs.length === 0) {
      rows.push({
        claim_id: claim.claim_id,
        patient_id: claim.patient_id,
        claim_amount: claim.amount,
        invoices_total: null,
        status: 'NA',
      });
      continue;
    }
    const total = invs.reduce((s, i) => s + (i.transaction_value || 0), 0);
    const roundedTotal = Number(total.toFixed(2));
    const roundedClaimAmount = Number(claim.amount.toFixed(2));
    let status: ReconciliationRow['status'] = 'BALANCED';
    if (roundedClaimAmount > roundedTotal) status = 'OVERPAID';
    else if (roundedClaimAmount < roundedTotal) status = 'UNDERPAID';

    rows.push({
      claim_id: claim.claim_id,
      patient_id: claim.patient_id,
      claim_amount: claim.amount,
      invoices_total: roundedTotal,
      status,
    });
  }
  return rows;
}
