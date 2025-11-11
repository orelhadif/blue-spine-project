# GraphQL Backend

## Quick Start

```bash
npm install
npm run dev
```

Runs on `http://localhost:8000/graphql` (or `PORT` env var).

## Scripts

- `npm run dev` - Development server (hot reload)
- `npm run build` - Production build
- `npm start` - Production server
- `npm test` - Run tests
- `npm test:watch` - Run tests in watch mode

## GraphQL API

**Endpoint:** `http://localhost:8000/graphql`

**queries:** `summary`, `reconciliation`  
**mutations:** `uploadClaimsFile`, `uploadInvoicesFile`, `clearData`

**File Upload:** Max 20MB, CSV format

## CSV Format

**Claims:** `claim_id`, `patient_id`, `date_of_service`, `amount`  
**Invoices:** `invoice_id`, `claim_id`, `transaction_value`

## Testing

Run unit tests:
```bash
npm test
```

Test coverage includes:
- CSV parsing and transformation
- Store management
- Reconciliation logic
- GraphQL resolvers

