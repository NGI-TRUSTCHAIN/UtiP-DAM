import '../../assets/css/flatpickr.css';

import React, { useEffect, useRef, useState } from 'react';

import { DateTime } from 'luxon';
import Flatpickr from 'react-flatpickr';

const DatePicker = ({
  id = 'date-time-picker',
  mode = 'multiple', //* "multiple" or "range" , Default:single
  dates = null,
  onChange,
  onClose,
  inline = true,
  readonly = false,
  enableTimePicker = false,
  selectByDefault = false,
  options,
  className,
}) => {
  const flatpickrRef = useRef(null);
  const [defaultDates, setDefaultDates] = useState();

  const jsDateParser = (jsDate) => {
    const isoDate = DateTime.fromJSDate(new Date(jsDate)).toFormat('DDD');
    return isoDate;
  };

  useEffect(() => {
    setDefaultDates([]);
  }, []);

  useEffect(() => {
    setDefaultDates(dates);
  }, [dates]);

  if (defaultDates) {
    return (
      <div
        className={`inline items-center justify-center h-fit z-77 ${className ?? ''}`}>
        <Flatpickr
          ref={flatpickrRef}
          id={id}
          options={{
            enableTime: enableTimePicker,
            dateFormat: enableTimePicker ? 'Y-m-d H:i' : 'Y-m-d',
            inline: inline,
            mode: mode,
            defaultDate: defaultDates,
            enable: readonly ? [] : defaultDates,
            maxDate: defaultDates[defaultDates.length - 1],
            ...options,
          }}
          className={`w-full border rounded p-0 focus:outline-none focus:border-blue-50`}
          onChange={(selected) => {
            if (!readonly) onChange(selected);
          }}
          onDayCreate={(datesSelected, datesSelectedStr, fp, dayElem) => {
            let date = dayElem.getAttribute('aria-label');
            const found = defaultDates.find((d) => {
              return jsDateParser(d) === date;
            });
            if (!!found) {
              if (readonly)
                dayElem.innerHTML += `<span class='day exist'>${dayElem.textContent}</span>`;
              else if (selectByDefault)
                dayElem.innerHTML += `<span class='day selected'/>`;
            }
          }}
          onClose={() => {
            Boolean(onClose) && onClose();
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="inline items-center justify-center h-fit z-77">
        <Flatpickr
          ref={flatpickrRef}
          id={id}
          options={{
            enableTime: enableTimePicker,
            dateFormat: enableTimePicker ? 'Y-m-d H:i' : 'Y-m-d',
            inline: inline,
            mode: mode,
            defaultDate: defaultDates,
            maxDate: 'today',
            ...options,
          }}
          className="w-full border rounded p-0 focus:outline-none focus:border-blue-50"
          onChange={(selected) => {
            if (!readonly) onChange(selected);
          }}
          onDayCreate={(datesSelected, datesSelectedStr, fp, dayElem) => {
            dayElem.innerHTML += "<span class='data exist'></span>";
          }}
          onClose={() => onClose ?? onClose()}
        />
      </div>
    );
  }
};

export default DatePicker;
