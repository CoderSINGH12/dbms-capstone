import { standingsService } from '../src/services/standingsService.js';

export const runReconciliationAudit = async (seasonId) => {
  console.log(`[Reconcile] Running mathematical audit for season ID ${seasonId}...`);
  const audit = await standingsService.reconcileStandings(seasonId);
  console.log(`[Reconcile] Audit Status: ${audit.summary.status}`);
  console.log(`[Reconcile] Exact Matches: ${audit.summary.exactMatches} / ${audit.summary.totalAudited}`);
  if (audit.summary.discrepancies > 0) {
    console.warn(`[Reconcile Warning] Found ${audit.summary.discrepancies} point/position discrepancies.`);
  }
  return audit;
};
