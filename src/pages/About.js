import React, { useEffect } from 'react';

import Aos from 'aos';
import { DateTime } from 'luxon';
import { GitHubDiv } from './Home';
import TagManager from 'react-gtm-module';
import ngiLogo from '../assets/images/logos/NGI_Trustchain.png';
import wave from '../assets/svgs/wavesOpacity.svg';

const About = () => {
  useEffect(() => {
    Aos.init();
    window.scrollTo(0, 0);
    TagManager.dataLayer({
      dataLayer: {
        page: 'about',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  return (
    <div className="h-full">
      <img src={wave} alt="" className="h-[30px] w-full" />
      <div className="grid md:grid-cols-4 sm:grid-cols-1 overflow-y-auto pb-8">
        <div className="ml-6 md:col-span-3 sm:col-auto relative flex max-h-2/3 flex-col justify-center items-center overflow-auto py-6 lg:pt-4 mb-4">
          <div
            data-aos="flip-up"
            data-aos-offset="50"
            className="prose prose-2xl font-semibold text-secondary-900">
            UtiP-DAM - "Utility-Preserving, Decentralized Anonymity of Mobility
            data"
          </div>
          <div
            data-aos="fade-up"
            data-aos-offset="50"
            className="prose prose-gray text-primary-dark ml-6 mr-8 max-w-none mt-6 lg:prose-md text-justify block">
            Mobility data is valuable but sensitive. It helps understand
            movement patterns for legitimate purposes (e.g: tracking viral
            diseases), but raises privacy concerns because it can reveal
            personal information. UtiP-DAM offers tools that solve this issue:
            <br />
            <ul className="list-disc list-inside text-pretty  leading-relaxed">
              <li>
                Decentralized k-anonymity: Anonymize data without relying on a
                central controller, improving trust.
              </li>
              <li>
                Auditing tool: Identify de-anonymization risks in existing
                datasets.
              </li>
              <li>
                Verification tool: Allows individuals and companies to check
                public datasets for privacy risks.
              </li>
            </ul>
            Benefits:
            <ul className="list-disc list-inside leading-relaxed">
              <li>Stronger privacy protection for individuals.</li>
              <li>Increased trust in mobility data use.</li>
              <li>Improved security against re-identification.</li>
            </ul>
          </div>
        </div>
        <div className="h-fit rounded-lg mt-5 md:px-4 sm:px-8 xs:px-8">
          <GitHubDiv />
          <div className="prose prose-slate prose-sm text-pretty mt-6">
            <i>
              PS: Are you an IoT manufacturer or software developer distributing
              your products in the EU?
              <br />
              <blockquote className="text-sm">
                Then, your company will be affected by the soon to pass{' '}
                <a
                  href="http://cyberresilienceact.eu"
                  target="__blank"
                  referrerPolicy="no-referrer"
                  className="text-secondary-900">
                  Cyber Resilience Act
                </a>
                , requiring you to implement strict cybersecurity measures for
                your products. <br />
              </blockquote>
              Stay tuned about the Act&apos;s latest developments by signing up
              to our{' '}
              <a
                href="http://cyberresilienceact.eu"
                target="__blank"
                referrerPolicy="no-referrer"
                className="text-secondary-900">
                newsletter
              </a>
              .
            </i>
          </div>
        </div>
      </div>
      <div
        id="partnership-div"
        className="fixed -bottom-4 w-full flex justify-between bg-neutral/70 text-text-lightDark mb-4 p-4 italic md:px-4 sm:px-8 xs:px-8">
        <div className="text-sm flex">
          The tools available on this site have been developed in partnerships
          and with the financial support of
          <a
            href="https://www.ngi.eu/"
            target="_blank"
            rel="noopener noreferrer">
            <img
              src={ngiLogo}
              alt="ngi-logo"
              className="inline-flex min-h-8 max-h-2 ml-2 items-center"
            />
          </a>
        </div>
        <div
          id="copyright"
          className="text-[12px] text-text-lightDark/90 text-center mb-3">
          Copyright © {DateTime.now().get('year')}{' '}
          <a
            href="https://cs.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-dark hover:underline hover:underline-offset-1">
            Correlation Systems v{process.env.REACT_APP_VERSION}
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
