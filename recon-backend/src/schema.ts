import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar Upload

  enum ReconciliationStatus {
    BALANCED
    OVERPAID
    UNDERPAID
    NA
  }

  type UploadResult {
    success: Boolean!
    message: String
  }

  type Summary {
    totalClaims: Int!
    balanced: Int!
    overpaid: Int!
    underpaid: Int!
    na: Int!
  }

  type ReconciliationRow {
    claim_id: ID!
    patient_id: ID!
    claim_amount: Float!
    invoices_total: Float
    status: ReconciliationStatus!
  }

  type Query {
    summary: Summary!
    reconciliation: [ReconciliationRow!]!
  }

  type Mutation {
    uploadClaimsFile(file: Upload!): UploadResult!
    uploadInvoicesFile(file: Upload!): UploadResult!
    clearData: UploadResult!
  }
`;
