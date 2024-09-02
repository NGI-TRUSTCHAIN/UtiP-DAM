/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-webpack-loader-syntax */

import 'aos/dist/aos.css';

import { FaCrown, FaGithub } from 'react-icons/fa6';
import {
  GoBookmarkFill,
  GoLinkExternal,
  GoStarFill,
  GoTag,
} from 'react-icons/go';
import React, { useEffect, useState } from 'react';
import { TbFileDownload, TbFileSearch } from 'react-icons/tb';
import { datasetActions, datasetState } from '../store/dataset';
import { formattedCurrency, formattedNumber } from '../utils/Helper';
import { useDispatch, useSelector } from 'react-redux';

import AOS from 'aos';
import AnonymizeDataset from '../components/AnonymizeDataset';
import AuditDataset from '../components/AuditDataset';
import Continents from '../components/items/Continents';
import DatasetActionsMenuButton from '../components/items/DatasetActionsMenuButton';
import DatePicker from '../components/items/DatePicker';
import { DateTime } from 'luxon';
import DownloadDatePickerDialog from '../components/items/DownloadDatePickerDialog';
import FindMeHere from '../components/FindMeHere';
import Loader from '../components/items/Loader';
import MasonryLayout from '../components/items/MasonryLayout';
import { MdDownload } from 'react-icons/md';
import NoData from '../components/items/NoData';
import PurchaseDataset from '../components/PurchaseDataset';
import { RiSearchLine } from 'react-icons/ri';
import { SlideOver } from '../components/items/SlideOver';
import TagManager from 'react-gtm-module';
import ngiLogo from '../assets/images/logos/ngi_fund_logo.png';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init();
    TagManager.dataLayer({
      dataLayer: {
        page: 'home',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 h-full overflow-x-hidden">
      <div
        id="main-content"
        className="md:col-span-3 sm:col-span-4 xs:col-span-4 pt-3 flex flex-col items-center text-center">
        <BrandTop />
        <DatasetsDiv />
      </div>
      <div
        id="side-info"
        className="select-none lg:grid md:grid sm:hidden xs:hidden w-full h-fit m-2 pb-1 pr-1 rounded-lg overflow-y-auto scroll-smooth">
        <GitHubDiv />
        <AboutProject />
      </div>
    </div>
  );
};

const BrandTop = () => {
  return (
    <div
      id="brand-label"
      data-aos="fade-right"
      className="select-none bg-pattern w-[95%] bg-cover bg-center drop-shadow-xl rounded-lg text-white min-h-fit ring-1 ring-offset-secondary-700/20 hover:ring hover:ring-offset-secondary-900 hover:drop-shadow-2xl">
      <div
        id="glass-bg"
        className="glass rounded-lg px-[2.8rem] py-6 flex flex-col items-center text-start">
        <h2 className="w-full text-3xl text-balance leading-tight font-semibold text-shadow-sm">
          Anonymize, Audit, & Share Your Mobility Datasets. <br />
          Verify If Your Data is Included in Public Datasets.
        </h2>
        <span className="w-full text-sm text-slate-100 tracking-wide mt-4 text-start">
          Anonymize, audit, share, create <span>innovative</span> and{' '}
          <span>compliant</span> mobility solutions.
        </span>
      </div>
    </div>
  );
};

const DatasetsDiv = () => {
  const dispatch = useDispatch();

  const datasetsStatus = useSelector(datasetState.getDatasetsStatus);
  const datasetsData = useSelector(datasetState.selectDatasetsList);
  const downloadDatasetStatus = useSelector(
    datasetState.getDownloadDatasetStatus
  );

  const [loading, setLoading] = useState(false);

  const [viewData, setViewData] = useState(-1);
  const [feeFilter, setFeeFilter] = useState('all');
  const [searchStr, setSearchStr] = useState('');
  const [continent, setContinent] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showDatasetSlideOver, setShowDatasetSlideOver] = useState(false);
  const [selectedDatasetSlideOver, setSelectedDatasetSlideOver] =
    useState(false);
  const [findMeSlideOver, setFindMeSlideOver] = useState(false);
  const [filteredDataset, setFilteredDataset] = useState([]);
  const [selectedDatesToDownload, setSelectedDatesToDownload] = useState([]);
  const [downloadDatasetDetails, setDownloadDatasetDetails] = useState([]);
  const [purchaseDatasetSlideOver, setPurchaseDatasetSlideOver] =
    useState(false);

  const handleDataCalendarClick = (id) => {
    setViewData(viewData !== id ? id : -1);
  };

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

  const handleDownloadDatasetButtonClick = (dataset) => {
    if (dataset.fee === 0) {
      //free dataset
      renderDatesPicker(dataset);
    } else {
      //premium dataset
      setPurchaseDatasetSlideOver(dataset);
    }
  };

  const renderDatesPicker = (dataset) => {
    setDownloadDatasetDetails([]);
    if (dataset) {
      setDownloadDatasetDetails(dataset);
      document.getElementById('date-picker-modal').showModal();
    }
  };

  const handleSearch = (searchValue, searchBy = 'string') => {
    let result = datasetsData;
    const trimmedStr = searchValue?.trim().toLowerCase();

    if (searchBy === 'string') {
      setSearchStr(trimmedStr);
      if (trimmedStr.length > 0) {
        result = datasetsData?.filter(
          (x) =>
            (x.name.toLowerCase().includes(trimmedStr) ||
              x.description?.toLowerCase().includes(trimmedStr) ||
              x.countryCode?.toLowerCase().includes(trimmedStr)) &&
            (feeFilter === 'free' ? !x.fee : x.fee || !x.fee)
        );
      } else {
        setFilteredDataset(datasetsData);
        return;
      }
    } else if (searchBy === 'fee') {
      if (trimmedStr === 'free') {
        result = datasetsData?.filter((x) => !x.fee);
      } else {
        result = datasetsData;
        setContinent(null);
      }
    }
    setFilteredDataset(result);
  };

  const filterByContinent = (countriesList) => {
    let result;
    result = countriesList?.length
      ? datasetsData?.filter((dataset) =>
          countriesList.find(
            (x) => x.countryCode === dataset.countryCode?.toLowerCase()
          )
        )
      : datasetsData;
    setFilteredDataset(result);
  };

  const handleAnonymizeDatasetBtnClick = () => {
    setShowDatasetSlideOver(!showDatasetSlideOver);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init();
    dispatch(datasetActions.datasetsApiReq({}));
    setShowDatasetSlideOver(false);
  }, []);

  useEffect(() => {
    setFilteredDataset(datasetsData);
  }, [datasetsData]);

  useEffect(() => {
    setLoading(datasetsStatus.loading);
  }, [datasetsStatus.loading]);

  useEffect(() => {
    if (downloadDatasetStatus.ok) {
      setDownloadDatasetDetails([]);
      setSelectedDatesToDownload([]);
      document.getElementById('date-picker-modal').close();
    }
  }, [downloadDatasetStatus.ok]);

  return !loading ? (
    <>
      <div
        id="data-sets-container"
        className="w-full px-8 pt-8 pb-0 text-center">
        <div
          id="header-container"
          className="flex w-full justify-between items-center">
          <h3 className="font-bold text-secondary-900 text-xl capitalize">
            {feeFilter} Mobility Datasets {continent ? 'in ' + continent : ''}
            <span
              id="num-datasets"
              className="text-text-muted font-normal mx-1 text-[12px]">
              {formattedNumber(filteredDataset?.length || 0)} items
            </span>
          </h3>
          <button
            id="anonymize-datasets"
            className="btn btn-link btn-xs text-primary tracking-wide underline underline-offset-2 text-sm hover:text-accent-dark"
            onClick={handleAnonymizeDatasetBtnClick}>
            Anonymize, Audit and Sell Your Mobility Datasets!
          </button>
        </div>
        <div
          id="dataset-filter"
          className="mt-4 mb-2 flex flex-wrap gap-1 justify-start">
          <span className="flex gap-1 pr-2 mr-1 border-r-2 border-slate-300">
            <button
              className={`btn btn-sm text-secondary-500/70 ${
                feeFilter === 'all' ? 'bg-primary/70 text-white' : 'bg-neutral'
              } rounded-lg hover:bg-white hover:text-secondary-500 hover:ring-2 hover:ring-accent/70`}
              value
              onClick={() => {
                setFeeFilter('all');
                handleSearch('all', 'fee');
              }}>
              All
            </button>
            <button
              className={`btn btn-sm text-secondary-500/70 ${
                feeFilter === 'free' ? 'bg-primary/70 text-white' : 'bg-neutral'
              } rounded-lg  hover:bg-white hover:text-secondary-500 hover:ring-2 hover:ring-accent/70 `}
              onClick={() => {
                setFeeFilter('free');
                handleSearch('free', 'fee');
              }}>
              Free
            </button>
          </span>
          <Continents
            onSelect={({ continent: selectedContinent, countries }) => {
              if (continent !== selectedContinent) {
                setContinent(selectedContinent);
                filterByContinent(countries);
              } else {
                setContinent(null);
                filterByContinent();
              }
            }}
            selectedValue={continent}
          />
          <span className="inline-flex items-center">
            {showSearchBox && (
              <input
                type="text"
                className="input input-sm input-primary w-[10rem] mr-1"
                value={searchStr}
                placeholder="Search.."
                onChange={(e) => {
                  setSearchStr(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            )}
            <button
              className="btn btn-ghost btn-sm bg-neutral text-secondary-500/70 rounded-lg hover:bg-white hover:text-secondary-500 hover:ring-2 hover:ring-accent/70"
              onClick={() => setShowSearchBox(!showSearchBox)}>
              <RiSearchLine />
            </button>
          </span>
        </div>
        <hr />
        <div name="masonry-wrapper" className="max-h-[92vh] overflow-scroll">
          {datasetsStatus.error && (
            <NoData
              text={datasetsStatus.message}
              className={'text-slate-500'}
            />
          )}
          <MasonryLayout id="datasets-list" className="text-secondary-900">
            <div className="masonry-sizer" />
            {!filteredDataset?.length ? (
              <NoData text={'No matches found'} />
            ) : (
              filteredDataset.map((dataset) => (
                <div
                  key={dataset.datasetDefinitionId}
                  className="masonry-item mt-4">
                  <div
                    key={dataset.datasetDefinitionId}
                    data-aos="flip-down"
                    data-aos-offset="-3500"
                    className="min-h-[250px] max-h-max bg-neutral/50 shadow rounded-xl py-4 px-6 text-left">
                    <div
                      id="header"
                      className="w-full inline-flex justify-between items-center">
                      <span className="font-semibold tracking-wide text-ellipsis w-[80%] line-clamp-2">
                        {dataset.countryCode !== null && (
                          <span
                            className={`fi fi-${dataset.countryCode?.toLowerCase()}`}
                          />
                        )}{' '}
                        {dataset.name}
                        <div id="sub-header" className="grid text-sm">
                          <div className="inline-flex items-start gap-2">
                            {formattedCurrency(
                              dataset.fee,
                              dataset.fee?.currency
                            ) || 'Free'}
                            <span className="bg-slate-400 w-[1.5px] self-center h-3/5" />
                            <span className="inline-flex items-center gap-1">
                              <MdDownload className="text-primary font-sm mt-1" />{' '}
                              {formattedNumber(dataset.downloadCount ?? 0)}
                            </span>
                          </div>
                        </div>
                      </span>
                      <DatasetActionsMenuButton
                        className="flex self-start"
                        dataset={dataset}
                      />
                    </div>
                    <div
                      id="desc"
                      className="text-sm text-slate-600 my-4 tracking-normal leading-tight line-clamp-2">
                      {dataset.description || 'No description'}
                    </div>
                    <hr />
                    <div id="details" className="my-2 grid grid-cols-2 text-sm">
                      <div className="text-primary">
                        Resolution
                        <div className="font-bold text-text-lightDark text-xs capitalize my-2">
                          {dataset.resolution || 'daily'}
                        </div>
                      </div>
                      <div className="text-primary text-end">
                        Data Points
                        <div className="font-bold text-text-lightDark text-xs my-2">
                          {formattedNumber(dataset.dataPoints) || '0'}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div id="actions" className="mt-2 h-fit">
                      <div id="view-data" className="text-xs text-primary">
                        <button
                          className="btn btn-ghost btn-sm text-xs px-0 hover:bg-transparent hover:text-accent-dark"
                          onClick={() =>
                            handleDataCalendarClick(dataset.datasetDefinitionId)
                          }>
                          View Data Availability →
                        </button>
                        {viewData === dataset.datasetDefinitionId && (
                          <div
                            id="available-data"
                            className="py-4 h-[330px] min-w-fit overflow-x-auto">
                            <DatePicker
                              mode="multiple"
                              readonly={true}
                              dates={dataset.dates}
                            />
                          </div>
                        )}
                      </div>
                      <div className="w-full inline-flex justify-end items-center mt-3 gap-2">
                        <label
                          className={`tooltip ${
                            Boolean(dataset.fee)
                              ? 'tooltip-success'
                              : 'tooltip-primary'
                          }`}
                          data-tip={
                            formattedCurrency(
                              dataset.fee,
                              dataset.fee?.currency
                            ) || 'Free'
                          }>
                          <button
                            className="btn rounded-full btn-sm text-xs btn-outline text-primary inline-flex"
                            onClick={() =>
                              handleDownloadDatasetButtonClick(dataset)
                            }
                            disabled={false}>
                            <TbFileDownload className="text-lg hover:animate-raise" />{' '}
                            <span className="flex line-clamp-1 sm:hidden md:inline-flex">
                              Download
                            </span>{' '}
                            {Boolean(dataset.fee) && (
                              <span className="text-amber-400 sm:hidden md:inline-flex">
                                <FaCrown />
                              </span>
                            )}
                          </button>
                        </label>
                        <button
                          className="btn rounded-full btn-sm text-xs btn-outline text-primary inline-flex tooltip tooltip-primary"
                          data-tip={'Free'}
                          onClick={() => setFindMeSlideOver(dataset)}>
                          <TbFileSearch className="text-lg" />
                          <span className="flex line-clamp-1 sm:hidden md:inline-flex">
                            Find me here
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </MasonryLayout>
        </div>

        {showDatasetSlideOver && (
          <DatasetActionSelectDrawer
            open={showDatasetSlideOver}
            onClose={(selectedAction) => {
              setShowDatasetSlideOver(false);

              if (selectedAction) {
                setSelectedDatasetSlideOver(selectedAction);
              }
            }}
          />
        )}
        {selectedDatasetSlideOver === 'anonymize' ? (
          <AnonymizeDataset
            onClose={() => setSelectedDatasetSlideOver(false)}
          />
        ) : selectedDatasetSlideOver === 'audit' ? (
          <AuditDataset onClose={() => setSelectedDatasetSlideOver(false)} />
        ) : undefined}
        {Boolean(findMeSlideOver) && (
          <FindMeHere
            dataset={findMeSlideOver}
            onClose={() => setFindMeSlideOver(false)}
          />
        )}

        {Boolean(purchaseDatasetSlideOver) && (
          <PurchaseDataset
            dataset={purchaseDatasetSlideOver}
            onClose={() => setPurchaseDatasetSlideOver(false)}
          />
        )}
      </div>
      <DownloadDatePickerDialog
        dataset={downloadDatasetDetails}
        loading={downloadDatasetStatus.loading}
        onSelectedDates={(dates) => setSelectedDatesToDownload(dates)}
        onDownload={() => handleDownloadDataset()}
      />
    </>
  ) : (
    <Loader />
  );
};

export const GitHubDiv = () => {
  const [stars, setStars] = useState(0);
  const [updatedAt, setUpdatedAt] = useState('');

  const cachedData = JSON.parse(localStorage.getItem('cachedData'));
  // console.log('cachedData', cachedData);
  useEffect(() => {
    const fetchGitHubData = async () => {
      const token = process.env.REACT_APP_GITHUB_TOKEN;
      const headers = {
        Authorization: `token ${token}`,
      };

      try {
        if (
          cachedData &&
          Date.now() - cachedData.timestamp < 5 * 60 * 1000 /* 5 mins */
        ) {
          setStars(cachedData.stars); // Use cached data
          setUpdatedAt(cachedData.updatedAt);
        } else {
          const repoResponse = await fetch(
            `https://api.github.com/repos/NGI-TRUSTCHAIN/UtiP-DAM`,
            { headers }
          );
          const repoData = await repoResponse.json();
          setStars(repoData?.stargazers_count);
          setUpdatedAt(repoData?.updated_at);
          // Cache new data
          localStorage.setItem(
            'cachedData',
            JSON.stringify({
              stars: repoData?.stargazers_count,
              updatedAt: repoData?.updated_at,
              timestamp: Date.now(),
            })
          );
        }
      } catch (err) {}
    };
    fetchGitHubData();
  }, []);

  return (
    <div
      id="github-repo"
      data-aos="fade-left"
      className="bg-white shadow-md hover:shadow-sky-200 rounded-md text-primary text-sm px-6 py-4">
      <h4 className="text-lg font-semibold flex items-center">
        Explore Our GitHub
        <FaGithub className="mx-1" />
      </h4>
      <div className="mb-3">
        <p className="text-sm my-4 text-primary-dark capitalize">
          Download all UtiP-DAM tools on Github,{' '}
          <span className="font-semibold">for free!</span>
        </p>
        <a
          href="https://github.com/NGI-TRUSTCHAIN/UtiP-DAM"
          target="_blank"
          rel="noopener noreferrer">
          <button className="btn btn-xs btn-outline rounded-full btn-primary px-4">
            <GoLinkExternal />
            Go to Repository
          </button>
        </a>
      </div>
      <hr />
      <div id="repo-details" className="mt-2">
        <div className="font-semibold text-sm text-primary-dark">
          Repository Details
        </div>
        <div className="grid text-text-lightDark text-xs indent-4 gap-1 mt-2">
          <div id="version" className="flex items-center">
            <GoTag className="text-primary" />v{process.env.REACT_APP_VERSION}
          </div>
          <div id="date" className="flex items-center">
            <GoBookmarkFill className="text-sky-500" />
            {DateTime.fromISO(updatedAt).toFormat('D')}
          </div>
          <div id="stars" className="flex items-center">
            <GoStarFill className="text-sky-500" />
            {stars} Star{stars > 1 && 's'}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutProject = () => {
  return (
    <div
      id="about-project"
      data-aos="fade-left"
      className="bg-white shadow-lg hover:shadow-sky-200 rounded-md text-primary text-sm px-6 py-4 mt-5">
      <h4 className="text-lg font-semibold">About Utip-DAM</h4>
      <div className="text-sm leading-relaxed text-text-lightDark mt-4 text-pretty">
        Mobility data is valuable but sensitive. It helps understand movement
        patterns for legitimate purposes (e.g: tracking viral diseases), but
        raises privacy concerns because it can reveal personal information.{' '}
        <br />
        <br />
        <span className="font-bold">
          UtiP-DAM offers tools that solve this issue:
        </span>
        <br />
        <ul className="list-disc list-inside text-pretty  leading-relaxed">
          <li>
            Decentralized k-anonymity: Anonymize data without relying on a
            central controller, improving trust.
          </li>
          <li>
            Auditing tool: Identify de-anonymization risks in existing datasets.
          </li>
          <li>
            Verification tool: Allows individuals and companies to check public
            datasets for privacy risks.
          </li>
        </ul>
        <div id="project-benefit" className="my-4">
          <h6 className="font-bold">Benefits:</h6>
          <ul className="list-disc list-inside leading-relaxed">
            <li>Stronger privacy protection for individuals.</li>
            <li>Increased trust in mobility data use.</li>
            <li>Improved security against re-identification.</li>
          </ul>
        </div>
        <div
          id="notes"
          className="bg-accent/45 shadow-lg rounded text-text-lightDark mt-2 my-4 p-2 italic">
          The tools available on this site have been developed in partnerships
          and with the financial support of NGI Trustchain.
        </div>
        <hr />
        <div
          id="copyright"
          className="text-[11px] text-text-lightDark/90 mt-2 text-center">
          Copyright © {DateTime.now().get('year')}{' '}
          <a
            href="https://cs.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent hover:underline hover:underline-offset-1">
            Correlation Systems v{process.env.REACT_APP_VERSION}
          </a>
        </div>
      </div>

      <div id="ngi-logo" className="flex justify-center mt-2">
        <a href="https://www.ngi.eu/" target="_blank" rel="noopener noreferrer">
          <img src={ngiLogo} alt="ngi-logo" className="w-[6rem] rounded-md" />
        </a>
      </div>
    </div>
  );
};

export default Home;

const DatasetActionSelectDrawer = ({ open, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    isOpen && (
      <SlideOver
        id="dataset-action-select"
        title={'Anonymize, audit and sell your mobility dataset'}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose();
        }}
        disableCloseOnBackdropClicked={true}>
        <div id="content" className="mx-4 mt-2 select-none">
          <h2 className="font-semibold text-lg">What do you want to do?</h2>
          <div
            id="notes-desc"
            className="mt-3 mb-5 p-3 text-sm border-l-4 border-l-accent/70 shadow-md bg-accent/30">
            <h4 className="font-semibold mb-4">Notes</h4>
            <ul className="list list-disc list-outside pl-4 leading-relaxed text-sm">
              <li>
                You can only sell you mobility dataset on the Utip-DAM
                marketplace after first audit or anonymizing the data, to ensure
                that the dataset does not contain any identifying data.
              </li>
            </ul>
          </div>
          <div
            id="anonymize"
            className={`btn h-fit mt-4 px-12 py-8 rounded-lg items-center justify-center bg-neutral hover:bg-slate-100 ${selectedAction === 'anonymize' ? 'bg-primary/15 ring-2 ring-offset-4 ring-accent shadow-lg' : ''}`}
            onClick={() => setSelectedAction('anonymize')}>
            <h3
              className={`text-lg text-center capitalize font-bold mb-3 ${selectedAction === 'anonymize' ? 'text-primary-1200' : ''}`}>
              1. To anonymize my datasets
            </h3>
            <p className="text-sm text-justify opacity-80 leading-relaxed">
              Use this if your datasets have not yet been through an
              anonymization tool (i.e: your dataset contains only raw data).
            </p>
          </div>
          <div
            id="audit"
            className={`btn h-fit mt-4 px-12 py-8 rounded-lg items-center justify-center bg-neutral hover:bg-slate-100 ${selectedAction === 'audit' ? 'bg-primary/15 ring-2 ring-offset-4 ring-accent shadow-lg' : ''}`}
            onClick={() => setSelectedAction('audit')}>
            <h3
              className={`text-lg text-center capitalize font-bold mb-3 ${selectedAction === 'audit' ? 'text-primary-1200' : ''}`}>
              2. To audit my datasets
            </h3>
            <p className="text-sm text-justify opacity-80">
              Use this if your datasets have already been anonymized using third
              party tools or algorithms.
            </p>
          </div>
          <div
            id="action-buttons"
            className="w-full inline-flex justify-end gap-4 mt-6">
            <button
              className="btn btn-sm btn-error btn-outline"
              onClick={() => {
                onClose();
              }}>
              Cancel
            </button>
            <button
              className="btn btn-sm btn-primary min-w-20"
              onClick={() => onClose(selectedAction)}
              disabled={!selectedAction}>
              Next
            </button>
          </div>
        </div>
      </SlideOver>
    )
  );
};
