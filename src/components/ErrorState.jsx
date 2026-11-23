import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon-wrapper">
        <AlertCircle className="w-10 h-10 text-rose-500" />
      </div>
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-message">
        {error || 'Unable to connect to FakeStore API. Please check your internet connection and try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-icon">
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
