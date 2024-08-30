import React, { lazy, useEffect, useState } from 'react';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';

import Aos from 'aos';
import Footer from '../components/defaultLayout/Footer';
import TagManager from 'react-gtm-module';

const MessageWithTimeout = lazy(
  () => import('../components/items/MessageWithTimeout')
);

const Contact = () => {
  const dispatch = useDispatch();

  const emailSendStatus = useSelector(datasetState.getEmailSendStatus);

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    email: '',
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    Aos.init();
    window.scrollTo(0, 0);
    dispatch(datasetActions.initializeState({ key: 'send_email' }));
    TagManager.dataLayer({
      dataLayer: {
        page: 'contact',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  useEffect(() => {
    setSending(emailSendStatus.loading);
    setSentSuccess(emailSendStatus.ok);
    if (emailSendStatus.ok) {
      setFormData({
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      datasetActions.emailSendApiReq({
        data: {
          name: formData.name,
          contactEmail: formData.email,
          message: formData.message,
        },
      })
    );
  };

  return (
    <div className="hero min-h-[93vh] overflow-clip bg-people bg-right-bottom">
      <div className="w-screen h-full bg-base-200/50 inline-flex justify-center items-center md:p-0 sm:px-8 xs:px-8 ">
        <div className="hero-content md:w-4/6 sm:w-full xs:w-full sm:px-0 xs:px-4 md:flex-row sm:flex-col xs:flex-col justify-around items-center">
          <div
            data-aos="fade-down"
            className="w-full text-nowrap sm:text-center xs:text-center">
            <h1 className="md:text-7xl xs:text-4xl font-bold text-primary-1200">
              Get in touch
            </h1>
            <p className="">We are here for you! How can we help?</p>
          </div>
          <div
            data-aos="fade-up"
            className="card shrink-0 md:w-2/3 sm:w-full shadow-lg shadow-slate-300 bg-base-100/70 hover:shadow-primary/40">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Text your full name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <label htmlFor="email" className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Text your email address"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="message" className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="textarea textarea-bordered"
                  placeholder="Text your message.."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control mt-6">
                {sentSuccess && (
                  <MessageWithTimeout
                    message="Your message has been sent! We'll get back to you shortly."
                    className="text-success-darker font-semibold pb-2 px-0"
                    timeout={5000}
                  />
                )}
                <button
                  className={`btn btn-${sentSuccess ? 'success' : sending ? 'secondary' : 'primary'}`}
                  type="submit"
                  disabled={sending}>
                  {sending && <span className="loading loading-spinner" />}
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer float={true} />
    </div>
  );
};

export default Contact;
