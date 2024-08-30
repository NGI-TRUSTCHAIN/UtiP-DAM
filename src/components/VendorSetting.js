/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {
  authenticationActions,
  authenticationState,
} from '../store/authentication';
import { useDispatch, useSelector } from 'react-redux';

import CountriesListSelect from './items/CountriesListSelect';
import { MdArrowRight } from 'react-icons/md';
import { SlideOver } from './items/SlideOver';
import { isEmpty } from 'lodash';

const TitleClass = 'font-semibold mb-1 text-sm text-slate-600 ';
const InputClass = 'input input-bordered mb-2 text-sm disabled:text-slate-400 ';
const VendorFormObject = {
  companyName: '',
  address: '',
  vatNo: '',
  registrationNo: '',
  fullName: '',
  email: '',
  accountNumber: '', //required
  accountName: '', //required
  bankName: '', //required
  bankSwiftCode: '',
  bankCountry: '',
};

const VendorSetting = ({ slideRef, isActive, onClose }) => {
  const dispatch = useDispatch();
  const vendorData = useSelector(authenticationState.VendorSettingsData);
  const vendorStatus = useSelector(authenticationState.VendorSettingsStatus);

  const [formData, setFormData] = useState(VendorFormObject);
  const [error, setError] = useState(false);
  const [updatingMode, setUpdatingMode] = useState(false);
  const [submitLabel, setSubmitLabel] = useState('Save');

  useEffect(() => {
    retrieveVendorSettingsData({ method: 'get' });
  }, []);

  useEffect(() => {
    if (updatingMode) setSubmitLabel('Save');
    else setSubmitLabel('Edit');
  }, [updatingMode]);

  useEffect(() => {
    if (vendorStatus.ok)
      if (!isEmpty(vendorData)) {
        setFormData({
          companyName: vendorData?.companyName ?? '',
          address: vendorData?.companyAddress ?? '',
          vatNo: vendorData?.companyVatNo ?? '',
          registrationNo: vendorData?.companyRegNo ?? '',
          fullName: vendorData?.contactName ?? '',
          email: vendorData?.contactEmail ?? '',
          accountNumber: vendorData?.accountNo ?? '',
          accountName: vendorData?.accountName ?? '',
          bankName: vendorData?.bankName ?? '',
          bankSwiftCode: vendorData?.swiftCode ?? '',
          bankCountry: vendorData?.country ?? '',
        });
        setSubmitLabel('Edit');
      } else {
        setSubmitLabel('Create and Save');
      }
    else if (vendorStatus.error) {
      setError(vendorStatus.error);
    }
  }, [vendorData, vendorStatus]);

  const retrieveVendorSettingsData = (values) => {
    dispatch(authenticationActions.vendorApiReq({ ...values }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitLabel !== 'Edit')
      retrieveVendorSettingsData({
        data: {
          accountNo: formData.accountNumber,
          accountName: formData.accountName,
          bankName: formData.bankName,
          swiftCode: formData.bankSwiftCode,
          companyName: formData.companyName,
          companyVatNo: formData.vatNo,
          companyRegNo: formData.registrationNo,
          companyAddress: formData.address,
          country: formData.bankCountry,
          contactName: formData.fullName,
          contactEmail: formData.email,
        },
        method: submitLabel.toLowerCase().includes('create') ? 'post' : 'put',
      });
    setUpdatingMode(!updatingMode);
  };

  return (
    <SlideOver
      ref={slideRef}
      title={
        <span className={'flex items-center'}>
          My Datasets <MdArrowRight size={22} />
          Vendor Settings
        </span>
      }
      open={isActive}
      onClose={() => onClose()}>
      <div className="container mx-auto px-4 py-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <h2 className={TitleClass}>Company Name</h2>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your company name"
              className={InputClass + 'w-full'}
              disabled={!updatingMode}
              required
            />
          </div>
          <div className="mb-2">
            <h2 className={TitleClass}>Registered Address</h2>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Company registered address"
              className={InputClass + 'w-full'}
              disabled={!updatingMode}
            />
          </div>
          <div className="mb-2 inline-flex gap-2 w-full">
            <div className="flex flex-col w-2/5">
              <h2 className={TitleClass}>Registration Number</h2>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                placeholder="Registration Number"
                className={InputClass}
                disabled={!updatingMode}
              />
            </div>
            <div className="flex flex-col w-1/4">
              <h2 className={TitleClass}>VAT Number</h2>
              <input
                type="text"
                name="vatNo"
                value={formData.vatNo}
                onChange={handleChange}
                placeholder="VAT Number"
                className={InputClass}
                disabled={!updatingMode}
              />
            </div>
          </div>
          <div className="my-2">
            <h2 className={TitleClass + 'flex w-full text-[16px]'}>
              Contact details for payments related matters
            </h2>
            <div className="mt-2 flex gap-2">
              <div className="flex flex-col w-1/2">
                <h2 className={TitleClass}>Full Name</h2>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Last Name, First Name"
                  className={InputClass}
                  disabled={!updatingMode}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <h2 className={TitleClass}>Email</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={InputClass}
                  disabled={!updatingMode}
                />
              </div>
            </div>
          </div>
          <div className="mb-2 flex gap-2">
            <div className="flex flex-col w-1/2">
              <h2 className={TitleClass}>Bank Account Number</h2>
              <input
                type="text"
                name="fullName"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder=""
                className={InputClass}
                disabled={!updatingMode}
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <h2 className={TitleClass}>Account Name</h2>
              <input
                type="text"
                name="email"
                value={formData.accountName}
                onChange={handleChange}
                placeholder=""
                className={InputClass}
                disabled={!updatingMode}
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col w-1/3">
              <h2 className={TitleClass}>Bank Name</h2>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder=""
                className={InputClass}
                disabled={!updatingMode}
                required
              />
            </div>
            <div className="flex flex-col w-1/3">
              <h2 className={TitleClass}>Bank Country</h2>
              <CountriesListSelect
                onSelect={handleChange}
                selectedValue={formData.bankCountry}
                disabled={!updatingMode}
              />
            </div>
            <div className="flex flex-col w-1/3">
              <h2 className={TitleClass}>Bank SWIFT Code</h2>
              <input
                type="text"
                name="bankSwiftCode"
                value={formData.bankSwiftCode}
                onChange={handleChange}
                placeholder=""
                className={InputClass}
                disabled={!updatingMode}
              />
            </div>
          </div>
          <div id="actions" className="inline-flex float-end gap-4 mt-4">
            <button className="btn btn-error btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${updatingMode ? 'btn-secondary' : 'btn-primary'} min-w-20 `}
              disabled={error || vendorStatus.loading}>
              {vendorStatus.loading ? 'Loading..' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </SlideOver>
  );
};

export default VendorSetting;
