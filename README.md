# Claims Reconciliation System

Full-stack application for uploading and reconciling medical claims and invoices.

## Quick Start

```bash
cd recon-backend
npm install
npm run dev
```
Runs on `http://localhost:8000/graphql` (or `PORT` env var).

**Frontend:**
```bash
cd client
npm install
npm start
```
Runs on `http://localhost:4200`.

## CSV Format

**Claims:** `claim_id`, `patient_id`, `date_of_service`, `amount`  
**Invoices:** `invoice_id`, `claim_id`, `transaction_value`

## Generate Test Data

To generate sample CSV files:

```bash
cd scripts
npm install
npx tsx generate-csv.ts
```

Generates `claims.csv`, `invoices.csv`, and `patients.csv` in `scripts/data/`.

## Testing

**Frontend:**
```bash
cd client
npm test
```

**Backend:**
```bash
cd recon-backend
npm test
```


