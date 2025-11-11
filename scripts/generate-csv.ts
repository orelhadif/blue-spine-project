import * as path from "node:path";
import * as fs from "node:fs";
import pl from "nodejs-polars";
import { stringify } from "csv-stringify";

// CONFIG
const NUM_PATIENTS = 2000;
const MIN_CLAIMS_PER_PATIENT = 10;
const MAX_CLAIMS_PER_PATIENT = 100;
const MAX_INVOICES_PER_CLAIM = 5;
const OUTPUT_DIR = './data';

function saveCSV(filename: string, rows: any[], columns: string[]) {
  return new Promise<void>((resolve, reject) => {
    stringify(rows, { 
      header: true, 
      columns,
      quoted: true,
      quoted_empty: true
    }, (err, output) => {
      if (err) {
        reject(err);
        return;
      }
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), output, 'utf8');
      console.log(`✅ ${filename} written (${rows.length} records)`);
      resolve();
    });
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  // Generate patients DataFrame
  const patientsDF = pl.DataFrame({
    id: Array.from({ length: NUM_PATIENTS }, (_, i) => `P${i + 1}`),
    name: Array.from({ length: NUM_PATIENTS }, () => {
      const first = ['John', 'Mary', 'Alex', 'Sarah', 'Tom', 'Emily', 'Noah', 'Liam', 'Emma', 'Ava'];
      const last = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
    })
  });

  // Generate claims - expand patients with random number of claims each
  const claimsData: { claim_id: string; patient_id: string; date_of_service: string; amount: number }[] = [];
  for (let i = 1; i <= NUM_PATIENTS; i++) {
    const patientId = `P${i}`;
    const numClaims = Math.floor(Math.random() * (MAX_CLAIMS_PER_PATIENT - MIN_CLAIMS_PER_PATIENT + 1)) + MIN_CLAIMS_PER_PATIENT;
    for (let j = 1; j <= numClaims; j++) {
      const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString().split('T')[0];
      claimsData.push({
        claim_id: `C${i}-${j}`,
        patient_id: patientId,
        date_of_service: date,
        amount: +(Math.random() * 900 + 100).toFixed(2)
      });
    }
  }

  // Generate invoices - expand claims with random number of invoices each
  const invoicesData: { invoice_id: string; claim_id: string; transaction_value: number }[] = [];
  for (const claim of claimsData) {
    const numInvoices = Math.floor(Math.random() * (MAX_INVOICES_PER_CLAIM + 1));
    for (let k = 1; k <= numInvoices; k++) {
      invoicesData.push({
        invoice_id: `I${claim.claim_id}-${k}`,
        claim_id: claim.claim_id,
        transaction_value: +(Math.random() * 450 + 50).toFixed(2)
      });
    }
  }

  // Convert DataFrames to arrays for csv-stringify
  const patientsArray = patientsDF.toRecords();
  const claimsArray = claimsData;
  const invoicesArray = invoicesData;

  // Write CSV files with quoted format to match project format
  await Promise.all([
    saveCSV('patients.csv', patientsArray, ['id', 'name']),
    saveCSV('claims.csv', claimsArray, ['claim_id', 'patient_id', 'date_of_service', 'amount']),
    saveCSV('invoices.csv', invoicesArray, ['invoice_id', 'claim_id', 'transaction_value'])
  ]);
}

main().catch(console.error);
