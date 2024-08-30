/* eslint-disable react-hooks/exhaustive-deps */

import { MdArrowRight, MdEdit } from 'react-icons/md';
import React, { useCallback, useEffect, useState } from 'react';
import {
  authenticationActions,
  authenticationState,
} from '../store/authentication';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';

import AnonymizeDataset from '../components/AnonymizeDataset';
import Cookies from 'universal-cookie';
import DatasetDetails from '../components/DatasetDetails';
import { DateTime } from 'luxon';
import DeleteConfirmModal from '../components/items/DeleteConfirmModal';
import DownloadDatePickerDialog from '../components/items/DownloadDatePickerDialog';
import { FaPlus } from 'react-icons/fa6';
import LicenseForm from '../components/LicenseForm';
import ListTable from '../components/items/ListTable';
import Loader from '../components/items/Loader';
import MessageWithTimeout from '../components/items/MessageWithTimeout';
import Modal from '../components/items/Modal';
import { Navigate } from 'react-router-dom';
import NoData from '../components/items/NoData';
import PurchasedDatasetDetails from '../components/PurchasedDatasetDetails';
import { RiShieldKeyholeFill } from 'react-icons/ri';
import { SlideOver } from '../components/items/SlideOver';
import TagManager from 'react-gtm-module';
import { TbFileCertificate } from 'react-icons/tb';
import VendorSetting from '../components/VendorSetting';
import { globalActions } from '../store/global';

const Account = () => {
  const cookies = new Cookies();
  let user = cookies.get('account');
  const loggedIn = useSelector(authenticationState.loggedIn);
  const cardContainerCss = 'flex flex-col justify-between';
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(authenticationActions.logout());
  }, [dispatch]);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'myAccount',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  if (loggedIn !== undefined && !loggedIn) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto py-6 lg:px-14 md:px-10 sm:px-0 xs:px-0 xs:max-w-[90%] md:w-5/6 sm:w-full">
      <h1 className="text-2xl text-primary-dark tracking-wide font-bold mb-4 items-center flex gap-3">
        Welcome, {user?.username ?? 'User'}
      </h1>
      <div id="main-wrapper" className="flex flex-col">
        <div className="md:flex sm:grid xs:grid gap-4">
          <AccountDetails
            user={user}
            className={'flex-1 ' + cardContainerCss}
            dispatch={dispatch}
            logout={logout}
          />
          <Purchases
            className={'md:flex-[2] sm:flex-1 ' + cardContainerCss}
            dispatch={dispatch}
          />
        </div>
        <div className="md:flex sm:grid xs:grid gap-4 mt-4">
          <MyDatasets
            className={'md:flex-[4] sm:flex-1' + cardContainerCss}
            dispatch={dispatch}
          />
          <OtherOptions
            className={'flex-1 h-max ' + cardContainerCss}
            dispatch={dispatch}
            logout={logout}
          />
        </div>
      </div>
    </div>
  );
};

const AccountDetails = ({ user, className, dispatch, logout }) => {
  const [updatingAccount, setUpdatingAccount] = useState(false);

  const [updateObject, setUpdateObject] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newAccDetails, setNewAccDetails] = useState(null);
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateAccountStatus = useSelector(
    authenticationState.accountUpdateStatus
  );
  const updatePasswordStatus = useSelector(
    authenticationState.passwordUpdateStatus
  );

  const handleResetForm = () => {
    setNewAccDetails(null);
    setUpdateObject(null);
    setError(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (updateObject === 'password') {
      dispatch(
        authenticationActions.updateAccountPasswordApiReq({
          data: { password: newPassword },
        })
      );
    }
    if (updateObject === 'username' || updateObject === 'email')
      dispatch(
        authenticationActions.updateAccountApiReq({
          data: { ...newAccDetails },
        })
      );
  };

  useEffect(() => {
    setLoading(updateAccountStatus.loading || updatePasswordStatus.loading);
    if (updateAccountStatus.error) setError(updateAccountStatus.message);
    else if (updatePasswordStatus.error) setError(updatePasswordStatus.message);
    else if (updateAccountStatus.ok || updatePasswordStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: updateObject + ' updated successfully. Please login again.',
          type: 'info',
        })
      );
      logout();
    }
  }, [
    updateAccountStatus,
    updatePasswordStatus,
    logout,
    updateObject,
    dispatch,
  ]);

  return (
    <div
      id="account-details"
      className={'bg-slate-50 rounded-box shadow-md flex ' + (className || '')}>
      <h2 className="bg-sky-100 text-lg font-semibold text-secondary-900 p-4 border-b  rounded-t-box">
        Account Details
      </h2>
      <div id="content-wrapper" className="px-5 flex-col h-full">
        <div className="pt-2">
          <div className="full-inline-between border-b p-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xs font-medium text-primary-dark">Username</dt>
            <dd className="mt-1 flex gap-4 justify-between items-center text-gray-700 sm:col-span-2 sm:mt-0">
              {user?.username}
              <button
                className="btn btn-xs btn-ghost btn-circle"
                onClick={() => {
                  setUpdatingAccount(true);
                  setUpdateObject('username');
                  setNewAccDetails({ username: '' });
                }}>
                <MdEdit />
              </button>
            </dd>
          </div>
        </div>
        <div className="full-inline-between p-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-xs font-medium text-primary-dark">Email</dt>
          <dd className="mt-1 flex gap-4 justify-between items-center text-gray-700 sm:col-span-2 sm:mt-0">
            {user?.email}
            <button
              className="btn btn-xs btn-ghost btn-circle"
              onClick={() => {
                setUpdatingAccount(true);
                setUpdateObject('email');
                setNewAccDetails({ email: '' });
              }}>
              <MdEdit />
            </button>
          </dd>
        </div>
      </div>
      <div className="border-t py-2 px-4 full-inline-between">
        <button
          className="btn btn-ghost btn-sm text-slate-400 hover:btn-outline"
          onClick={logout}>
          Logout
        </button>
        <button
          className="btn btn-ghost text-sky-700 btn-sm hover:btn-outline"
          onClick={() => {
            setUpdatingAccount(true);
            setUpdateObject('password');
            setNewPassword('');
            setConfirmPassword('');
          }}>
          Update Password <RiShieldKeyholeFill />
        </button>
      </div>
      {updatingAccount && (
        <SlideOver
          title={'Update ' + updateObject}
          open={updatingAccount}
          onClose={() => {
            setUpdatingAccount(false);
            handleResetForm();
          }}>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {errors !== null && (
              <MessageWithTimeout timeout={false} className="px-0 text-error">
                <div role="alert" className="text-error">
                  <span>
                    {typeof errors === 'object'
                      ? Object.values(errors).join(', ')
                      : errors}
                  </span>
                </div>
              </MessageWithTimeout>
            )}
            {updateObject === 'email' ? (
              <div id="update-email-form">
                <div className="mb-4">
                  <label
                    htmlFor="currentEmail"
                    className="block text-sm font-medium text-gray-700">
                    Current Email:
                  </label>
                  <input
                    type="text"
                    id="currentEmail"
                    value={user?.email}
                    readOnly
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="newEmail"
                    className="block text-sm font-medium text-gray-700">
                    New Email:
                  </label>
                  <input
                    type="email"
                    id="newEmail"
                    value={newAccDetails.email}
                    onChange={(e) =>
                      setNewAccDetails({ email: e.target.value })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
              </div>
            ) : updateObject === 'username' ? (
              <div id="update-username-form">
                <div className="mb-4">
                  <label
                    htmlFor="newUsername"
                    className="block text-sm font-medium text-gray-700">
                    New Username:
                  </label>
                  <input
                    type="text"
                    id="newUsername"
                    value={newAccDetails.username}
                    onChange={(e) =>
                      setNewAccDetails({ username: e.target.value })
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
              </div>
            ) : (
              updateObject === 'password' && (
                <div id="update-password-form">
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700">
                      New Password:
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700">
                      Confirm New Password:
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      required
                    />
                  </div>
                </div>
              )
            )}
            <button
              type="submit"
              className="btn btn-primary rounded px-4 py-2 bg-primary-600 w-full"
              disabled={loading}>
              {loading && <span className="loading loading-spinner" />}
              {loading ? 'loading...' : 'Update'}
            </button>
          </form>
        </SlideOver>
      )}
    </div>
  );
};

const Purchases = ({ className, dispatch }) => {
  const purchasesData = useSelector(authenticationState.myPurchasesData);
  const purchasesStatus = useSelector(authenticationState.myPurchasesStatus);
  const [showLicenseStatuses, setShowLicenseStatuses] = useState(false);
  const [licenseData, setLicenseData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);

  useEffect(() => {
    dispatch(authenticationActions.myPurchasesApiReq());
  }, []);

  useEffect(() => {
    if (purchasesStatus.ok) {
      setPurchases(
        purchasesData?.map((i) => {
          return {
            ...i,
            name: i.datasetName,
            extraContents: (
              <button
                id={i?.purchaseId}
                className="btn btn-circle btn-xs btn-ghost"
                onClick={() => {
                  setShowPurchaseDetails(i);
                }}>
                <MdArrowRight size={22} />
              </button>
            ),
          };
        })
      );
      setLicenseData(
        purchasesData?.map((i) => {
          return {
            dataset: i.datasetName,
            startDate: i.licenseStartDate,
            endDate: i.licenseEndDate,
            status: i.status?.toLowerCase(),
          };
        })
      );
    }
    setLoading(purchasesStatus.loading);
  }, [purchasesData, purchasesStatus]);

  return (
    <div
      id="purchases"
      className={'bg-slate-50 rounded-box shadow-md ' + (className || '')}>
      <h2 className="bg-sky-100 text-lg font-semibold text-secondary-900 p-4 border-b  rounded-t-box">
        My Purchases
      </h2>
      <div>
        <div id="datasets-list" className="px-6">
          <ListTable
            name="my-purchases-list"
            componentType="list"
            dataArray={purchases}
            rowsPerPage={2}
            loading={loading}
            noDataMessage="No datasets yet."
          />
        </div>
        <div
          id="footer-actions"
          className="px-6 border-t py-2 full-inline-between justify-end">
          <button
            className="btn btn-sm btn-ghost text-sky-700 w-auto"
            onClick={() => setShowLicenseStatuses(!showLicenseStatuses)}>
            License Statuses
            <TbFileCertificate size={20} />
          </button>
        </div>
      </div>
      {Boolean(showPurchaseDetails) && (
        <PurchasedDatasetDetails
          dataset={showPurchaseDetails}
          isActive={Boolean(showPurchaseDetails)}
          onClose={() => setShowPurchaseDetails(false)}
        />
      )}
      {showLicenseStatuses && (
        <SlideOver
          title="My Purchases > License Statuses"
          open={showLicenseStatuses}
          onClose={() => {
            setShowLicenseStatuses(false);
          }}>
          <div id="license-list" className="px-6 mt-2">
            {licenseData.length > 0 ? (
              <ListTable
                name="license-status"
                headers={['dataset', 'license start', 'license end', 'status']}
                dataArray={licenseData}
                rowsPerPage={10}
                loading={loading}
              />
            ) : loading ? (
              <Loader
                fixed={false}
                message={'loading..'}
                className="text-sm py-2"
              />
            ) : (
              <NoData
                className="text-slate-400 my-8"
                text={'No datasets yet.'}
              />
            )}
          </div>
        </SlideOver>
      )}
    </div>
  );
};

const MyDatasets = ({ className, dispatch }) => {
  const myDatasetList = useSelector(authenticationState.myDatasetsData);
  const datasetDetailsStatus = useSelector(datasetState.getDatasetStatus);
  const datasetDetailsData = useSelector(datasetState.getDatasetData);
  const datasetListStatus = useSelector(authenticationState.myDatasetsStatus);
  const downloadStatus = useSelector(datasetState.getDownloadDatasetStatus);
  const pendingList = useSelector(authenticationState.pendingLicensesData);
  const activeList = useSelector(authenticationState.activeLicensesData);
  const archivedList = useSelector(authenticationState.archivedLicensesData);
  const pendingStatus = useSelector(authenticationState.pendingLicensesStatus);
  const activeStatus = useSelector(authenticationState.activeLicensesStatus);
  const archivedStatus = useSelector(
    authenticationState.archivedLicensesStatus
  );
  const activateStatus = useSelector(authenticationState.activateLicenseStatus);
  const deactivateStatus = useSelector(
    authenticationState.deactivateLicenseStatus
  );

  const [tab, setTab] = useState('my_datasets');

  const [datasetDetails, setDatasetDetails] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [pendingLicenses, setPendingLicenses] = useState({
    headers: ['Date', 'Dataset', 'Username', 'Price', 'Payment', 'License'],
    data: [],
  });

  const [activeLicenses, setActiveLicenses] = useState({
    headers: [
      'Start Date',
      'End Date',
      'Dataset',
      'Username',
      'Purchase method',
    ],
    data: [],
  });
  const [archivedLicenses, setArchivedLicenses] = useState({
    headers: [
      'Start Date',
      'End Date',
      'Dataset',
      'Username',
      'Purchase method',
    ],
    data: [],
  });
  const [showDatasetSlider, setShowDatasetSlider] = useState(false);
  const [showNewDatasetSlideOver, setShowNewDatasetSlideOver] = useState(false);
  const [showNewLicenseSlideOver, setShowNewLicenseSlideOver] = useState(false);
  const [showVendorSetting, setShowVendorSetting] = useState(false);
  const [showLicenseDetails, setShowLicenseDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDatesToDownload, setSelectedDatesToDownload] = useState([]);
  const [downloadDatasetDetails, setDownloadDatasetDetails] = useState(null);

  const handleDownloadDataset = () => {
    if (selectedDatesToDownload.length > 0) {
      let datasetIds = [];
      selectedDatesToDownload.forEach((dates) => {
        const date = new Date(dates);
        const isoDate = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
        const selectedDatasetIdx = downloadDatasetDetails?.dates.findIndex(
          (i) => i === isoDate
        );
        const id = downloadDatasetDetails?.datasets[selectedDatasetIdx].id;
        datasetIds.push(id);
      });

      dispatch(
        datasetActions.mobilityDatasetDownloadApiReq({
          params: {
            datasetIds: datasetIds.join(','),
          },
          filename: downloadDatasetDetails?.name ?? undefined,
        })
      );
    }
  };

  const handleActivateLicense = (data) => {
    if (data?.datum?.id)
      dispatch(
        authenticationActions.licenseActivationApiReq({ id: data.datum.id })
      );
  };

  const handleDeactivateLicense = (data) => {
    if (data?.datum?.id)
      dispatch(
        authenticationActions.licenseDeactivationApiReq({ id: data.datum.id })
      );
  };

  const handleDeleteLicense = (data) => {
    if (data?.datum?.id)
      dispatch(
        authenticationActions.licenseDeleteApiReq({ id: data.datum.id })
      );
  };

  const handleViewDatasetDetails = (dataset) => {
    dispatch(
      datasetActions.datasetGetApiReq({ params: dataset.datasetDefinitionId })
    );
    setShowDatasetSlider(true);
  };

  const renderDatePicker = async (dataset) => {
    if (dataset) {
      try {
        const getDataset = await dispatch(
          datasetActions.datasetGetApiReq({
            params: dataset.datasetDefinitionId,
          })
        );
        if (getDataset?.payload?.data) {
          let datasetDates = getDataset.payload.data.datasets.map(
            (i) => i.fileDate
          );

          setDownloadDatasetDetails({
            ...dataset,
            datasets: getDataset.payload.data.datasets,
            dates: datasetDates,
          });
          document.getElementById('date-picker-modal')?.showModal();
        }
      } catch (error) {}
    }
  };

  const datasetOptions = [
    {
      text: 'Download dataset',
      onClick: (dataset) => {
        renderDatePicker(dataset);
      },
    },
    { text: 'View dataset details', onClick: handleViewDatasetDetails },
  ];

  const pendingLicenseOptions = [
    { text: 'Activate license', onClick: handleActivateLicense },
    { text: 'Modify details', onClick: (data) => setShowLicenseDetails(data) },
    { text: 'Delete', onClick: handleDeleteLicense },
  ];

  const activeLicenseOptions = [
    { text: 'Deactivate license', onClick: handleDeactivateLicense },
  ];

  const handleDatasetDetailsClose = () => {
    setShowDatasetSlider(false);
  };

  const handleVendorSettingClose = () => {
    setShowVendorSetting(false);
  };

  const retrieveMyDatasets = () => {
    dispatch(authenticationActions.myDatasetsApiReq());
  };

  const retrievePendingLicenses = () => {
    dispatch(
      authenticationActions.pendingLicensesApiReq({ params: { pending: true } })
    );
  };

  const retrieveActiveLicenses = () => {
    dispatch(
      authenticationActions.licensesApiReq({
        params: { active: tab === 'active_licenses' },
        type: tab === 'active_licenses' ? 'active' : 'archived',
      })
    );
  };

  useEffect(() => {
    if (tab === 'my_datasets') {
      retrieveMyDatasets();
    } else if (tab === 'pending_licenses') {
      retrievePendingLicenses();
    } else if (tab === 'active_licenses' || tab === 'archived_licenses') {
      retrieveActiveLicenses();
    }
  }, [tab]);

  useEffect(() => {
    setDatasetDetails(datasetDetailsData);
  }, [datasetDetailsData]);

  useEffect(() => {
    setLoading(datasetDetailsStatus.loading || datasetListStatus.loading);
  }, [datasetDetailsStatus, datasetListStatus]);

  useEffect(() => {
    if (downloadStatus.ok) {
      setSelectedDatesToDownload([]);
      setDownloadDatasetDetails([]);
      document.getElementById('date-picker-modal').close();
    }
  }, [downloadStatus]);

  useEffect(() => {
    if (activateStatus.ok || deactivateStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: activateStatus.ok
            ? 'The license has been activated.'
            : 'The license has been deactivated',
          type: 'info',
        })
      );
      dispatch(authenticationActions.initializeState({}));
      if (activateStatus.ok) retrievePendingLicenses();
      else retrieveActiveLicenses();
    } else if (activateStatus.error || deactivateStatus.error)
      dispatch(
        globalActions.setToaster({
          message: activateStatus.error
            ? 'The license activation is failed.'
            : 'The license deactivation is failed',
          type: 'error',
        })
      );
  }, [activateStatus, deactivateStatus]);

  useEffect(() => {
    setDatasets(
      myDatasetList?.map((i) => {
        return {
          ...i,
          extraContents: (
            <span className="text-slate-400 px-6 text-xs font-light ">
              Updated: {i.updatedOn}
            </span>
          ),
        };
      })
    );
  }, [myDatasetList]);

  useEffect(() => {
    setPendingLicenses({
      headers: pendingLicenses.headers,
      data: pendingList?.map((i) => {
        return {
          date: i?.transactionDate ?? '-',
          dataset: i?.datasetName ?? '-',
          username: i?.username ?? '-',
          price: '€' + i?.amount ?? 0,
          purchaseMethod: i?.purchaseMethod ?? '-',
          licenseDuration: i?.monthLicense + ' months' ?? '-',
          datum: i,
        };
      }),
    });
  }, [pendingList]);

  useEffect(() => {
    setActiveLicenses({
      headers: activeLicenses.headers,
      data: activeList?.map((i) => {
        return {
          startDate: i?.licenseStartDate ?? '-',
          endDate: i?.licenseEndDate ?? '-',
          dataset: i?.datasetName ?? '-',
          username: i?.username ?? '-',
          purchaseMethod: i?.purchaseMethod ?? '-',
          datum: i,
        };
      }),
    });
  }, [activeList]);

  useEffect(() => {
    setArchivedLicenses({
      headers: archivedLicenses.headers,
      data: archivedList?.map((i) => {
        return {
          startDate: i?.licenseStartDate ?? '-',
          endDate: i?.licenseEndDate ?? '-',
          dataset: i?.datasetName ?? '-',
          username: i?.username ?? '-',
          purchaseMethod: i?.purchaseMethod ?? '-',
        };
      }),
    });
  }, [archivedList]);

  const MyDatasetsTab = () => {
    return (
      <ListTable
        name="datasets-list"
        componentType="list"
        dataArray={datasets}
        options={datasetOptions}
        rowsPerPage={3}
        loading={loading}
        noDataMessage="No datasets yet."
      />
    );
  };

  const LicenseRelatedTab = () => {
    return (
      <ListTable
        name="licenses-table"
        componentType="table"
        headers={
          tab.includes('pending')
            ? pendingLicenses?.headers
            : tab.includes('active')
              ? activeLicenses.headers
              : archivedLicenses.headers
        }
        dataArray={
          tab.includes('pending')
            ? pendingLicenses?.data
            : tab.includes('active')
              ? activeLicenses.data
              : archivedLicenses.data
        }
        options={
          tab.includes('pending')
            ? pendingLicenseOptions
            : tab.includes('active')
              ? activeLicenseOptions
              : undefined
        }
        rowsPerPage={3}
        loading={
          pendingStatus.loading ||
          activeStatus.loading ||
          archivedStatus.loading
        }
        noDataMessage="No license found."
        containerClassName="bg-sky-100/30 "
      />
    );
  };

  return (
    <div
      id="my-datasets"
      className={
        'bg-slate-50 rounded-box shadow-md border-b ' + (className || '')
      }>
      <div
        role="tablist"
        className="tabs font-semibold border-b p-3 text-lg text-secondary-900 rounded-t-box bg-sky-100 justify-start">
        {[
          { label: 'My Datasets', value: 'my_datasets' },
          { label: 'Pending Licenses', value: 'pending_licenses' },
          { label: 'Active Licenses', value: 'active_licenses' },
          { label: 'Archived Licenses', value: 'archived_licenses' },
        ].map((item) => (
          <input
            key={item.value}
            type="radio"
            role="tab"
            name="datasets-licenses"
            value={item.value}
            className={`tab ${item.value === tab ? 'border-b-2' : ''}`}
            aria-label={item.label}
            onChange={(e) => {
              setTab(e.target.value);
            }}
            defaultChecked={item.value === 'my_datasets'}
          />
        ))}
      </div>
      <div id="my-dataset-content-wrapper" className="px-3">
        {tab === 'my_datasets' ? <MyDatasetsTab /> : <LicenseRelatedTab />}
        <div
          id="footer-actions"
          className="px-6 border-t py-4 full-inline-between">
          <button
            className="btn btn-sm btn-ghost text-primary-1400 w-50 disabled:bg-transparent"
            onClick={() => setShowVendorSetting(true)}
            disabled={tab !== 'my_datasets'}>
            Vendor Settings <MdArrowRight />
          </button>
          <button
            className="btn btn-sm bg-primary/20 w-50"
            onClick={() =>
              tab === 'my_datasets'
                ? setShowNewDatasetSlideOver(true)
                : setShowNewLicenseSlideOver(true)
            }>
            {tab === 'my_datasets' ? 'Add New Dataset' : 'Add New License'}
            {tab === 'my_datasets' ? (
              <FaPlus />
            ) : (
              <TbFileCertificate size={20} />
            )}
          </button>
        </div>
      </div>
      {showDatasetSlider && Object.keys(datasetDetails).length > 0 && (
        <DatasetDetails
          dataset={datasetDetails}
          isActive={showDatasetSlider}
          onClose={handleDatasetDetailsClose}
        />
      )}
      {showNewDatasetSlideOver && (
        <AnonymizeDataset onClose={() => setShowNewDatasetSlideOver(false)} />
      )}
      {showNewLicenseSlideOver && (
        <LicenseForm
          isActive={showNewLicenseSlideOver}
          onClose={() => setShowNewLicenseSlideOver(false)}
          datasets={datasets}
        />
      )}
      {showVendorSetting && (
        <VendorSetting
          isActive={showVendorSetting}
          onClose={handleVendorSettingClose}
        />
      )}
      {!!showLicenseDetails && (
        <LicenseDurationModal
          isOpen={!!showLicenseDetails}
          datasetId={showLicenseDetails?.datum?.id}
          datasetName={showLicenseDetails?.dataset}
          selectedLicense={showLicenseDetails?.datum?.monthLicense}
          onClose={() => {
            setShowLicenseDetails(false);
            retrievePendingLicenses();
          }}
        />
      )}
      <DownloadDatePickerDialog
        dataset={downloadDatasetDetails}
        loading={downloadStatus.loading}
        onSelectedDates={(dates) => setSelectedDatesToDownload(dates)}
        onDownload={() => handleDownloadDataset()}
      />
    </div>
  );
};

const LicenseDurationModal = ({
  isOpen,
  datasetId,
  datasetName,
  selectedLicense,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [license, setLicense] = useState(3);

  const modifyStatus = useSelector(authenticationState.updateLicenseStatus);

  const handleModifyLicense = () => {
    dispatch(
      authenticationActions.licenseApiReq({
        id: datasetId,
        data: { monthLicense: license },
        method: 'patch',
      })
    );
  };

  useEffect(() => {}, []);

  useEffect(() => {
    setLicense(selectedLicense);
  }, [selectedLicense]);

  useEffect(() => {
    if (modifyStatus.ok) {
      onClose();
      dispatch(
        globalActions.setToaster({
          message: 'The license details is updated.',
          type: 'info',
        })
      );
      dispatch(
        authenticationActions.initializeState({ key: 'update_license' })
      );
    }
  }, [modifyStatus]);

  return (
    <Modal
      id="modify-license"
      isOpen={isOpen}
      onClose={onClose}
      title=""
      closeOnClickOutside={false}>
      <div className="my-6 mx-8">
        <h2 className="font-semibold mb-4">
          Modify License Details{' > '}
          {datasetName}
        </h2>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Select License</span>
          </div>
          <select
            className="select select-bordered"
            name="monthLicense"
            onChange={(e) => {
              setLicense(e.target.value);
            }}
            defaultValue={selectedLicense}>
            {[
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
        <hr />
        <div className="text-red-700 my-2 text-sm">
          {modifyStatus?.error
            ? typeof modifyStatus?.message === 'string'
              ? modifyStatus.message
              : 'Error'
            : undefined}
        </div>
        <div className="mt-4 text-right">
          <button
            className="btn btn-primary w-full"
            onClick={handleModifyLicense}
            disabled={modifyStatus.loading}>
            {modifyStatus.loading ? 'Saving..' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const OtherOptions = ({ className, dispatch, logout }) => {
  const deActivateStatus = useSelector(authenticationState.deActivateStatus);
  const deleteStatus = useSelector(authenticationState.deleteAccountStatus);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const deActivate = (confirmDeactivate) => {
    if (confirmDeactivate) {
      dispatch(authenticationActions.initializeState({ key: 'de_activate' }));
      dispatch(authenticationActions.deActivateAccountApiReq());
    } else {
      setShowConfirmDialog('deactivate');
    }
  };
  const deleteAccount = (confirmDelete) => {
    if (confirmDelete) {
      dispatch(
        authenticationActions.initializeState({ key: 'delete_account' })
      );

      dispatch(authenticationActions.deleteAccountApiReq({}));
    } else setShowConfirmDialog('delete');
  };

  useEffect(() => {
    setLoading(deActivateStatus.loading);
    if (deActivateStatus.error) {
      const errors = deActivateStatus.message;
      if (errors)
        dispatch(
          globalActions.setToaster({
            message:
              typeof errors === 'object'
                ? Object.values(errors).join(', ')
                : errors,
            type: 'error',
          })
        );
    } else if (deActivateStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: 'Your account has been successfully deactivated.',
          type: 'info',
        })
      );
      logout();
    } else if (deleteStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: 'Your account has been successfully deleted.',
          type: 'info',
        })
      );
      logout();
    }
  }, [deActivateStatus, deleteStatus, dispatch, logout]);

  return (
    <div
      id="other-options"
      className={'bg-slate-50 rounded-box shadow-md ' + (className || '')}>
      <h2 className="bg-sky-100 rounded-t-box font-semibold text-lg text-secondary-900 p-4 border-b">
        Others
      </h2>
      <div id="content-container" className="px-4 my-6 grid gap-4">
        <div
          className="text-secondary btn btn-sm btn-outline btn-secondary text-center w-full"
          onClick={() => deActivate(false)}
          disabled={loading}>
          deactivate Account
        </div>
      </div>
      <div
        id="footer-actions"
        className="px-6 border-t py-4 full-inline-between">
        <div
          className="text-secondary btn btn-sm btn-outline btn-error text-center w-full"
          onClick={() => deleteAccount(false)}>
          Delete Account
        </div>
      </div>
      {showConfirmDialog && (
        <DeleteConfirmModal
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title={
            showConfirmDialog.includes('delete')
              ? 'Confirm Account Deletion'
              : 'Confirm Account Deactivation'
          }
          deleteLabel={
            showConfirmDialog.includes('delete')
              ? 'Yes, delete'
              : 'Yes, deactivate'
          }
          confirmMessage={
            showConfirmDialog.includes('delete')
              ? "Are you sure to delete the account? This action can't be undone. All your data will be permanently deleted."
              : 'Are you sure  you want to deactivate the account?'
          }
          confirmDelete={() =>
            showConfirmDialog.includes('delete')
              ? deleteAccount(true)
              : deActivate(true)
          }
        />
      )}
    </div>
  );
};

export default Account;
