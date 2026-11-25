import React from 'react';

const ErrorBanner = ({ error, onRetry, title = 'Database Connection or Query Error' }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';

  return (
    <div className="my-4 p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 backdrop-blur-md shadow-lg animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-300">{title}</h4>
          <p className="text-xs text-red-200/90 mt-1 font-mono leading-relaxed">{message}</p>
          {error.details && (
            <pre className="mt-2 p-2 bg-black/40 rounded text-[11px] text-red-300 overflow-x-auto">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 transition-colors shrink-0"
          >
            Retry Query
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
