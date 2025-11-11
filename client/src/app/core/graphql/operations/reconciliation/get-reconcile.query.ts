export const GET_RECONCILE = `
  query GetReconciliation {
    reconciliation {
      claim_id
      patient_id
      claim_amount
      invoices_total
      status
    }
  }
`;