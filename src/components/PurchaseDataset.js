/* eslint-disable react-hooks/exhaustive-deps */

import { FaCcPaypal, FaMoneyBillTransfer } from 'react-icons/fa6';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import Cookies from 'universal-cookie';
import DatePicker from './items/DatePicker';
import { DateTime } from 'luxon';
import IssueReportForm from './IssueReportForm';
import Loader from './items/Loader';
import MessageWithTimeout from './items/MessageWithTimeout';
import Modal from './items/Modal';
import PayPalButton from './items/PayPalButton';
import Signup from './Signup';
import { SlideOver } from './items/SlideOver';
import { isEqual } from 'lodash';
import { useState } from 'react';

const PAYMENT_TYPES = { paypal: 'Paypal', bankTransfer: 'Bank Transfer' };
const STEPS = {
  choosePayment: 1,
  purchaseDetails: 2,
  payment: 3,
  endOfPurchase: 4,
};

const PurchaseDataset = ({ dataset, onClose }) => {
  const slideRef = useRef();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  let hasToken = !!cookies.get('token');
  const checkoutStatus = useSelector(datasetState.getCheckoutStatus);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(null);
  const [payType, setPayType] = useState(PAYMENT_TYPES.paypal);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [checkoutValues, setCheckoutValues] = useState({});
  const [cancelWarning, setCancelWarning] = useState(false);
  const [enableNextStep, setEnableNextStep] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState(false);
  const [openIssueReportForm, setOpenIssueReportForm] = useState(false);

  useEffect(() => {
    setStep(STEPS.choosePayment);
  }, []);

  useEffect(() => {
    setIsAuthenticated(hasToken);
  }, [hasToken]);

  useEffect(() => {
    if (checkoutStatus.ok) {
      if (hasError) {
        setStep(step + 1);
      } else {
        setEnableNextStep(true);
        if (payType.toLowerCase().includes('bank')) {
          setStep(step + 1);
        }
      }
    } else if (checkoutStatus.error) {
      setHasError(true);
      setMessage({
        type: 'error',
        text: 'An error occurred while saving your purchase details. Please contact our support team to verify your purchase status.',
      });
    }
  }, [checkoutStatus]);

  const onCloseSlide = () => {
    dispatch(datasetActions.initializeState({ key: 'checkout' }));
    setOpen(false);
    onClose();
  };

  const onPaymentTypeButtonClick = (payment) => {
    setPayType(payment);
  };

  const handleNextStepClick = (e) => {
    e.preventDefault();
    setEnableNextStep(false);

    if (step === STEPS.endOfPurchase) onClose();
    else if (step === STEPS.payment && payType.toLowerCase().includes('bank')) {
      handleCheckout();
    } else {
      setStep(step + 1);
    }
  };

  const handleCancelClick = () => {
    if (step === STEPS.choosePayment) onClose();
    else if (step === STEPS.payment) {
      setCancelWarning(!cancelWarning);
    } else setStep(step - 1);
  };

  const handleCheckout = (details) => {
    const checkoutData = {
      datasetDefinitionId: dataset.datasetDefinitionId,
      currency: 'EUR',
      paymentSource: 'paypal',
      selectedDate: false,
      futureDate: false,
      ...details,
      ...checkoutValues,
    };

    dispatch(
      datasetActions.checkoutApiReq({
        data: { ...checkoutData },
      })
    );
  };

  if (!isAuthenticated)
    return (
      <SlideOver
        ref={slideRef}
        title={`Purchase dataset - ${dataset.name}`}
        open={open}
        onClose={onCloseSlide}>
        <div className="text-slate-500 mb-10 font-bold text-center">
          Please log in to your account to proceed with the purchase
        </div>
        <Signup
          hasAccount={true}
          showFooter={false}
          showBgImage={false}
          onSubmitSuccess={() => {
            setIsAuthenticated(true);
          }}
        />
      </SlideOver>
    );

  return (
    <>
      dataset && (
      <SlideOver
        ref={slideRef}
        title={`Purchase dataset - ${dataset.name}`}
        open={open}
        disableCloseOnBackdropClicked={true}
        onCloseButtonClick={() =>
          step === STEPS.payment ? setCancelWarning(true) : onCloseSlide()
        }>
        {step === STEPS.choosePayment ? (
          <ChoosePayment
            onSubmit={(value) => {
              onPaymentTypeButtonClick(value);
              setEnableNextStep(true);
            }}
          />
        ) : step === STEPS.purchaseDetails ? (
          <PurchaseDetails
            paymentType={payType}
            dataset={dataset}
            availableDates={dataset.dates}
            onSelectedDatesToPurchase={(dates) => {
              let selectedDatasets = dates.map((date) => {
                const selectedIdx = dataset?.dates.findIndex((i) => i === date);
                return dataset?.datasets[selectedIdx];
              });
              setCheckoutValues({
                ...checkoutValues,
                datasetIds: selectedDatasets.map((i) => i.id),
                selectedDate: true,
              });
            }}
            onFutureDataSelected={(month) => {
              if (month)
                setCheckoutValues({
                  ...checkoutValues,
                  futureDate: true,
                  monthLicense: month,
                });
            }}
            onAllPastDataSelected={(isSelected) => {
              if (isSelected)
                setCheckoutValues({
                  ...checkoutValues,
                  datasetIds: null,
                  pastDate: true,
                  selectedDate: false,
                });
              else {
                setCheckoutValues({
                  ...checkoutValues,
                  pastDate: false,
                });
              }
            }}
            onTotalPriceChange={(price) => {
              setPurchasePrice(price);
              setCheckoutValues({
                ...checkoutValues,
                totalAmount: price.toFixed(1),
              });
              setEnableNextStep(price > 0);
            }}
          />
        ) : step === STEPS.payment ? (
          <div>
            {payType.toLowerCase().includes('paypal') ? (
              <PayPalButton
                amount={purchasePrice}
                onPaymentApprove={(details, status, message) => {
                  setHasError(false);
                  setMessage({ type: 'info', text: message });
                  handleCheckout({
                    payerId: details?.payerID,
                    paymentId: details?.paymentID,
                    paymentStatus: status,
                  });
                }}
                onPaymentError={(paymentError, status) => {
                  setHasError(true);
                  setMessage({ type: 'error', text: paymentError });
                  handleCheckout({
                    paymentStatus: status,
                  });
                }}
              />
            ) : (
              <BankTransferPayment
                dispatch={dispatch}
                datasetId={dataset.datasetDefinitionId}
                datasetPrice={purchasePrice}
                onError={(err) => {
                  setHasError(true);
                  setMessage({ type: 'error', text: err });
                  handleCheckout({
                    paymentStatus: 'FAILED',
                  });
                }}
                onDataLoaded={(isLoaded) => {
                  setCheckoutValues({
                    ...checkoutValues,
                    paymentStatus: 'PENDING',
                    paymentSource: PAYMENT_TYPES.bankTransfer.toLowerCase(),
                  });
                  setEnableNextStep(isLoaded);
                }}
              />
            )}
          </div>
        ) : (
          <div
            id="end-of-purchase"
            className="flex w-full h-1/2 justify-center items-center bg-slate-100 rounded-box ">
            {!hasError ? (
              <div className="w-1/2 text-center">
                <h2 className="text-xl font-bold mb-6 text-primary-1400">
                  Thank you for your interest!
                </h2>
                {payType.toLowerCase().includes('paypal') ? (
                  <div id="paypal-purchase-end">
                    <a
                      href="/my-account"
                      className="link-primary underline underline-offset-1 text-sm">
                      Go to Your Account to download the dataset
                    </a>
                  </div>
                ) : (
                  <div id="bank-transfer-end">
                    <p className="text-sm text-justify">
                      If you need to contact the dataset owner regarding the
                      status of your purchase, use the email below:
                      <ContactEmail email={dataset.datasetOwner.email} />
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div id="error-purchase-end" className="w-2/3 text-center">
                <MessageWithTimeout
                  timeout={false}
                  className="text-red-700 font-bold mb-4">
                  {message.text}
                </MessageWithTimeout>
                <p className="text-sm text-center">
                  If you need to contact the dataset owner regarding the status
                  of your purchase, use the email below:
                  <ContactEmail email={dataset.datasetOwner.email} />
                </p>
                <button
                  className="btn btn-sm btn-link mt-4 float-end text-xs text-slate-500"
                  onClick={() => setOpenIssueReportForm(true)}>
                  Report issue to Utip-DAM
                </button>
                <IssueReportForm
                  dataset={dataset}
                  isActive={openIssueReportForm}
                  onClose={() => setOpenIssueReportForm(false)}
                />
              </div>
            )}
          </div>
        )}
        <div id="actions" className="mt-4 flex justify-end space-x-4">
          <div id="message-section" className="w-full">
            {message && (
              <MessageWithTimeout
                timeout={6 * 1000}
                className="px-0 py-0 text-error">
                <div className={`py-3 text-sm`}>
                  <span
                    className={`font-semibold text-center ${
                      message.type === 'error'
                        ? 'text-red-700'
                        : 'text-primary-1400'
                    }`}>
                    {message.text}
                  </span>
                </div>
              </MessageWithTimeout>
            )}
          </div>
          {step !== STEPS.endOfPurchase && (
            <button
              type="button"
              className="btn btn-error btn-outline"
              onClick={handleCancelClick}>
              {step === STEPS.choosePayment || STEPS.payment
                ? 'Cancel'
                : 'Back'}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNextStepClick}
            disabled={
              step === STEPS.endOfPurchase ? false : hasError || !enableNextStep
            }>
            {step === STEPS.endOfPurchase ? 'Close' : 'Next'}
          </button>
        </div>
        {cancelWarning && (
          <CancelPurchaseModal
            isOpen={cancelWarning}
            onClose={() => setCancelWarning(false)}
            onConfirm={() => onCloseSlide()}
          />
        )}
      </SlideOver>
      );
    </>
  );
};

const ContactEmail = ({ email }) => {
  return (
    <span className="block mt-4 text-center bg-primary/5 p-2">
      <a
        href={`@mailto:${email}`}
        className="link-primary underline underline-offset-1 text-sm tracking-wide">
        {email}
      </a>
    </span>
  );
};
const ChoosePayment = ({ onSubmit }) => {
  const [payment, setPayment] = useState(false);

  const onPaymentClick = (value) => {
    setPayment(value);
    onSubmit(value);
  };

  return (
    <div className="mx-4">
      <h4 className="font-bold text-lg text-slate-800 mb-4">
        How would you like to purchase this dataset?
      </h4>
      <Notes
        notesList={[
          'You can pay either via PayPal or via bank transfer.',
          'Purchasing via PayPal enables you to access the dataset right away, while bank transfer payments require that the money be received by the dataset owner before providing you access to the dataset.',
        ]}
      />
      <div id="payment-methods">
        <div
          name="paypal"
          className={`btn btn-block h-fit mb-4 p-4 bg-gray-100 rounded ${
            isEqual(payment, PAYMENT_TYPES.paypal) ? 'ring-2 ring-offset-2' : ''
          }`}
          onClick={() => onPaymentClick(PAYMENT_TYPES.paypal)}>
          <h4 className="font-bold text-lg flex justify-center items-center gap-3">
            I want to pay via
            <FaCcPaypal size={45} />
          </h4>
          <p className="text-xs mt-4 font-normal">
            Use this to get quick access to the dataset, but note that Ubi-DAM
            will collect some personal information on you and/or your company in
            order to process the payment.
          </p>
        </div>
        <div
          className={`btn btn-block h-fit mb-4 p-4 bg-gray-100 rounded ${
            isEqual(payment, PAYMENT_TYPES.bankTransfer)
              ? 'ring-2 ring-offset-2'
              : ''
          }`}
          onClick={() => onPaymentClick(PAYMENT_TYPES.bankTransfer)}>
          <h4 className="font-bold text-lg flex items-center gap-1">
            I want to pay via Bank Transfer
            <FaMoneyBillTransfer />
          </h4>
          <p className="text-xs mt-4 font-normal">
            Bank transfer payments require for the dataset owner to manually
            activate access to the dataset, once they have received your
            payment.
          </p>
        </div>
      </div>
    </div>
  );
};

const PurchaseDetails = ({
  paymentType,
  dataset,
  availableDates,
  onSelectedDatesToPurchase,
  onFutureDataSelected,
  onAllPastDataSelected,
  onTotalPriceChange,
}) => {
  const paypalNotes = [
    'In order to process your payment via Paypal, UtiP-DAM must collect some information on you and/or your company.',
  ];
  const bankTransferNotes = [
    'Bank transfer payments are between you and the dataset owner directly.',
    'Upon reception of the transfer, the dataset owner will activate access to the dataset and you will be able to download it from your account.',
  ];

  const [pastDataPrice, setPastDataPrice] = useState({ allData: 0, perDay: 0 });
  const [upcomingDataPrices, setUpcomingDataPrices] = useState({
    fee3mo: 0,
    fee6mo: 0,
    fee12mo: 0,
  });
  const [calendarDates, setCalendarDates] = useState([]);
  const [selectedDatesToDownload, setSelectedDatesToDownload] = useState([]);
  const [allPastDataPrice, setAllPastDataPrice] = useState(0);
  const [selectedPastDataPrice, setSelectedPastDataPrice] = useState(0);
  const [futureDataPrice, setFutureDataPrice] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  const [allPastDataChecked, setAllPastDataChecked] = useState(false);

  useEffect(() => {
    if (dataset) {
      setPastDataPrice({
        allData: dataset.fee || 0,
        perDay: dataset.fee1d || 0,
      });
      setUpcomingDataPrices({
        fee3mo: dataset.fee3mo || 0,
        fee6mo: dataset.fee6mo || 0,
        fee12mo: dataset.fee12mo || 0,
      });
    }
  }, [dataset]);

  useEffect(() => {
    setCalendarDates(availableDates);
  }, [availableDates]);

  useEffect(() => {
    if (allPastDataChecked) {
      const removeCalendarPrice = async () => {
        const calendarDatesPrice =
          pastDataPrice.perDay * selectedDatesToDownload.length;
        setTotalPrice(totalPrice - calendarDatesPrice);
      };
      removeCalendarPrice().then(() =>
        setSelectedDatesToDownload(calendarDates)
      );
    } else {
      setCalendarDates(availableDates);
      setSelectedDatesToDownload([]);
    }
    onAllPastDataSelected(allPastDataChecked);
  }, [allPastDataChecked, calendarDates]);

  useEffect(() => {
    if (allPastDataChecked) {
      setTotalPrice(allPastDataPrice + futureDataPrice);
    } else setTotalPrice(futureDataPrice + selectedPastDataPrice);
  }, [futureDataPrice, allPastDataPrice, selectedPastDataPrice]);

  useEffect(() => {
    onTotalPriceChange(totalPrice);
  }, [totalPrice]);

  const handleSelectAllPastDataChange = (e) => {
    if (e.target.checked) {
      setAllPastDataPrice(pastDataPrice.allData);
    } else {
      setAllPastDataPrice(0);
    }
  };

  const handleDatePickerChange = (dates) => {
    let tmpIsoDates = [];
    dates?.forEach((date) => {
      const jsDate = new Date(date);
      const isoDate = DateTime.fromJSDate(jsDate).toFormat('yyyy-MM-dd');
      tmpIsoDates.push(isoDate);
    });
    setSelectedDatesToDownload(tmpIsoDates);
    setSelectedPastDataPrice(pastDataPrice.perDay * tmpIsoDates.length);
    onSelectedDatesToPurchase(tmpIsoDates);
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">Purchase via {paymentType}</h2>
      <Notes
        notesList={
          paymentType.toLowerCase().includes('paypal')
            ? paypalNotes
            : bankTransferNotes
        }
      />
      <div id="calculate-cost">
        <h4 className="font-semibold mb-4">
          Calculate the cost of your purchase
        </h4>
        <div id="purchase-data-selection" className="">
          <div className="flex items-start gap-x-6 justify-center">
            <div
              id="purchase-past-data"
              className="bg-white shadow-lg flex-1 p-6 border rounded-lg">
              <h2 className="font-bold mb-4 text-primary-1400">
                Purchase Past Data
              </h2>
              <DatePicker
                id="download-dataset-date-picker"
                mode="multiple"
                dates={calendarDates}
                readonly={allPastDataChecked}
                inline={true}
                selectByDefault={true}
                onChange={handleDatePickerChange}
              />
              <div className="full-inline-between mt-4">
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    onChange={(e) => {
                      handleSelectAllPastDataChange(e, pastDataPrice?.allData);
                      setAllPastDataChecked(!allPastDataChecked);
                    }}
                  />
                  <label className="ml-1 text-sm ">
                    Select all past data{' '}
                    <b>(€ {pastDataPrice?.allData ?? '-'} )</b>
                  </label>
                </span>
                {!allPastDataChecked && (
                  <div className="text-xs text-slate-500">
                    € {pastDataPrice?.perDay ?? '-'} x{' '}
                    {selectedDatesToDownload.length} day
                    {selectedDatesToDownload.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div
                id="purchase-future-data"
                className="bg-white shadow-lg flex-1 p-6 border rounded-lg">
                <h2 className="font-bold mb-4 text-primary-1400">
                  Purchase Upcoming Data
                </h2>
                <p className="mb-4">
                  This dataset benefits from{' '}
                  <span className="font-semibold">daily</span> data uploads.
                </p>
                <div className="space-y-5 mt-8 text-sm capitalize">
                  <div className="flex items-center">
                    <div className="join flex-col gap-4 w-full mx-2">
                      {[
                        {
                          label: '3 months license',
                          price: upcomingDataPrices?.fee3mo,
                          value: 3,
                        },
                        {
                          label: '6 months license',
                          price: upcomingDataPrices?.fee6mo,
                          value: 6,
                        },
                        {
                          label: '12 months license',
                          price: upcomingDataPrices?.fee12mo,
                          value: 12,
                        },
                      ].map((i, idx) => (
                        <input
                          key={idx}
                          className="btn btn-outline capitalize"
                          type="radio"
                          name="options"
                          aria-label={i.label}
                          onClick={() => {
                            setFutureDataPrice(i.price);
                            onFutureDataSelected(i.value);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right mt-6">
                <p className="text-xl font-semibold">Total: {totalPrice} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankTransferPayment = ({
  dispatch,
  datasetId,
  datasetPrice,
  onError,
  onDataLoaded,
}) => {
  const [bankDetails, setBankDetails] = useState(false);

  const datasetData = useSelector(datasetState.getDatasetData);
  const datasetStatus = useSelector(datasetState.getDatasetStatus);

  useEffect(() => {
    dispatch(datasetActions.datasetGetApiReq({ params: datasetId }));
    onDataLoaded(false);
  }, []);

  useEffect(() => {
    if (datasetStatus.ok) {
      if (datasetData?.vendor !== null) {
        setBankDetails(datasetData?.vendor);
        onDataLoaded(true);
      } else onError("We couldn't find the vendor's bank account details.");
    } else if (datasetStatus.error)
      onError(datasetStatus.message?.error ?? 'Error occurred.');
  }, [datasetStatus, datasetData]);

  return (
    <div>
      <h2 className="mb-4 font-bold">Bank Transfer Payment Details</h2>
      <div className="rounded-box border border-sky-200 bg-sky-100 p-4 text-sm tracking-wide leading-6">
        <div className="text-base">
          Dataset Price: <span className="font-bold px-2">{datasetPrice}€</span>
        </div>
        {datasetStatus.loading ? (
          <Loader
            id="loader"
            fixed={false}
            message={'Loading..'}
            className="py-2 text-center"
          />
        ) : (
          <>
            <div className="mt-4">
              Company Name:
              <span className="font-semibold px-2">
                {bankDetails?.companyName ?? '-'}
              </span>
            </div>
            <div>
              Company Address:
              <span className="font-semibold px-2">
                {bankDetails?.companyAddress ?? '-'}
              </span>
            </div>
            <div>
              Registration Number:
              <span className="font-semibold px-2">
                {bankDetails?.companyRegNo ?? '-'}
              </span>
            </div>
            <div>
              VAT Number:
              <span className="font-semibold px-2">
                {bankDetails?.companyVatNo ?? '-'}
              </span>
            </div>
            <div>
              Contact Information:
              <span className="font-semibold px-2">
                {bankDetails?.companyAddress ?? '-'}
              </span>
            </div>
            <div className="mt-4">
              Bank Account Number:
              <span className="font-semibold px-2">
                {bankDetails?.accountNo ?? '-'}
              </span>
            </div>
            <div>
              Account Name:
              <span className="font-semibold px-2">
                {bankDetails?.accountName ?? '-'}
              </span>
            </div>
            <div>
              Bank Name:
              <span className="font-semibold px-2">
                {bankDetails?.bankName ?? '-'}
              </span>
            </div>
            <div>
              Bank Location:
              <span className="font-semibold px-2">
                {bankDetails?.country ?? '-'}
              </span>
            </div>
            <div>
              SWIFT Code:
              <span className="font-semibold px-2">
                {bankDetails?.swiftCode ?? '-'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Notes = ({ notesList }) => {
  return (
    <div
      id="notes"
      className="mb-4 p-4 bg-blue-100 border-l-blue-400 border-l-4 text-blue-800 rounded">
      <p className="font-bold text-sm">Notes:</p>
      <ul className="list-disc list-inside text-xs leading-6">
        {notesList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const CancelPurchaseModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnClickOutside={true}>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-6">Cancel Purchase</h3>
        <p className="mb-8 text-sm text-justify">
          <span className="text-base text-slate-600">
            Are you sure you want to cancel this purchase?
          </span>
          <span className="block mt-6">
            <b>
              By clicking on "Cancel" Purchase, we will erase all trace of this
              potential transaction,
            </b>{' '}
            which will make it much harder for the dataset owner to identify
            your account and provide access to the dataset, if you later choose
            to purchase the dataset.
          </span>
          <span className="block mt-4">
            <b>If you intend to purchase the dataset</b> but will proceed the
            payment at a later date, come back to the previous step and click on
            the "Confirm" button instead. This will ensure that the dataset
            owner can find your account and provide access to the dataset once
            the payment is received.
          </span>
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline btn-sm " onClick={onConfirm}>
            Cancel Purchase
          </button>
          <button
            className="btn btn-primary btn-sm w-[200px]"
            onClick={onClose}>
            Go Back
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseDataset;
