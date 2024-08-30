/* eslint-disable import/no-webpack-loader-syntax */

import * as Yup from 'yup';

import { ErrorMessage, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';

import Cookies from 'universal-cookie';
import { FaArrowLeft } from 'react-icons/fa6';
import NoData from './items/NoData';
import Signup from './Signup';
import { SlideOver } from './items/SlideOver';
import TagManager from 'react-gtm-module';
import { getCountriesList } from '../utils/Helper';

const ShareDataset = ({ datasetFile, kValue, isActive, onClose }) => {
  const slideRef = useRef();
  const cookies = new Cookies();
  const navigate = useNavigate();
  let hasToken = !!cookies.get('token');

  const dispatch = useDispatch();

  const submitStatus = useSelector(datasetState.getCreateDatasetStatus);

  const [countriesList, setCountriesList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleOnCancel = (forceClose = false) => {
    dispatch(datasetActions.initializeState({ key: 'dataset_update' }));
    if (!forceClose) {
      if (cancelConfirmed) {
        setLoading(false);
        setError(false);
        setShareSuccess(false);
        onClose();
      } else setCancelConfirmed(false);
      setCancelConfirmed(!cancelConfirmed);
    } else {
      setLoading(false);
      setError(false);
      setShareSuccess(false);
      onClose();
    }
  };

  const handleSubmit = (values) => {
    dispatch(
      datasetActions.datasetUpdateApiReq({
        data: {
          file: datasetFile,
          dataset: {
            name: values.name,
            description: values.description,
            countryCode: values.country,
            city: values.city,
            organization: {
              name: values.organizationName,
              email: values.organizationEmail,
            },
            k: kValue,
            fee: values.fee,
            publish: values.publish,
          },
        },
        type: 'create',
      })
    );
  };

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'shareDataset',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });

    const fetchData = async () => {
      try {
        const resCountries = await getCountriesList();
        return resCountries;
      } catch (err) {}
    };
    fetchData().then((data) => setCountriesList(data));
  }, []);

  useEffect(() => {
    setIsAuthenticated(hasToken);
  }, [hasToken]);

  useEffect(() => {
    setLoading(submitStatus.loading);
    if (submitStatus.ok) setShareSuccess(true);
    else if (submitStatus.error)
      setError(
        typeof submitStatus.message === 'string' ? (
          submitStatus.message
        ) : (
          <span>
            Sorry, we encountered an error while processing your request to
            share the dataset. Please check your internet connection and try
            again. If the issue persists, please contact{' '}
            <a
              href="mailto:support@cs.co.il"
              className="underline underline-offset-2 hover:text-accent-dark">
              support
            </a>{' '}
            for assistance.
          </span>
        )
      );
  }, [submitStatus]);

  return (
    <SlideOver
      id="share-dataset"
      ref={slideRef}
      title={'Share Anonymized Dataset'}
      open={isActive}
      onClose={() => {
        onClose();
      }}>
      {shareSuccess ? (
        <div id="success-note-content" className="mx-4">
          <h3 className="text-xl">
            Congratulation! Your dataset is now available for the world to use!
          </h3>
          <div
            id="important-note"
            className="text-sm text-pretty leading-relaxed mt-8 px-6 py-10 border-l-4 rounded border-l-primary bg-primary/10">
            If you have chosen to monetize your dataset, please send your bank
            account details and company information (including: VAT number,
            registration number, address and registered name) by email to{' '}
            <a href="@mailto:contact@cs.co.il" className="link-primary">
              contact@cs.co.il
            </a>{' '}
            and we will issue invoices and wire transfer details every time your
            dataset is purchased via our marketplace.
            <br />
            <br />
            If you do not do this, no worries, we will send an email to the
            contact email entered at the previous step the first time someone
            purchases your dataset.
          </div>
          <button
            className="w-full btn btn-sm btn-square bg-slate-300 text-primary mt-8"
            onClick={() => handleOnCancel(true)}>
            Close
          </button>
        </div>
      ) : !isAuthenticated ? (
        <div className="p-4">
          <h4 className="text-md mb-6 font-bold text-2xl">
            <button
              className="btn btn-sm btn-ghost text-text-muted text-xs"
              onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>{' '}
            Login to securely share your data with others
          </h4>
          <Signup
            hasAccount={true}
            showFooter={false}
            showBgImage={false}
            onSubmitSuccess={() => {
              setIsAuthenticated(true);
            }}
          />
        </div>
      ) : (
        <div id="content" className="mx-4">
          <h2 className="font-bold text-xl">Dataset details</h2>
          <Formik
            name="share-dataset-form"
            initialValues={{
              name: '',
              description: '',
              country: '',
              city: '',
              organizationName: '',
              organizationEmail: '',
              fee: 0.0,
              isFree: false,
              publish: true,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              description: Yup.string().required('Description is required'),
              country: Yup.string()
                .notOneOf(['select'])
                .required('Country is required'),
              city: Yup.string().required(),
              organizationName: Yup.string().required(
                'Company name is required'
              ),
              organizationEmail: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
              isFree: Yup.boolean(),
              fee: Yup.number(),
              publish: Yup.boolean(),
              agreeToTerms: Yup.boolean().test('agreed', (value) => value),
            })}
            onSubmit={(values) => {
              handleSubmit(values);
            }}>
            {({
              values,
              isValid,
              dirty,
              handleChange,
              handleBlur,
              setFieldValue,
              submitting,
            }) => (
              <Form className="mt-2 flex flex-col gap-1">
                <label htmlFor="name" className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Dataset name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Dataset name"
                    className="input input-primary input-sm input-bordered w-full"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-error font-medium"
                  />
                </label>
                <label htmlFor="description" className="form-control">
                  <div className="label">
                    <span className="label-text">Dataset description</span>
                  </div>
                  <textarea
                    name="description"
                    className="textarea textarea-bordered textarea-primary h-12"
                    placeholder="Dataset description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-sm text-error font-medium"
                  />
                </label>
                <label
                  htmlFor="location"
                  className="form-control w-full inline">
                  <div className="label">
                    <span className="label-text">Dataset location</span>
                  </div>
                  <div
                    key="location"
                    className="inline-flex items-start w-full gap-4">
                    <span key="location-country" className="block w-1/3">
                      <select
                        name="country"
                        className="select select-sm select-primary w-full max-w-[15rem]"
                        defaultValue={'select'}
                        onChange={handleChange}
                        onBlur={handleBlur}>
                        <option
                          value={'select'}
                          disabled
                          className="leading-loose text-text-muted">
                          Select a country...
                        </option>
                        {countriesList?.map((item, idx) => (
                          <option
                            key={idx}
                            value={item.Two_Letter_Country_Code}
                            className="my-2">
                            {item.Country_Name}
                          </option>
                        ))}
                      </select>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-sm text-error font-medium"
                      />
                    </span>
                    <span key="city" className="block w-1/2">
                      <input
                        name="city"
                        type="text"
                        placeholder="City name"
                        className="input input-primary input-sm input-bordered w-full max-w-sm"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-sm text-error font-medium"
                      />
                    </span>
                  </div>
                </label>
                <label htmlFor="owner" className="form-control w-full inline">
                  <div className="label">
                    <span className="label-text">Dataset owner details</span>
                  </div>
                  <div className="inline-flex items-start w-full gap-4">
                    <span className="block w-1/3">
                      <input
                        id="owner"
                        name="organizationName"
                        type="text"
                        placeholder="Company Name"
                        className="input input-primary input-sm input-bordered w-full max-w-[15rem]"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="organizationName"
                        component="span"
                        className="text-sm text-error font-medium flex"
                      />
                    </span>
                    <span className="block w-1/2">
                      <input
                        id="owner"
                        name="organizationEmail"
                        type="email"
                        placeholder="Data protection officer email or contact email"
                        className="input input-primary input-sm input-bordered w-full max-w-sm "
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="organizationEmail"
                        component="span"
                        className="text-sm text-error font-medium "
                      />
                    </span>
                  </div>
                </label>
                <label htmlFor="fee" className="form-control w-full inline">
                  <div className="label">
                    <span className="label-text">
                      Dataset price{' '}
                      <span className="text-xs font-medium">
                        (price is TTC, in Euros)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-6">
                    <input
                      id="fee"
                      type="number"
                      name="fee"
                      defaultValue={values.fee}
                      disabled={values.isFree}
                      placeholder="e.g: 200"
                      className="input input-primary input-sm input-bordered w-1/2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <span className="inline-flex w-full self-center justify-start gap-1">
                      <span className="label-text">
                        Make available for free
                      </span>
                      <input
                        id="fee"
                        name="isFree"
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-sm"
                        checked={values.isFree}
                        onChange={(value) => {
                          setFieldValue('isFree', !values.isFree);
                        }}
                      />
                    </span>
                  </div>
                </label>
                <label
                  htmlFor="terms"
                  className="label cursor-pointer inline-flex items-center justify-start gap-2 mt-4">
                  <input
                    id="terms"
                    name="agreeToTerms"
                    required
                    type="checkbox"
                    className="checkbox checkbox-error border-2 checked:checkbox-secondary checkbox-sm"
                    onClick={(value) => {
                      setFieldValue(
                        'agreeToTerms',
                        value.target.value === 'on' || false
                      );
                    }}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="agreeToTerms"
                    component="div"
                    className="text-sm text-error font-medium"
                  />
                  <span className="label-text-alt">
                    I agree to the{' '}
                    <Link to="#" className="underline underline-offset-1">
                      terms and conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="#" className="underline underline-offset-1">
                      privacy policy
                    </Link>{' '}
                    of using this service. <br />
                    WARNING: Correlation Systems earns a 30% commission for each
                    premium dataset sold on its website.
                  </span>
                </label>
                {/* <label
                  htmlFor="shareTo"
                  className="label cursor-pointer inline-flex items-center justify-start gap-2">
                  <input
                    id="shareTo"
                    name="gaia"
                    type="checkbox"
                    className="checkbox checkbox-secondary checkbox-sm"
                    onClick={(value) => {
                      setFieldValue(
                        'publish',
                        value.target.value === 'on' || false
                      );
                    }}
                    onBlur={handleBlur}
                  />
                  <span className="label-text-alt">
                    Also share dataset on Gaia-X <br />
                    WARNING: Datasets distributed on Gaia-X will be available
                    for free download via the Gaia-X ecosystem.
                  </span>
                </label> */}
                {error && (
                  <NoData className="text-error font-medium" text={error} />
                )}
                <div
                  id="action-buttons"
                  className="w-full inline-flex justify-end gap-4 mt-4">
                  <button
                    type="reset"
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => handleOnCancel(true)}>
                    {cancelConfirmed
                      ? 'Click again to cancel the process'
                      : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !dirty || loading}
                    className="btn btn-sm btn-primary">
                    Share dataset via Utip-DAM
                    {loading && (
                      <span className="loading loading-spinner"></span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </SlideOver>
  );
};

export default ShareDataset;
