import React, { useRef, useState } from 'react';

import { FaFileCsv } from 'react-icons/fa6';
import { formattedNumber } from '../../utils/Helper';

const FileUploader = ({ onFileUploaded, maxFileSize = undefined }) => {
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [file, setFile] = useState(false);

  const handleFileChange = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onFileUploaded?.(file);
          setFile(file);
        };

        reader.readAsText(file);
      } else {
        setError('Invalid file type. Please select a CSV file.');
        setFile(false);
      }
    }
  };
  //*** Max file size: 5MB
  return (
    <div className="w-full flex flex-col gap-4 mx-2 justify-center items-center text-center text-sm text-slate-800 select-none">
      {file ? (
        <div id="file-info" className="grid gap-4 text-start">
          <div className="flex gap-3 items-center text-sm">
            <span className="font-semibold">File: {file?.name}</span>
            <span className="bg-slate-300 rounded px-2 shadow-sm font-semibold text-xs flex-shrink-0">
              {file?.size > 1024
                ? formattedNumber(file?.size / 1024 / 1024) + ' MB'
                : file?.size + ' Bytes'}
            </span>
          </div>
          <button
            className="btn btn-sm btn-ghost rounded-full border-sky-400 text-xs text-primary hover:bg-transparent hover:text-sky-700 hover:ring-1 hover:ring-sky-500"
            onClick={() => {
              setFile(false);
            }}>
            Replace File
          </button>
        </div>
      ) : (
        <>
          <div>
            <FaFileCsv
              className={`h-6 w-6 text-sky-600 ${
                !file ? 'animate-bounce' : ''
              }`}
            />
          </div>
          Upload CSV file here
          <label className="">
            <span className="sr-only">Choose File</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn btn-sm shadow-sm shadow-sky-600 border-0 rounded-full text-xs bg-sky-500 text-white p-2 hover:bg-transparent hover:text-sky-700 hover:ring-1 hover:ring-sky-500">
              Choose CSV File
            </button>
          </label>
          {error && (
            <div id="error" className="text-error font-medium" role="alert">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileUploader;
