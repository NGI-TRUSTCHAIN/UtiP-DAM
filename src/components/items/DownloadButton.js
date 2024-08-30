import React from 'react';

const DownloadButton = ({
  children,
  className,
  type,
  file,
  fileName,
  disabled = false,
  loading = false,
}) => {
  const handleDownload = () => {
    if (type === 'text/csv' && !disabled && !!file) {
      const blob = new Blob([file], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleDownload}
      className={`btn ${disabled ? 'text-opacity-65 cursor-not-allowed' : ''} ${className}`}>
      {children || 'Download'}
      {loading && <span className="loading loading-spinner"></span>}
    </button>
  );
};

export default DownloadButton;
