import React, { useEffect, useState } from 'react';
import {
  authenticationActions,
  authenticationState,
} from '../store/authentication';
import { useDispatch, useSelector } from 'react-redux';

import Aos from 'aos';
import Cookies from 'universal-cookie';
import Footer from './defaultLayout/Footer';
import Loader from './items/Loader';
import MessageWithTimeout from './items/MessageWithTimeout';
import TagManager from 'react-gtm-module';
import { authenticateUserApiReq } from '../store/authentication/thunks';
import { useNavigate } from 'react-router-dom';

const Signup = ({
  hasAccount = true,
  onSubmitSuccess,
  showFooter = true,
  showBgImage = true,
  className,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  let hasToken = !!cookies.get('token');

  const authenticateStatus = useSelector(authenticationState.authStatus);
  const authenticationType = useSelector(authenticationState.authType);
  const authenticateData = useSelector(authenticationState.authData);

  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSigninSuccess, setShowSigninSuccess] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    Aos.init();
    TagManager.dataLayer({
      dataLayer: {
        page: 'signup/signin',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  useEffect(() => {
    if (hasToken) navigate('/');
  }, [hasToken, navigate]);

  useEffect(() => {
    dispatch(authenticationActions.initializeState());
  }, [dispatch]);

  useEffect(() => {
    setIsSignup(authenticationType === 'signup');
  }, [authenticationType]);

  useEffect(() => {
    setErrorMessage(false);
    setIsSignup(!hasAccount);
    setFormData(
      !hasAccount
        ? {
            email: '',
            password: '',
            confirmPassword: '',
          }
        : { username: '', password: '' }
    );
  }, [hasAccount]);

  useEffect(() => {
    if (authenticateStatus.ok) {
      setIsSubmitting(false);
      if (isSignup) {
        //Shows signup success and move to signin page
        setShowSignupSuccess(true);
        setIsSignup(false);
      } else {
        //signin success -> process onSubmitSuccess callback
        setUserDetails(authenticateData);
        setShowSigninSuccess(true);
        onSubmitSuccess && onSubmitSuccess();
      }
      dispatch(authenticationActions.initializeState({ key: 'auth' }));
    } else if (isSubmitting && authenticateStatus.error) {
      setFormData(
        isSignup
          ? { ...formData, password: '', confirmPassword: '' }
          : { username: '', password: '' }
      );
      setErrorMessage(authenticateStatus.message);
      setIsSubmitting(false);
    }
  }, [
    authenticateStatus,
    isSignup,
    isSubmitting,
    formData,
    onSubmitSuccess,
    authenticateData,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (isSignup && (name === 'password' || name === 'confirmPassword')) {
      if (name === 'confirmPassword' && value !== formData.password) {
        setErrorMessage('Passwords do not match');
      } else {
        setErrorMessage('');
      }
    }
  };

  const hasEmptyString = (obj) => {
    return Object.values(obj).some((value) => value === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(false);

    if (hasEmptyString(formData))
      return setErrorMessage('Please fill out all fields');
    else {
      setIsSubmitting(true);
      dispatch(
        authenticateUserApiReq({
          data: { ...formData },
          type: isSignup ? 'signup' : 'signin',
        })
      );
    }
  };

  const handleGoToDashboardClick = () => {
    navigate('/');
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setErrorMessage(false);
    setFormData(
      isSignup
        ? {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }
        : { username: '', password: '' }
    );
  };

  return !!formData ? (
    <div
      className={
        `flex items-center justify-center h-[93vh] ${showBgImage ? 'bg-deep-mind' : ''} overflow-hidden hero bg-center ` +
        className
      }>
      <div
        className={`w-screen h-full inline-flex justify-center p-0 m-0 ${showBgImage ? 'bg-base-200/50 items-center' : 'items-start'}`}>
        <div
          name="form-container"
          data-aos="zoom-in-down"
          data-aos-duration="500"
          className="max-w-md w-full bg-white px-10 py-8 rounded-lg shadow-lg">
          {showSignupSuccess && (
            <MessageWithTimeout
              timeout={5000}
              className="px-0 text-success font-semibold !important mb-4">
              Welcome aboard! Sign in to access your new account.
            </MessageWithTimeout>
          )}
          {showSigninSuccess && (
            <MessageWithTimeout
              timeout={false}
              className="px-0 text-primary-1400 font-semibold !important">
              <h6 className="text-sm">
                Welcome Back, {userDetails?.username ?? 'User'}!
              </h6>
              <p className="text-xl text-center mt-6">
                You're now logged in. Explore your personalized dashboard.
              </p>
              <button
                className="btn btn-primary w-full mt-6"
                onClick={() => handleGoToDashboardClick()}>
                Go to dashboard
              </button>
            </MessageWithTimeout>
          )}

          <>
            <div className="full-inline-between mb-6">
              <h2 className="text-2xl font-bold text-blue-600">
                {isSignup ? 'Create your account' : 'Sign in to your account'}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="text-sm opacity-70">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full border rounded px-3 py-2 input"
                  value={formData.username ?? ''}
                  onChange={handleChange}
                  placeholder="johnDoe"
                  autoFocus={isSignup}
                />
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label htmlFor="email" className="text-sm opacity-70">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email ?? ''}
                    onChange={handleChange}
                    placeholder="johnDoe@cs.co.il"
                    className="w-full border rounded px-3 py-2 input"
                    autoFocus={!isSignup}
                  />
                </div>
              )}
              <label htmlFor="password" className="text-sm opacity-70">
                Password
              </label>
              <div
                className={
                  isSignup
                    ? 'w-full inline-flex justify-between items-center gap-2'
                    : 'mb-4'
                }>
                <div className="w-full">
                  <input
                    type="password"
                    name="password"
                    value={formData.password ?? ''}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2 input"
                  />
                </div>
                {isSignup && (
                  <div className="w-full">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword ?? ''}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full border rounded px-3 py-2 input"
                    />
                  </div>
                )}
              </div>
              {isSignup && (
                <div className="flex w-full text-left text-xs mb-6 mt-1 px-1 opacity-65">
                  <label htmlFor="password">
                    * 8 characters min - upper, lower cases, letters and numbers
                  </label>
                </div>
              )}

              {!!errorMessage && (
                <p className="text-danger text-sm mb-1">
                  {errorMessage.message ??
                    errorMessage.error ??
                    errorMessage ??
                    'Error. Please try again.'}
                </p>
              )}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={authenticateStatus.loading || isSubmitting}>
                {isSignup ? 'Sign Up' : 'Sign in to your account'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                size="sm"
                className="ml-2 btn-link btn-secondary"
                onClick={toggleForm}
                disabled={authenticateStatus.loading || isSubmitting}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        </div>
      </div>
      {showFooter && <Footer float={true} />}
    </div>
  ) : (
    <Loader />
  );
};

export default Signup;
