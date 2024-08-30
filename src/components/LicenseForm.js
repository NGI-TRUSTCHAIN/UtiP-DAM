/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {
  authenticationActions,
  authenticationState,
} from '../store/authentication';
import { useDispatch, useSelector } from 'react-redux';

import MessageWithTimeout from './items/MessageWithTimeout';
import { SlideOver } from './items/SlideOver';
import { TbFileCertificate } from 'react-icons/tb';
import { globalActions } from '../store/global';

const fieldClassName =
  'input input-md bg-slate-200 shadow-sm text-primary-1400 font-medium w-full my-3 ';

const LicenseForm = ({ isActive, onClose }) => {
  const dispatch = useDispatch();
  const myDatasetList = useSelector(authenticationState.myDatasetsData);
  const licenseStatus = useSelector(authenticationState.updateLicenseStatus);
  const [datasets, setDatasets] = useState([]);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let futureDate = false;
    if (formData?.monthLicense !== null) futureDate = true;

    dispatch(
      authenticationActions.licenseApiReq({
        data: { ...formData, futureDate: futureDate },
      })
    );
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? !formData[name] : value,
    });
  };

  useEffect(() => {
    dispatch(authenticationActions.initializeState({ key: 'update_license' }));
    dispatch(
      authenticationActions.myDatasetsApiReq({ params: { publish: true } })
    );

    setFormData({
      recipientEmail: '',
      datasetDefinitionId: '',
      pastDate: false,
      futureDate: false,
      monthLicense: null,
    });
  }, []);

  useEffect(() => {
    setDatasets(myDatasetList);
  }, [myDatasetList]);

  useEffect(() => {
    setEnableSubmit(
      formData?.recipientEmail !== '' && formData?.datasetDefinitionId !== ''
    );
  }, [formData]);

  useEffect(() => {
    if (licenseStatus.ok) {
      setFormData(null);
      setEnableSubmit(false);
      onClose();
      dispatch(
        globalActions.setToaster({
          message: 'The new license is successfully added',
          type: 'info',
        })
      );
    } else if (licenseStatus.error) {
      setMessage(licenseStatus.message);
    }
  }, [licenseStatus]);

  return (
    <SlideOver
      title={
        <span className={'flex items-center gap-1'}>
          Add New License
          <TbFileCertificate size={20} />
        </span>
      }
      open={isActive}
      onClose={() => onClose()}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Select Dataset</span>
          </div>
          <select
            name="datasetDefinitionId"
            className="select select-bordered"
            onChange={handleChange}
            defaultValue={'select'}
            required>
            <option
              disabled
              className="leading-loose text-text-muted"
              value={'select'}>
              Please select a dataset..
            </option>
            {datasets?.map((dataset, idx) => (
              <option key={idx} value={dataset.datasetDefinitionId}>
                {idx + 1}. {dataset.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="recipientEmail" className={'form-control w-full mt-2'}>
          <span className="label-text">
            Recipient's Email Address (must be same as their Utip-DAM account)
          </span>
          <input
            type="email"
            name="recipientEmail"
            className={fieldClassName}
            value={formData?.recipientEmail || ''}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>
        <div className="inline-flex w-full items-end gap-4">
          <label className="form-control w-2/3">
            <div className="label">
              <span className="label-text">Select License</span>
            </div>
            <select
              className="select select-bordered"
              name="monthLicense"
              onChange={handleChange}
              defaultValue="null"
              required>
              {[
                { label: '0 Month (no future data)', value: null },
                { label: '3 Months', value: 3 },
                { label: '6 Months', value: 6 },
                { label: '12 Months', value: 12 },
              ].map((license) => (
                <option key={license.value} value={license.value}>
                  {license.label}
                </option>
              ))}
            </select>
          </label>
          <div className="form-control w-1/3 flex items-center">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                name="pastDate"
                className="checkbox checkbox-info"
                onChange={handleChange}
              />
              <span className="label-text">Include Past Data</span>
            </label>
          </div>
        </div>
        <div className="mt-8 text-primary-dark">
          <h4 className="font-semibold mb-4">Warning</h4>
          <p className="text-sm text-justify">
            Creating this license will enable the selected user to access the
            dataset based on the license details inputted above, with no
            warranty for payment.
            <br />
            <br />
            <b>Notes</b>: you will still be able to delete this license in you
            Active Licenses tab.
          </p>
        </div>
        {message && (
          <MessageWithTimeout timeout={false} className="px-0 text-error">
            <div role="alert" className="font-semibold">
              <span>
                {typeof message === 'object'
                  ? Object.values(message).join(', ')
                  : message}
              </span>
            </div>
          </MessageWithTimeout>
        )}
        <div id="action" className="w-full inline-flex justify-end gap-6 mt-4">
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={() => {
              onClose();
            }}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={!enableSubmit}>
            Create License
          </button>
        </div>
      </form>
    </SlideOver>
  );
};

export default LicenseForm;
