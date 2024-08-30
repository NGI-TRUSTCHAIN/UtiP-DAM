import { FaFileCsv } from 'react-icons/fa6';
import PayButton from '../../components/buttons/PayButton';
import React from 'react';

const CompaniesTools = () => {
  return (
    <div className={`bg-dataset bg-center bg-repeat h-[80vh]`}>
      <div className="bg-white-900/70 w-full h-full">
        <VerifyDataset />
        <AnonymizeDataset />
      </div>
    </div>
  );
};

const VerifyDataset = () => {
  return (
    <div
      name="check anonymity floater"
      className="z-40 animate-raise bg-white-900 absolute top-[15%] left-[23%] w-96 min-h-2/3 max-h-fit rounded-lg shadow-secondary-900 shadow-lg px-4 py-6 text-center overflow-auto">
      <div className="text-xl font-bold">Anonymity Verification</div>
      <p className="text-text-lightDark text-xs mt-3 text-center">
        Upload your own datasets below to audit your mobility dataset for risks
        of de-anonymization or profiling.
      </p>
      <div
        name="file input"
        className="min-h-[4rem] max-h-fit mt-4 mb-2 bg-neutral-content border-2 rounded-md flex items-center justify-center join join-vertical gap-1 py-3 text-xs text-blue-800">
        <FaFileCsv className="text-lg" />
        Drag and Drop the Files
        <div>OR</div>
        <button className="bg-blue-300 text-gray btn-primary rounded px-3 py-1 mt-4 hover:bg-secondary-500 hover:text-white">
          Browse Files
        </button>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary bg-blue-300 text-[0.6rem] text-primary-dark px-2 py-[2px] rounded hover:shadow-lg hover:ring-1 focus:ring-blue-400 focus:bg-blue-500">
          + New Dataset
        </button>
      </div>
      <div
        name="agree and submit"
        className="flex flex-col justify-between items-center mt-4">
        <div className="text-text-muted text-start text-balance text-xs mb-3">
          <div className="text-md text-gray-700 font-bold mb-1">Disclaimer</div>
          <input type="checkbox" className="checkbox-info" /> I understand that
          due to the intrinsic nature of mobility datasets, a risk remain that
          the anonymized dataset produced via this tool could expose an
          individual’s identity. I agree not to hold Correlation Systems or NGI
          Trustchain responsible for any consequences, thay may result from
          using this tool.
        </div>
        <PayButton textSize="xs">Payment →</PayButton>
        <div className="text-xs font-medium text-sky-500 px-1 py-1 rounded-xl">
          Worthwhile: €5/MB
        </div>
      </div>
    </div>
  );
};

const AnonymizeDataset = () => {
  return (
    <div
      name="check dataset anonymity floater"
      className="z-40 animate-raise-slow bg-white-900 absolute top-[15%] right-[23%] w-96 min-h-2/3 max-h-fit rounded-lg shadow-secondary-900 shadow-lg px-4 py-6 text-center overflow-auto">
      <div className="text-xl font-bold">Anonymize You Mobility Data</div>
      <p className="text-text-lightDark text-xs mt-3 text-center">
        Are you a mobility dataset owner with little to no expertise on mobility
        dataset anonymization ? Use our tool to anonymize your data, levering
        advance and peer-reviewed anonymization techniques.
      </p>
      <div
        name="file input"
        className="min-h-[4rem] max-h-fit my-4 bg-neutral-content border-2 rounded-md flex items-center justify-center join join-vertical gap-1 py-3 text-xs text-blue-800">
        <FaFileCsv className="text-lg" />
        Drag and Drop the Files
        <div>OR</div>
        <button className="bg-blue-300 text-gray btn-primary rounded px-3 py-1 mt-4 hover:bg-secondary-500 hover:text-white">
          Browse Files
        </button>
      </div>
      <div
        name="agree and submit"
        className="flex flex-col justify-between items-center">
        <div className="text-text-muted text-start text-balance text-xs mb-3">
          <div className="text-md text-gray-700 font-bold mb-1">Disclaimer</div>
          <input type="checkbox" className="checkbox-info" /> I understand that
          due to the intrinsic nature of mobility datasets, a risk remain that
          the anonymized dataset produced via this tool could expose an
          individual&apos;s identity. I agree not to hold Correlation Systems or
          NGI Trustchain responsible for any consequences, that may result from
          using this tool.
        </div>
        <PayButton textSize="xs">Payment →</PayButton>
        <div className="text-xs font-medium text-sky-500 px-1 py-1 rounded-xl">
          Worthwhile: €5/MB
        </div>
      </div>
    </div>
  );
};

export default CompaniesTools;
