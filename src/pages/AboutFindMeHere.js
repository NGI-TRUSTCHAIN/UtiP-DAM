import React from 'react';
import step1 from '../assets/images/findMeHere/step1.png';
import step2 from '../assets/images/findMeHere/step2.png';
import step3 from '../assets/images/findMeHere/step3.png';
import wave from '../assets/svgs/wavesOpacity.svg';

const h2ClassName = 'text-xl font-semibold text-start mt-6 text-slate-800 ';
const pClassName = 'mt-4 text-base text-justify text-slate-700 ';

const AboutFindMeHere = () => {
  return (
    <div className="w-full m-auto">
      <img src={wave} alt="" className="h-[30px] w-full" />;
      <div className="m-auto md:w-2/3 sm:w-3/4 xs:w-5/6 pb-12 text-primary-dark">
        <h1 className="text-4xl text-start font-semibold text-slate-800">
          What is the Find Me Here feature ?
        </h1>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-start mt-4">
            A little bit of background on mobility data and privacy risks
          </h2>
          <p className={pClassName}>
            Mobility data is constantly collected from our phones, apps, and
            public transport systems. While these datasets are typically
            anonymized prior to sharing (e.g., by replacing personal IDs with
            random numbers), research like Montjoye et al. (2013) highlights the
            potential risk of re-identification in anonymized mobility data.
            UtiP-DAM's "Find Me Here" feature tackles this challenge, offering
            citizens greater transparency and control over their data within the
            platform.
          </p>
          <h2 className={h2ClassName}>Here is how "Find Me Here" works:</h2>
          <div className={pClassName}>
            <ol className="list-decimal list-inside flex flex-col gap-2">
              <li>
                Anonymous Check: Without revealing your identity, you can check
                if your anonymized data is included in mobility datasets (only
                available for datasets shared on UtiP-DAM).
              </li>
              <li>
                Specific Search: You will need to select a date and the sequence
                of locations you visited on a user-friendly map interface.
                Indeed, there is no need to select a random date and/or random
                locations where and when you were not present as then, how could
                your data be captured at all?
              </li>
              <li>
                Privacy Risk Level: UtiP-DAM analyzes the anonymized dataset and
                provides a risk level based on the number of people who made the
                same journey as you. More people with the same path indicate
                stronger privacy protection.
              </li>
            </ol>
          </div>
          <h2 className={h2ClassName}>"Find Me Here" in practice.</h2>
          <p className={pClassName}>
            Let's take a look at the dataset named "EDGE La Rambla: Hotel 1898".
          </p>
          <p className={pClassName}>
            Lets's say that you visited La Rambla on the 17th of June and you
            walked along La Rambla from north to south, but exited La Rambla at
            around the middle of the street.
          </p>
          <h3 className={h2ClassName + 'text-xl'}>
            Here is how you would proceed
          </h3>
          <div className={pClassName + 'mb-4'}>
            <div className="mt-2">
              Step 1: Select the 17th of June
              <span className="m-4 flex w-[80%] justify-center">
                <img
                  src={step1}
                  alt="Step1: Select Date"
                  className="md:w-3/4 sm:w-4/5"
                />
              </span>
            </div>
            <div className="mt-8">
              Step 2: Select locations 4, then 2, then 1 (do not select location
              3, as you did not go there)
              <span className="m-4 flex w-[80%] justify-center">
                <img
                  src={step2}
                  alt="Step2: Select Locations"
                  className="md:w-3/4 sm:w-4/5"
                />
              </span>
            </div>
            <div className="mt-8">
              Step 3: Get your results!
              <span className="m-4 flex w-[80%] justify-center">
                <img
                  src={step3}
                  alt="Step3: Result"
                  className="md:w-3/4 sm:w-4/5"
                />
              </span>
            </div>
          </div>
          <h2 className={h2ClassName}>
            How should you understand the results of the mobility analysis?
          </h2>
          <p className={pClassName}>
            UtiP-DAM analyzes the dataset and lets you know how many people have
            done the same journey as you (895 other people, in the above
            example). The more people there are, the more your privacy is
            protected. In fact, UtiP-DAM lets you know how well protected your
            privacy is with a risk level: from no risk to high risk (very few
            people have done the same journey as you, so your privacy could be
            at risk).
          </p>
          <p className={pClassName}>
            Please note that in any event, UtiP-DAM always guarantees a minimum
            level of privacy for all citizens included in datasets shared on
            this website. Indeed, dataset owners can only publish their datasets
            after having gone through an anonymity audit and/or anonymization
            algorithm.
          </p>
          <h2 className={h2ClassName}>
            What if I don't want my data to be included in mobility datasets?
          </h2>
          <p className={pClassName}>
            We understand that, even if your journey was similar to 2,000 other
            people, you still might not want to have it included in the dataset
            at all. For this reason, we always include the dataset owner's
            contact information.
          </p>
          <p className={pClassName}>
            Feel free to reach out to them to request a deletion of your own
            journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutFindMeHere;
