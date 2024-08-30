import React, { useEffect, useState } from 'react';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';

import MessageWithTimeout from './items/MessageWithTimeout';
import { SlideOver } from './items/SlideOver';
import TagManager from 'react-gtm-module';

const IssueReportForm = ({ dataset, isActive, onClose }) => {
  const dispatch = useDispatch();
  const emailSendStatus = useSelector(datasetState.getEmailSendStatus);

  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    message: '',
  });
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ownerDetails?.email)
      dispatch(
        datasetActions.emailSendApiReq({
          data: {
            name: formData.name,
            contactEmail: formData.email,
            recipientEmail: ownerDetails.email,
            subject: formData.subject,
            message: formData.message,
          },
        })
      );
  };

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'issueReportToDatasetOwner',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  useEffect(() => {
    if (dataset?.datasetOwner) {
      setOwnerDetails(dataset.datasetOwner);
    }
  }, [dataset]);

  useEffect(() => {
    setSending(emailSendStatus.loading);
    setSentSuccess(emailSendStatus.ok);
    if (emailSendStatus.ok) {
      setFormData({
        subject: '',
        name: '',
        message: '',
        email: '',
      });
      setTimeout(() => {
        setSending(false);
        setSentSuccess(false);
      }, 3000);
    }
  }, [emailSendStatus]);

  return (
    <SlideOver
      title={'Dataset Issue Report'}
      open={isActive}
      onClose={() => {
        onClose();
      }}>
      <div className="mx-auto p-8 bg-slate-200 shadow-lg">
        <h2 className="inline-flex justify-between items-center w-full text-2xl font-semibold mb-4 text-primary-dark">
          {dataset?.name}: New Issue
          <span
            id="owner details"
            className="flex flex-col ml-2 text-xs text-slate-600 italic tracking-wide">
            <span> Dataset Owner: {dataset?.datasetOwner?.name}</span>
            <span>
              Contact:{' '}
              {ownerDetails?.email ? (
                <a
                  href={`mailto:${ownerDetails?.email}`}
                  className="underline underline-offset-2 hover:text-accent-dark">
                  {dataset?.datasetOwner?.email}
                </a>
              ) : (
                'Not provided'
              )}
            </span>
          </span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <label htmlFor="subject" className="block text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 input-primary"
              placeholder="Enter issue title"
              required
              autoFocus={true}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 input-primary"
              placeholder="Describe the issue..."
              rows="5"
              required></textarea>
          </div>
          <div className="mb-4 w-full inline-flex justify-between items-center gap-2">
            <div className="w-full">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 input-primary"
                placeholder="Full name"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 input input-bordered"
                placeholder="Email address"
                required
              />
            </div>
          </div>
          {sentSuccess ? (
            <MessageWithTimeout
              message="Your message has been sent!"
              className="bg-green-500 rounded-btn text-white p-2"
              timeout={5000}
            />
          ) : (
            <></>
          )}
          <div className="mt-6 inline-flex justify-end w-full gap-4">
            <button
              type="cancel"
              className="btn btn-ghost text-danger rounded px-4 py-2"
              onClick={() => onClose()}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-outline btn-primary rounded px-4 py-2 hover:bg-primary-600"
              disabled={sending}>
              {sending && <span className="loading loading-spinner" />}
              {sending ? 'Sending...' : 'Send to Dataset Owner'}
            </button>
          </div>
        </form>
      </div>
    </SlideOver>
  );
};

export default IssueReportForm;
