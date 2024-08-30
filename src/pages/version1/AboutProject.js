import { MdOutlineAnnouncement } from 'react-icons/md';
import React from 'react';
import wave from '../../assets/svgs/wavesOpacity.svg';

const AboutProject = () => {
  return (
    <>
      <img src={wave} alt="" className="h-[30px]" />
      <div className="text-center relative flex max-h-1/2 flex-col justify-center items-center overflow-auto py-6 lg:pt-4 mb-12 sm:mb-16">
        <h2 className="prose prose-xl font-bold text-[#207792]">
          NGI Trustchain
        </h2>
        <div className="prose prose-xl font-semibold text-secondary-900">
          UtiP-DAM - "Utility-Preserving, Decentralized Anonymity of Mobility
          data"
        </div>
        <p className="prose prose-zinc mx-auto mt-6 lg:prose-md text-justify">
          Understanding crowd mobility is crucial for tackling challenges like
          climate change, urbanization, and disease control. But. <br />
          <blockquote className="capitalize">
            "How do we gain these insights while protecting individual privacy?"
          </blockquote>
          That&apos;s the mission of our 9-month project, undertaken in
          partnership and with the financial support of{' '}
          <a
            href="https://www.ngi.eu/"
            target="__blank"
            referrerPolicy="no-referrer"
            className="text-[#207792]">
            NGI Trustchain
          </a>
          . UtiP-DAM addresses the limitations of existing approaches. Standard
          anonymization methods can still reveal personal information, and
          centralized systems require blind trust in the controller.
          <blockquote className="capitalize">
            We propose a decentralized solution based on k-anonymity, where data
            is anonymized on EDGE devices, ensuring that even the controller
            cannot identify individuals.
          </blockquote>
          Additionally, we create auditing and verification tools for:
          <ol>
            <li>
              Data controllers to assess re-identification risks and anonymize
              their data
            </li>
            <li>
              Individuals and companies to verify if their data is included in
              public datasets
            </li>
          </ol>
          This project promotes transparency and trust through decentralization,
          while k-anonymity safeguards privacy even with linked datasets. Our
          auditing and verification tools further ensure the anonymized data
          remains valuable. Join us in building a future where understanding
          crowd mobility goes hand-in-hand with individual privacy.
          <hr />
        </p>
        <p className="prose prose-slate prose-md text-justify mt-6">
          <span className="text-secondary-900 font-semibold animate-pulse">
            Stay tuned for updates
            <MdOutlineAnnouncement className="ml-1 text-xl inline-flex" />
          </span>
          <br />
          <br />
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
                className="text-blue-800">
                Cyber Resilience Act
              </a>
              , requiring you to implement strict cybersecurity measures for
              your products. <br />
            </blockquote>
            Stay tuned about the Act&apos;s latest developments by signing up to
            our{' '}
            <a
              href="http://cyberresilienceact.eu"
              target="__blank"
              referrerPolicy="no-referrer"
              className="text-blue-800">
              newsletter
            </a>
            .
          </i>
        </p>
      </div>
    </>
  );
};

export default AboutProject;
