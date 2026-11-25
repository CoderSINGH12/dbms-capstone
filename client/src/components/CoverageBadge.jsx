import React from 'react';

const CoverageBadge = ({ coverage = 'verified', size = 'sm' }) => {
  const normalized = coverage?.toLowerCase() || 'verified';

  const styles = {
    verified: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Verified Data',
    },
    partial: {
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'Partial Data',
    },
    not_available: {
      bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      dot: 'bg-slate-400',
      label: 'Unavailable',
    },
  }[normalized] || {
    bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400',
    label: normalized,
  };

  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles.bg} ${sizeClass}`}
      title={`Data Status: ${styles.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  );
};

export default CoverageBadge;
