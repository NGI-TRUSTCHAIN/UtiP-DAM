import { DateTime } from 'luxon';
import React from 'react';
import ngiLogo from '../../assets/images/logos/NGI_Trustchain.png';

const Footer = ({ float }) => {
  if (float) {
    return (
      <div
        id="copyright"
        className=" w-full fixed bottom-0 pt-2 text-[12px] text-text-lightDark/90 text-center mb-3">
        Copyright © {DateTime.now().get('year')}{' '}
        <a
          href="https://cs.co.il/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-dark hover:underline hover:underline-offset-1">
          Correlation Systems v{process.env.REACT_APP_VERSION}
        </a>
      </div>
    );
  }
  return (
    <div className="footer w-full fixed bottom-0 pt-2 border border-b-0 border-t-2 flex justify-center items-center px-4 pb-3 gap-3 bg-white">
      <span className="flex">
        <a href="https://www.ngi.eu/" target="_blank" rel="noopener noreferrer">
          <img
            className="max-h-12 relative w-50 inline-flex"
            src={ngiLogo}
            alt="NGI"
          />
        </a>
      </span>
      <div>
        <div className="flex-1 font-semibold text-text-muted italic  md:table sm:hidden">
          The tools available on this site have been developed in partnerships
          and with the financial support of{' '}
          <a
            href="https://www.ngi.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 hover:text-blue-300">
            NGI Trustchain
          </a>
          .
        </div>
        <div className="text-start text-xs text-text-muted font-normal">
          Copyright &copy; {DateTime.now().year}{' '}
          <a
            className="underline font-medium text-primary-dark hover:text-blue-600"
            href="https://cs.co.il/"
            target="_blank"
            rel="noopener noreferrer">
            Correlation Systems
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
