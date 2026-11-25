import { runReconciliationAudit } from './reconcile.js';

const args = process.argv.slice(2);
const command = args[0] || '--audit';
const seasonId = parseInt(args[1] || '2', 10);

async function main() {
  console.log('[Import CLI] Starting import & audit pipeline...');
  if (command === '--audit' || command === '--reconcile') {
    await runReconciliationAudit(seasonId);
  } else {
    console.log('Available commands: --audit <seasonId>');
  }
  process.exit(0);
}

main().catch(err => {
  console.error('[Import CLI Error]:', err);
  process.exit(1);
});
