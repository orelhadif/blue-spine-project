import * as path from 'node:path';
import * as fs from 'node:fs';
import pl from 'nodejs-polars';

const NUM_PATIENTS = 2000;
const MIN_CLAIMS_PER_PATIENT = 10;
const MAX_CLAIMS_PER_PATIENT = 100;
const MAX_INVOICES_PER_CLAIM = 5;
const OUTPUT_DIR = './data';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => +((Math.random() * (max - min)) + min).toFixed(2);

const firstNames = ['John', 'Mary', 'Alex', 'Sarah', 'Tom', 'Emily', 'Noah', 'Liam', 'Emma', 'Ava'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const randomName = () => `${firstNames[rand(0, firstNames.length - 1)]} ${lastNames[rand(0, lastNames.length - 1)]}`;

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  // Generate patients
  const patientsDF = pl.DataFrame({
    id: Array.from({ length: NUM_PATIENTS }, (_, i) => `P${i + 1}`),
    name: Array.from({ length: NUM_PATIENTS }, randomName),
  });

  // Generate claims and invoices
  const claimsRows: Array<{ claim_id: string; patient_id: string; date_of_service: string; num_invoices: number; rand_status: number }> = [];
  const invoicesRows: Array<{ invoice_id: string; claim_id: string; transaction_value: number }> = [];
  const invoiceTotals = new Map<string, number>();

  for (let i = 1; i <= NUM_PATIENTS; i++) {
    const patientId = `P${i}`;
    for (let j = 1; j <= rand(MIN_CLAIMS_PER_PATIENT, MAX_CLAIMS_PER_PATIENT); j++) {
      const claimId = `C${i}-${j}`;
      const numInvoices = rand(0, MAX_INVOICES_PER_CLAIM);
      let total = 0;

      for (let k = 1; k <= numInvoices; k++) {
        const value = randFloat(50, 500);
        invoicesRows.push({ invoice_id: `I${claimId}-${k}`, claim_id: claimId, transaction_value: value });
        total += value;
      }

      invoiceTotals.set(claimId, total);
      claimsRows.push({
        claim_id: claimId,
        patient_id: patientId,
        date_of_service: new Date(2024, rand(0, 11), rand(1, 28)).toISOString().split('T')[0],
        num_invoices: numInvoices,
        rand_status: Math.random(),
      });
    }
  }

  // Calculate claim amounts 
  const claimsDF = pl.DataFrame(
    claimsRows.map((c) => {
      const total = invoiceTotals.get(c.claim_id) || 0;
      let amount: number;

      if (c.num_invoices === 0) {
        amount = randFloat(100, 1000);
      } else if (c.rand_status < 0.3) {
        amount = +total.toFixed(2);
      } else if (c.rand_status < 0.55) {
        amount = +(total * (1 + randFloat(0.1, 0.5))).toFixed(2);
      } else {
        amount = +(total * (1 - randFloat(0.1, 0.5))).toFixed(2);
      }

      return { claim_id: c.claim_id, patient_id: c.patient_id, date_of_service: c.date_of_service, amount };
    })
  );

  const invoicesDF = pl.DataFrame(invoicesRows);

  // Write CSV files
  patientsDF.writeCSV(path.join(OUTPUT_DIR, 'patients.csv'), { quote: '"' });
  claimsDF.writeCSV(path.join(OUTPUT_DIR, 'claims.csv'), { quote: '"' });
  invoicesDF.writeCSV(path.join(OUTPUT_DIR, 'invoices.csv'), { quote: '"' });

  console.log(`✅ Generated: ${patientsDF.height} patients, ${claimsDF.height} claims, ${invoicesDF.height} invoices`);
}

main().catch(console.error);
